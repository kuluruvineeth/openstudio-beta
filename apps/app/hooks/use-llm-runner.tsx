import { defaultPreferences } from '@/config';
import { useChatContext, usePreferenceContext } from '@/context';
import { injectPresetValues } from '@/helper/preset-prompt-values';
import { constructMessagePrompt, constructPrompt } from '@/helper/promptUtil';
import { generateShortUUID } from '@/helper/utils';
import { modelService } from '@/services/models';
import { messagesService, sessionsService } from '@/services/sessions/client';
import type { TLLMRunConfig, TStopReason } from '@/types';
import { useToast } from '@repo/design-system/hooks/use-toast';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import moment from 'moment';
import { useAssistantUtils, useTools } from '.';

const getErrorMessage = (error: string) => {
  if (error.includes('image_url') && error.includes('400')) {
    return 'This model does not support images';
  }
  if (error.includes('429')) {
    return 'Exceeded daily limit or API is running out of credits.';
  }
  return undefined;
};

export const useLLMRunner = () => {
  const { store, refetch } = useChatContext();
  const editor = store((state) => state.editor);
  const setIsGenerating = store((state) => state.setIsGenerating);
  const currentMessage = store((state) => state.currentMessage);
  const setCurrentMessage = store((state) => state.setCurrentMessage);
  const updateCurrentMessage = store((state) => state.updateCurrentMessage);
  const addTool = store((state) => state.addTool);
  const resetState = store((state) => state.resetState);
  const setAbortController = store((state) => state.setAbortController);
  const { getModelByKey } = useAssistantUtils();
  const { preferences, apiKeys, updatePreferences } = usePreferenceContext();
  const { getAvailableTools } = useTools();
  const { toast } = useToast();

  const invokeModel = async (config: TLLMRunConfig) => {
    editor?.commands.clearContent();
    //to avoid duplication not refetch when regenerating
    if (!config?.messageId) {
      refetch();
    }
    resetState();
    setIsGenerating(true);

    const currentAbortController = new AbortController();
    setAbortController(currentAbortController);
    const { sessionId, messageId, input, context, image, assistant } = config;
    const newMessageId = messageId || generateShortUUID();
    const modelKey = assistant.baseModel;
    const session = await sessionsService.getSessionById(sessionId);
    if (!session) {
      setIsGenerating(false);
      toast({
        title: 'Error',
        description: 'Session not found',
        variant: 'destructive',
      });
      return;
    }
    const messages = await messagesService.getMessages(sessionId);

    const allPreviousMessages =
      messages?.filter((m) => m.id !== messageId) || [];
    const messageLimit =
      preferences.messageLimit || defaultPreferences.messageLimit;

    setCurrentMessage({
      runConfig: config,
      id: newMessageId,
      parentId: sessionId,
      sessionId,
      rawHuman: input,
      stop: false,
      stopReason: undefined,
      rawAI: undefined,
      image,
      tools: [],
      relatedQuestions: [],
      createdAt: moment().toISOString(),
      isLoading: true,
    });

    const selectedModelKey = getModelByKey(modelKey, assistant.provider);
    if (!selectedModelKey) {
      throw new Error('Model not found');
    }

    const apiKey = apiKeys[selectedModelKey?.provider];

    if (
      !apiKey &&
      !['ollama', 'chathub'].includes(selectedModelKey?.provider)
    ) {
      updateCurrentMessage({
        isLoading: false,
        stop: true,
        stopReason: 'apikey',
      });
      return;
    }

    const prompt = await constructPrompt({
      context,
      image,
      memories: preferences.memories,
      hasMessages: allPreviousMessages.length > 0,
      systemPrompt: injectPresetValues(assistant.systemPrompt),
    });

    const availableTools = getAvailableTools(selectedModelKey);

    const selectedModel = await modelService.createInstance({
      model: selectedModelKey,
      preferences,
      provider: selectedModelKey.provider,
      apiKey,
    });

    let agentExecutor: AgentExecutor | undefined;

    const modifiedModel = Object.create(Object.getPrototypeOf(selectedModel));
    Object.assign(modifiedModel, selectedModel);

    modifiedModel.bindTools = (tools: any[], options: any) => {
      return selectedModel?.bindTools?.(tools, {
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

    const executor =
      availableTools?.length && agentExecutor
        ? agentExecutor
        : chainWithoutTools;

    const chatHistory = await constructMessagePrompt({
      messages: allPreviousMessages,
      limit: messageLimit,
    });

    try {
      const stream: any = await executor.invoke(
        {
          chat_history: chatHistory || [],
          context,
          input,
        },
        {
          callbacks: [
            {
              handleLLMStart: async () => {},
              handleToolStart(
                tool,
                input,
                runId,
                parentRunId,
                tags,
                metadata,
                name
              ) {
                name && addTool({ toolName: name, isLoading: true });
              },
              handleLLMNewToken: async (token: string) => {
                streamedMessage += token;

                updateCurrentMessage({
                  isLoading: true,
                  rawAI: streamedMessage,
                  stop: false,
                  stopReason: undefined,
                });
              },
              handleChainEnd: async () => {},
              handleLLMError: async (err: Error) => {
                // Log this error
                if (!currentAbortController?.signal.aborted) {
                  toast({
                    title: 'Error',
                    description: 'Something went wrong',
                    variant: 'destructive',
                  });
                }

                const hasError: Record<string, boolean> = {
                  cancel: currentAbortController?.signal.aborted,
                  rateLimit:
                    err.message.includes('429') &&
                    !err.message.includes('chathub'),
                  unauthorized: err.message.includes('401'),
                };

                const stopReason = Object.keys(hasError).find(
                  (value) => hasError[value]
                ) as TStopReason;

                updateCurrentMessage({
                  isLoading: false,
                  rawHuman: input,
                  rawAI: streamedMessage,
                  stop: true,
                  errorMessage: getErrorMessage(err.message),
                  stopReason: stopReason as any,
                });
              },
            },
          ],
        }
      );

      updateCurrentMessage({
        rawHuman: input,
        rawAI: stream?.content || stream?.output?.[0]?.text || stream?.output,
        isLoading: false,
        image,
        stop: true,
        stopReason: 'finish',
      });
    } catch (err) {
      updateCurrentMessage({
        isLoading: false,
        stop: true,
      });
      console.error(err);
    }
  };

  return {
    invokeModel,
  };
};
