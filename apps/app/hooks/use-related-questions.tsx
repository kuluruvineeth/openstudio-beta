import { configs } from '@/config';
import { ollamaModelsSupportsTools } from '@/config/models';
import { usePreferenceContext } from '@/context';
import { constructPrompt } from '@/helper/promptUtil';
import { modelService } from '@/services/models';
import { messagesService } from '@/services/sessions/client';
import { RunnableSequence } from '@langchain/core/runnables';
import type { ChatOllama } from '@langchain/ollama';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { z } from 'zod';
import { useAssistantUtils } from '.';

const parsingSchema = z.object({
  questions: z.array(z.string()).describe('list of questions'),
});

const parser = StructuredOutputParser.fromZodSchema(parsingSchema);

export const useRelatedQuestions = () => {
  const { getAssistantByKey } = useAssistantUtils();
  const { preferences, apiKeys } = usePreferenceContext();

  const generateRelatedQuestion = async (
    sessionId: string,
    messageId: string
  ) => {
    if (!preferences?.suggestRelatedQuestions) {
      return [];
    }
    const messages = await messagesService.getMessages(sessionId);
    const message = messages.find((m) => m.id === messageId);

    if (!message?.rawHuman || !message?.rawAI) {
      return [];
    }

    const assistant = getAssistantByKey(message.runConfig.assistant.key);

    if (!assistant || !apiKeys[assistant.model.provider]) {
      return [];
    }

    if (assistant.model.provider === 'ollama') {
      return generateRelatedQuestionForOllama(sessionId, messageId);
    }
    const apiKey = apiKeys[assistant.model.provider];
    const selectedModel = await modelService.createInstance({
      model: assistant.model,
      preferences,
      apiKey,
      provider: assistant.model.provider,
    });

    const prompt = await constructPrompt({
      hasMessages: false,
      formatInstructions: true,
      systemPrompt: configs.relatedQuestionsSystemPrompt,
      memories: [],
    });

    try {
      const chain = RunnableSequence.from([
        prompt,
        selectedModel as any,
        parser as any,
      ]);
      const generation = await chain.invoke({
        chat_history: [],
        input: configs.relatedQuestionsUserPrompt(
          message.rawHuman,
          message.rawAI
        ),
        format_instructions: parser.getFormatInstructions(),
      });

      return generation?.questions || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const generateRelatedQuestionForOllama = async (
    sessionId: string,
    messageId: string
  ) => {
    if (!preferences?.suggestRelatedQuestions) {
      return [];
    }
    const messages = await messagesService.getMessages(sessionId);
    const message = messages.find((m) => m.id === messageId);

    if (!message?.rawHuman || !message?.rawAI) {
      return [];
    }

    const assistant = getAssistantByKey(message.runConfig.assistant.key);

    if (!assistant || !apiKeys[assistant.model.provider]) {
      return [];
    }

    if (
      assistant.model.provider !== 'ollama' ||
      !ollamaModelsSupportsTools.includes(assistant?.model?.name)
    ) {
      return [];
    }
    const apiKey = apiKeys[assistant.model.provider];
    const selectedModel = (await modelService.createInstance({
      model: assistant.model,
      preferences,
      apiKey,
      provider: 'ollama',
      props: {
        format: 'json',
      },
    })) as ChatOllama;

    const modelWithTools = selectedModel?.withStructuredOutput(parsingSchema, {
      name: 'related_question',
    });

    try {
      const generation = await modelWithTools.invoke(
        `${configs.relatedQuestionsUserPrompt(
          message.rawHuman,
          message.rawAI
        )} Ensure you use the 'related_question' tool.`
      );

      let questions: string[] = [];
      if (typeof generation?.questions === 'string') {
        try {
          const parsed = JSON.parse(generation.questions);
          questions = Array.isArray(parsed) ? parsed : [generation.questions];
        } catch {
          questions = [];
        }
      } else if (Array.isArray(generation?.questions)) {
        questions = generation.questions;
      }
      return questions.filter((q) => typeof q === 'string');
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  return { generateRelatedQuestion };
};
