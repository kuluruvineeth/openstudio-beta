import type { Serialized } from '@langchain/core/load/serializable';
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import type { LLMResult } from '@langchain/core/outputs';
import { useToast } from '@repo/design-system/components/ui/use-toast';

import { usePreferenceContext } from '@/app/context/preferences';
import { useSessionsContext } from '@/app/context/sessions';
import type {
  TAssistant,
  TChatMessage,
  TLLMInputProps,
} from '@/app/hooks/use-chat-session';
import { useModelList } from '@/app/hooks/use-model-list';
import { defaultPreferences } from '@/app/hooks/use-preferences';
import { useTools } from '@/app/hooks/use-tools';
import { sortMessages } from '@/app/lib/helper';
import {
  type BaseMessagePromptTemplateLike,
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import moment from 'moment';
import { useState } from 'react';
import { v4 } from 'uuid';

export type TUseLLM = {
  onChange?: (props: TChatMessage) => void;
  onFinish?: () => void;
};

export const useLLM = ({ onChange, onFinish }: TUseLLM) => {
  const { addMessageToSession, getSessionById, updateSessionMutation } =
    useSessionsContext();
  const { apiKeys, preferences } = usePreferenceContext();
  const { createInstance, getModelByKey, getAssistantByKey } = useModelList();
  const { toast } = useToast();
  const { getToolByKey } = useTools();
  const [abortController, setAbortController] = useState<AbortController>();

  const stopGeneration = () => {
    console.log('stop generation');
    abortController?.abort('cancel');
  };

  const preparePrompt = async ({
    context,
    image,
    history,
    assistant,
  }: {
    context?: string;
    image?: string;
    history: TChatMessage[];
    assistant: TAssistant;
  }) => {
    const hasPreviousMessages = history?.length > 0;
    const systemPrompt = assistant.systemPrompt;

    const system: BaseMessagePromptTemplateLike = [
      'system',
      `${systemPrompt} ${
        hasPreviousMessages
          ? `You can also refer to these previous conversations`
          : ``
      }`,
    ];

    const messageHolders = new MessagesPlaceholder('chat_history');

    const userContent = `{input}\n\n${
      context
        ? `Answer user's question based on the following context: """{context}"""`
        : ``
    } `;

    const user: BaseMessagePromptTemplateLike = [
      'user',
      image
        ? [
            {
              type: 'text',
              content: userContent,
            },
            {
              type: 'image_url',
              image_url: image,
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

  const runModel = async (props: TLLMInputProps) => {
    const { sessionId, messageId, input, context, image, assistant } = props;
    const currentAbortController = new AbortController();
    setAbortController(currentAbortController);

    const selectedSession = await getSessionById(sessionId);

    console.log('selected props', props);

    if (!input) {
      return;
    }

    const newMessageId = messageId || v4();
    const modelKey = assistant.baseModel;

    const allPreviousMessages =
      selectedSession?.messages?.filter((m) => m.id !== messageId) || [];
    const chatHistory = sortMessages(allPreviousMessages, 'createdAt');
    const plugins = preferences.defaultPlugins || [];

    const messageLimit =
      preferences.messageLimit || defaultPreferences.messageLimit;

    const defaultChangeProps: TChatMessage = {
      inputProps: props,
      id: newMessageId,
      sessionId,
      rawHuman: input,
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

    const apiKey = apiKeys[selectedModelKey?.baseModel];

    if (!apiKey) {
      onChange?.({
        ...defaultChangeProps,
        isLoading: false,
        stop: true,
        stopReason: 'apikey',
      });
      return;
    }

    const prompt = await preparePrompt({
      context: context,
      image,
      history:
        selectedSession?.messages?.filter((m) => m.id !== messageId) || [],
      assistant,
    });

    const availableTools =
      selectedModelKey?.plugins
        ?.filter((p) => {
          return plugins.includes(p);
        })
        ?.map((p) => getToolByKey(p)?.tool())
        ?.filter((t): t is any => !!t) || [];

    const selectedModel = await createInstance(selectedModelKey, apiKey);

    const previousAllowedChatHistory = chatHistory
      .slice(0, messageLimit)
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

    let agentExecutor: AgentExecutor | undefined;

    console.log('selectedModelFirst', selectedModel);
    console.log('selectedModelSecond', Object.create(selectedModel));

    // Creating a copy of the model
    const modifiedModel = Object.create(Object.getPrototypeOf(selectedModel));

    Object.assign(modifiedModel, selectedModel);

    modifiedModel.bindTools = (tools: any[], options: any) => {
      return selectedModel.bindTools?.(tools, {
        ...options,
        signal: currentAbortController?.signal,
      });
    };

    if (availableTools?.length) {
      const agentWithTool = await createToolCallingAgent({
        llm: modifiedModel as any,
        tools: availableTools,
        prompt: prompt as any,
        streamRunnable: true,
      });

      agentExecutor = new AgentExecutor({
        agent: agentWithTool as any,
        tools: availableTools,
      });
    }
    const chainWithoutTools = prompt.pipe(
      selectedModel.bind({
        signal: currentAbortController?.signal,
      }) as any
    );

    let streamedMessage = '';
    let toolName: string | undefined;

    console.log('available tools', availableTools);

    const executor =
      !!availableTools?.length && agentExecutor
        ? agentExecutor
        : chainWithoutTools;

    try {
      const stream: any = await executor.invoke(
        {
          chat_history: previousAllowedChatHistory || [],
          context,
          input,
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
                  toolName,
                  stop: false,
                  stopReason: undefined,
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
                  stop: false,
                  stopReason: undefined,
                });
              },
              handleChainEnd: async (output: LLMResult) => {
                console.log('chain end', output);
              },

              handleLLMError: async (err: Error) => {
                console.error(err);
                if (!currentAbortController?.signal.aborted) {
                  toast({
                    title: 'Error',
                    description: 'Something went wrong',
                    variant: 'destructive',
                  });
                }

                const chatMessage: TChatMessage = {
                  ...defaultChangeProps,
                  isLoading: false,
                  rawHuman: input,
                  toolName,
                  isToolRunning: false,
                  rawAI: streamedMessage,
                  stop: true,
                  stopReason: currentAbortController?.signal.aborted
                    ? 'cancel'
                    : 'error',
                };
                if (!!streamedMessage?.length) {
                  await addMessageToSession(sessionId, chatMessage);
                }
                onChange?.(chatMessage);
                onFinish?.();
              },
            },
          ],
        }
      );

      // abortController.signal.addEventListener(
      //   "abort",
      //   () => {
      //     console.log("abort", stream);
      //     void stream?.cancel?.("abort");
      //   },
      //   {
      //     once: true,
      //   }
      // );

      console.log('stream', stream);

      const chatMessage: TChatMessage = {
        ...defaultChangeProps,
        rawHuman: input,
        rawAI: stream?.content || stream?.output,
        isToolRunning: false,
        toolName,
        isLoading: false,
        stop: false,
        stopReason: undefined,
        createdAt: moment().toISOString(),
      };

      console.log('chat message hh', chatMessage);
      await addMessageToSession(sessionId, chatMessage);
      await generateTitleForSession(sessionId);
      await onChange?.(chatMessage);
      onFinish?.();
    } catch (err) {
      onChange?.({
        ...defaultChangeProps,
        isLoading: false,
        stop: true,
        stopReason: 'error',
      });
      onFinish?.();
      console.error(err);
    }
  };

  const generateTitleForSession = async (sessionId: string) => {
    const session = await getSessionById(sessionId);
    const assistant = getAssistantByKey(preferences.defaultAssistant);
    if (!assistant) {
      return;
    }

    console.log('generate title for session', session);

    const apiKey = apiKeys[assistant.model.baseModel];

    const selectedModel = await createInstance(assistant.model, apiKey);

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

      const newTitle = generation?.content?.toString() || session.title;
      await updateSessionMutation.mutate({
        sessionId,
        session: newTitle
          ? { title: newTitle, updatedAt: moment().toISOString() }
          : {},
      });
    } catch (e) {
      console.error(e);
      return firstMessage.rawHuman;
    }
  };

  return { runModel, stopGeneration, generateTitleForSession };
};
