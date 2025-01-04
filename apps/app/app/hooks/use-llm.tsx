import type { Serialized } from '@langchain/core/load/serializable';
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import type { LLMResult } from '@langchain/core/outputs';
import { useToast } from '@repo/design-system/components/ui/use-toast';

import {
  type PromptProps,
  type TChatMessage,
  type TChatSession,
  useChatSession,
} from '@/app/hooks/use-chat-session';
import { type TModelKey, useModelList } from '@/app/hooks/use-model-list';
import {
  defaultPreferences,
  usePreferences,
} from '@/app/hooks/use-preferences';
import { useTools } from '@/app/hooks/use-tools';
import {
  type BaseMessagePromptTemplateLike,
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import moment from 'moment';
import { v4 } from 'uuid';

export type TRunModel = {
  props: PromptProps;
  sessionId: string;
  messageId?: string;
  model?: TModelKey;
};

export type TUseLLM = {
  onChange?: (props: TChatMessage) => void;
};

export const useLLM = ({ onChange }: TUseLLM) => {
  const { getSessionById, addMessageToSession, sortMessages, updateSession } =
    useChatSession();
  const { getApiKey, getPreferences } = usePreferences();
  const { createInstance, getModelByKey } = useModelList();
  const abortController = new AbortController();
  const { toast } = useToast();
  const { calculatorTool, webSearchTool, getToolByKey } = useTools();

  const stopGeneration = () => {
    abortController?.abort();
  };

  const preparePrompt = async (
    props: PromptProps,
    history: TChatMessage[],
    bot?: TChatSession['bot']
  ) => {
    const preferences = await getPreferences();
    const hasPreviousMessages = history?.length > 0;
    const systemPrompt =
      bot?.prompt ||
      preferences.systemPrompt ||
      defaultPreferences.systemPrompt;

    const system: BaseMessagePromptTemplateLike = [
      'system',
      `${systemPrompt} ${
        props.context
          ? `Answer user's question based on the following context: """{context}"""`
          : ``
      } ${
        hasPreviousMessages
          ? `You can also to refer these previous conversations`
          : ``
      }`,
    ];

    const messageHolders = new MessagesPlaceholder('chat_history');

    const userContent = `{input}  `;

    const user: BaseMessagePromptTemplateLike = [
      'user',
      props?.image
        ? [
            {
              type: 'text',
              content: userContent,
            },
            {
              type: 'image_url',
              image_url: props.image,
            },
          ]
        : userContent,
    ];

    const prompt = ChatPromptTemplate.fromMessages([
      system,
      messageHolders,
      user,
      ['placeholder', '{agent_scratchpad}'],
    ]);

    return prompt;
  };

  const runModel = async ({
    sessionId,
    messageId,
    props,
    model,
  }: TRunModel) => {
    const currentSession = await getSessionById(sessionId);

    if (!props?.query) {
      return;
    }

    const newMessageId = messageId || v4();
    const preferences = await getPreferences();
    const modelKey = model || preferences.defaultModel;

    const allPreviousMessages =
      currentSession?.messages?.filter((m) => m.id !== messageId) || [];
    const chatHistory = sortMessages(allPreviousMessages, 'createdAt');
    const plugins = preferences.defaultPlugins || [];

    const messageLimit =
      preferences.messageLimit || defaultPreferences.messageLimit;

    const defaultChangeProps = {
      props,
      id: newMessageId,
      model: modelKey,
      sessionId,
      rawHuman: props.query,
      createdAt: moment().toISOString(),
    };

    onChange?.({
      ...defaultChangeProps,
      isLoading: true,
    });
    const selectedModelKey = getModelByKey(modelKey);
    if (!selectedModelKey) {
      throw new Error('Model not found');
    }

    const apiKey = await getApiKey(selectedModelKey?.baseModel);

    if (!apiKey) {
      onChange?.({
        ...defaultChangeProps,
        isLoading: false,
        hasError: true,
        errorMesssage: 'API key not found',
      });
      return;
    }

    const prompt = await preparePrompt(
      props,
      currentSession?.messages?.filter((m) => m.id !== messageId) || [],
      currentSession?.bot
    );

    const selectedModel = await createInstance(selectedModelKey, apiKey);

    const previousAllowedChatHistory = chatHistory
      .slice(0, messageLimit === 'all' ? history.length : messageLimit)
      .reduce(
        (acc: (HumanMessage | AIMessage)[], { rawAI, rawHuman, image }) => {
          if (rawAI && rawHuman) {
            return [...acc, new HumanMessage(rawHuman), new AIMessage(rawAI)];
          } else {
            return [...acc];
          }
        },
        []
      );

    const availableTools =
      selectedModelKey?.plugins
        ?.filter((p) => {
          return plugins.includes(p);
        })
        ?.map((p) => getToolByKey(p)?.(preferences))
        ?.filter((t): t is any => !!t) || [];

    console.log('available tools', availableTools);

    const agentWithTool = await createToolCallingAgent({
      llm: selectedModel as any,
      tools: availableTools,
      prompt: prompt as any,
      streamRunnable: true,
    });

    const agentExecutor = new AgentExecutor({
      agent: agentWithTool,
      tools: availableTools,
    });

    const chainWithoutTools = prompt.pipe(selectedModel as any);

    let streamedMessage = '';
    let toolName: string | undefined;

    const stream: any = await (!!availableTools?.length
      ? agentExecutor
      : chainWithoutTools
    ).invoke(
      {
        chat_history: previousAllowedChatHistory || [],
        context: props.context,
        input: props.query,
      },
      {
        callbacks: [
          {
            handleLLMStart: async (llm: Serialized, prompts: string[]) => {
              console.log('llm start');

              onChange?.({
                ...defaultChangeProps,
                rawAI: streamedMessage,
                isLoading: true,
                isToolRunning: false,
                hasError: false,
                toolName,
                errorMesssage: undefined,
                createdAt: moment().toISOString(),
              });
            },

            handleToolStart(
              tool,
              input,
              runId,
              parentRunId,
              tags,
              metadata,
              name
            ) {
              console.log(
                'tool start',
                tool,
                input,
                runId,
                parentRunId,
                tags,
                metadata,
                name
              );
              toolName = name;
              onChange?.({
                ...defaultChangeProps,
                toolName: name,
                isToolRunning: true,
              });
            },
            handleToolEnd(output, runId, parentRunId, tags) {
              onChange?.({
                ...defaultChangeProps,
                isToolRunning: false,
                toolName,
                toolResult: output,
              });
            },
            handleAgentAction(action, runId, parentRunId, tags) {
              console.log('agent action', action);
            },

            handleLLMEnd: async (output: LLMResult) => {
              console.log('llm end', output);
            },
            handleLLMNewToken: async (token: string) => {
              console.log('token', token);

              streamedMessage += token;
              onChange?.({
                ...defaultChangeProps,
                isLoading: true,
                rawAI: streamedMessage,
                toolName,
                hasError: false,
                errorMesssage: undefined,
              });
            },
            handleChainEnd: async (output: LLMResult) => {
              console.log('chain end', output);
            },

            handleLLMError: async (err: Error) => {
              console.error(err);
              toast({
                title: 'Error',
                description: 'Something went wrong',
                variant: 'destructive',
              });
              onChange?.({
                ...defaultChangeProps,
                isLoading: false,
                hasError: true,
                errorMesssage: 'Something went wrong',
              });
            },
          },
        ],
      }
    );

    console.log('stream', stream);

    const chatMessage: TChatMessage = {
      ...defaultChangeProps,
      rawHuman: props.query,
      rawAI: stream?.content || stream?.output,
      isToolRunning: false,
      toolName,
      isLoading: false,
      hasError: false,
      createdAt: moment().toISOString(),
    };

    console.log('saving', chatMessage);
    await addMessageToSession(sessionId, chatMessage);
    await generateTitleForSession(sessionId);
    await onChange?.(chatMessage);
  };

  const generateTitleForSession = async (sessionId: string) => {
    const session = await getSessionById(sessionId);
    const preferences = await getPreferences();
    const modelKey = preferences.defaultModel;
    const selectedModelKey = getModelByKey(modelKey);

    if (!selectedModelKey) {
      throw new Error('Model not found');
    }

    const apiKey = await getApiKey(selectedModelKey?.baseModel);

    if (!apiKey) {
      throw new Error('API key not found');
    }

    const selectedModel = await createInstance(selectedModelKey, apiKey);

    console.log('title session', session);

    const firstMessage = session?.messages?.[0];

    if (
      !firstMessage ||
      !firstMessage.rawAI ||
      !firstMessage.rawHuman ||
      session?.messages?.length > 2
    ) {
      return;
    }

    const template = ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder('message'),
      [
        'user',
        'Make this prompt clear and consise? You must strictly answer with only the title, no other text is allowed.\n\nAnswer in English.',
      ],
    ]);

    try {
      const prompt = await template.formatMessages({
        message: [new HumanMessage(firstMessage.rawHuman)],
      });

      const generation = await selectedModel.invoke(prompt, {});

      console.log('title generation', generation);

      const newTitle = generation?.content?.toString() || session.title;
      await updateSession(
        sessionId,
        newTitle ? { title: newTitle, updatedAt: moment().toISOString() } : {}
      );
    } catch (e) {
      console.error(e);
      return firstMessage.rawHuman;
    }
  };

  return { runModel, stopGeneration, generateTitleForSession };
};
