import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAI } from '@ai-sdk/openai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import {
  type CoreMessage,
  type Tool,
  generateObject,
  generateText,
  streamText,
} from 'ai';
import type { z } from 'zod';
import { keys as envKeys } from '../keys';
import { Model, Provider } from './config';
import { saveAiUsage } from './usage';

function getDefaultProvider(): string {
  const keys = envKeys();
  if (keys.OPENAI_API_KEY) {
    return Provider.OPEN_AI;
  }
  if (keys.ANTHROPIC_API_KEY) {
    return Provider.ANTHROPIC;
  }
  if (keys.GROQ_API_KEY) {
    return Provider.GROQ;
  }
  if (keys.GROK_API_KEY) {
    return Provider.GROK;
  }
  if (keys.OPENROUTER_API_KEY) {
    return Provider.OPENROUTER;
  }
  if (keys.GOOGLE_API_KEY) {
    return Provider.GOOGLE;
  }
  throw new Error(
    'No AI provider found. Please set at least one API key in the environment variables.'
  );
}

function getModel({
  aiProvider,
  aiModel,
  aiApiKey,
}: {
  aiProvider: string | null;
  aiModel: string | null;
  aiApiKey: string | null;
}) {
  const keys = envKeys();
  const provider = aiProvider || getDefaultProvider();

  if (provider === Provider.OPEN_AI) {
    const model = aiModel || Model.GPT_4O;
    return {
      provider: Provider.OPEN_AI,
      model,
      llmModel: createOpenAI({
        apiKey: aiApiKey || keys.OPENAI_API_KEY,
      })(model),
    };
  }

  if (provider === Provider.ANTHROPIC && aiApiKey) {
    const model = aiModel || Model.CLAUDE_3_7_SONNET;
    return {
      provider: Provider.ANTHROPIC,
      model,
      llmModel: createAnthropic({
        apiKey: aiApiKey,
      })(model),
    };
  }

  if (provider === Provider.GOOGLE) {
    // biome-ignore lint/style/useBlockStatements: <explanation>
    if (!aiApiKey) throw new Error('Google API key is required');
    const model = aiModel || Model.GEMINI_1_5_PRO;
    return {
      provider: Provider.GOOGLE,
      model,
      llmModel: createGoogleGenerativeAI({
        apiKey: aiApiKey,
      })(model),
    };
  }

  if (provider === Provider.GROQ) {
    // biome-ignore lint/style/useBlockStatements: <explanation>
    if (!aiApiKey) throw new Error('Groq API key is required');
    const model = aiModel || Model.GROQ_LLAMA_3_3_70B;
    return {
      provider: Provider.GROQ,
      model,
      llmModel: createGroq({
        apiKey: aiApiKey,
      })(model),
    };
  }

  if (provider === Provider.OPENROUTER) {
    // biome-ignore lint/style/useBlockStatements: <explanation>
    if (!aiApiKey && !keys.OPENROUTER_API_KEY)
      throw new Error('OpenRouter API key is required');
    // biome-ignore lint/style/useBlockStatements: <explanation>
    if (!aiModel) throw new Error('OpenRouter model is required');

    const openRouter = createOpenRouter({
      apiKey: aiApiKey || keys.OPENROUTER_API_KEY,
    });

    const chatModel = openRouter.chat(aiModel);
    return {
      provider: Provider.OPENROUTER,
      model: aiModel,
      llmModel: chatModel,
    };
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
}

export async function chatCompletion({
  userAi,
  prompt,
  system,
  userEmail,
  usageLabel,
}: {
  userAi: {
    aiProvider: string;
    aiModel: string;
    aiApiKey: string;
  };
  prompt: string;
  system?: string;
  userEmail: string;
  usageLabel: string;
}) {
  try {
    const { provider, model, llmModel } = getModel(userAi);

    const result = await generateText({
      model: llmModel,
      prompt,
      system,
      experimental_telemetry: {
        isEnabled: true,
      },
    });

    if (result.usage) {
      await saveAiUsage({
        email: userEmail,
        usage: result.usage,
        provider,
        model,
        // TODO: Add userId and organizationId as of now we are using userEmail and optional (for now)
        userId: userEmail,
        organizationId: userEmail,
        label: usageLabel,
      });
    }
    return result;
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error(error);
    throw error;
  }
}

type ChatCompletionObjectArgs<T> = {
  userAi: {
    aiProvider: string;
    aiModel: string;
    aiApiKey: string;
  };
  schema: z.Schema<T>;
  userEmail: string;
  usageLabel: string;
} & (
  | {
      system?: string;
      prompt: string;
      messages?: never;
    }
  | {
      system?: never;
      prompt?: never;
      messages: CoreMessage[];
    }
);

export async function chatCompletionObject<T>(
  options: ChatCompletionObjectArgs<T>
) {
  return await chatCompletionObjectInternal(options);
}

async function chatCompletionObjectInternal<T>({
  userAi,
  system,
  prompt,
  messages,
  schema,
  userEmail,
  usageLabel,
}: ChatCompletionObjectArgs<T>) {
  try {
    const { provider, model, llmModel } = getModel(userAi);

    const result = await generateObject({
      model: llmModel,
      schema,
      messages,
      system,
      prompt,
      experimental_telemetry: {
        isEnabled: true,
      },
    });

    if (result.usage) {
      await saveAiUsage({
        email: userEmail,
        usage: result.usage,
        provider,
        model,
        userId: userEmail,
        organizationId: userEmail,
        label: usageLabel,
      });
    }

    return result;
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error(error);
    throw error;
  }
}

// biome-ignore lint/suspicious/useAwait: <explanation>
export async function chatCompletionStream({
  userAi,
  prompt,
  system,
  userEmail,
  usageLabel,
  onFinish,
}: {
  userAi: {
    aiProvider: string;
    aiModel: string;
    aiApiKey: string;
  };
  prompt: string;
  system?: string;
  userEmail: string;
  usageLabel: string;
  onFinish?: (text: string) => Promise<void>;
}) {
  const { provider, model, llmModel } = getModel(userAi);

  const result = streamText({
    model: llmModel,
    prompt,
    system,
    experimental_telemetry: {
      isEnabled: true,
    },
    onFinish: async ({ usage, text }) => {
      await saveAiUsage({
        email: userEmail,
        usage,
        provider,
        model,
        userId: userEmail,
        organizationId: userEmail,
        label: usageLabel,
      });

      if (onFinish) {
        await onFinish(text);
      }
    },
  });

  return result;
}

type ChatCompletionToolsArgs = {
  userAi: {
    aiProvider: string | null;
    aiModel: string | null;
    aiApiKey: string | null;
  };
  tools: Record<string, Tool>;
  maxSteps?: number;
  label: string;
  userEmail: string;
} & (
  | {
      system?: string;
      prompt: string;
      messages?: never;
    }
  | {
      system?: never;
      prompt?: never;
      messages: CoreMessage[];
    }
);

export async function chatCompletionTools(options: ChatCompletionToolsArgs) {
  return await chatCompletionToolsInternal(options);
}

async function chatCompletionToolsInternal({
  userAi,
  tools,
  maxSteps,
  label,
  userEmail,
  system,
  prompt,
  messages,
}: ChatCompletionToolsArgs) {
  try {
    const { provider, model, llmModel } = getModel(userAi);

    const result = await generateText({
      model: llmModel,
      tools,
      toolChoice: 'required',
      maxSteps,
      system,
      prompt,
      messages,
      experimental_telemetry: {
        isEnabled: true,
      },
    });

    if (result.usage) {
      await saveAiUsage({
        email: userEmail,
        usage: result.usage,
        provider,
        model,
        userId: userEmail,
        organizationId: userEmail,
        label,
      });
    }

    return result;
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error(error);
    throw error;
  }
}
