import { ModelIcon } from '@/app/(authenticated)/chat/components/model-icon';
import { defaultPreferences } from '@/config';
import { usePreferenceContext } from '@/context/preferences';
import { useAssistantsQueries } from '@/services/assistants';
import type { TAssistant, TBaseModel, TModelItem, TModelKey } from '@/types';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatOpenAI } from '@langchain/openai';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useModelList = () => {
  const assistantQueries = useAssistantsQueries();
  const { preferences } = usePreferenceContext();

  const ollamaModelsQuery = useQuery({
    queryKey: ['ollama-models'],
    queryFn: () =>
      fetch(`${preferences.ollamaBaseUrl}/api/tags`).then((res) => res.json()),
    enabled: !!preferences,
  });

  const createInstance = async (model: TModelItem, apiKey?: string) => {
    const {
      temperature = defaultPreferences.temperature,
      topP = defaultPreferences.topP,
      topK = defaultPreferences.topK,
      maxTokens = model.tokens,
    } = preferences;

    switch (model.baseModel) {
      case 'openai':
        return new ChatOpenAI({
          model: model.key,
          streaming: true,
          apiKey,
          temperature,
          maxTokens,
          topP,
          maxRetries: 2,
        });
      case 'anthropic':
        return new ChatAnthropic({
          model: model.key,
          streaming: true,
          anthropicApiUrl: `${window.location.origin}/api/anthropic/`,
          // anthropicApiUrl:
          //   'https://gateway.ai.cloudflare.com/v1/b8a66f8a4ddbd419ef8e4bdfeea7aa60/chathub/anthropic',
          apiKey,
          maxTokens,
          temperature,
          topP,
          topK,
          maxRetries: 2,
        });
      case 'gemini':
        return new ChatGoogleGenerativeAI({
          model: model.key,
          apiKey,
          maxOutputTokens: maxTokens,
          streaming: true,
          temperature,
          maxRetries: 1,
          onFailedAttempt: (error) => {
            console.error('Failed attempt', error);
          },
          topP,
          topK,
        });
      case 'ollama':
        return new ChatOllama({
          model: model.key,
          baseUrl: preferences.ollamaBaseUrl,
          numPredict: maxTokens,
          topK,
          topP,
          maxRetries: 2,
          temperature,
        });
      default:
        throw new Error('Invalid model');
    }
  };
  const models: TModelItem[] = [
    {
      name: 'GPT 4o',
      key: 'gpt-4o',
      tokens: 128000,
      isNew: true,
      inputPrice: 5,
      outputPrice: 15,
      plugins: ['web_search', 'image_generation', 'memory', 'chart'],
      icon: (size) => <ModelIcon size={size} type="gpt4" />,
      baseModel: 'openai',
      maxOutputTokens: 2048,
    },
    {
      name: 'GPT4 Turbo',
      key: 'gpt-4-turbo',
      tokens: 128000,
      isNew: false,
      plugins: ['web_search', 'image_generation', 'memory'],
      inputPrice: 10,
      outputPrice: 30,
      icon: (size) => <ModelIcon size={size} type="gpt4" />,
      baseModel: 'openai',
      maxOutputTokens: 4095,
    },
    {
      name: 'GPT4',
      key: 'gpt-4',
      tokens: 128000,
      isNew: false,
      plugins: ['web_search', 'image_generation', 'memory'],
      inputPrice: 30,
      outputPrice: 60,
      icon: (size) => <ModelIcon size={size} type="gpt4" />,
      baseModel: 'openai',
      maxOutputTokens: 4095,
    },
    {
      name: 'GPT3.5 Turbo',
      key: 'gpt-3.5-turbo',
      isNew: false,
      inputPrice: 0.5,
      outputPrice: 1.5,
      plugins: ['web_search', 'image_generation', 'memory'],
      tokens: 16385,
      icon: (size) => <ModelIcon size={size} type="gpt3" />,
      baseModel: 'openai',
      maxOutputTokens: 4095,
    },
    {
      name: 'GPT3.5 Turbo 0125',
      key: 'gpt-3.5-turbo-0125',
      isNew: false,
      tokens: 16385,
      plugins: ['web_search', 'image_generation', 'memory'],
      icon: (size) => <ModelIcon size={size} type="gpt3" />,
      baseModel: 'openai',
      maxOutputTokens: 4095,
    },
    {
      name: 'Claude 3 Opus',
      key: 'claude-3-opus-20240229',
      isNew: false,
      inputPrice: 15,
      outputPrice: 75,
      tokens: 200000,
      plugins: ['web_search', 'image_generation', 'memory'],
      icon: (size) => <ModelIcon size={size} type="anthropic" />,
      maxOutputTokens: 4095,

      baseModel: 'anthropic',
    },
    {
      name: 'Claude 3.5 Sonnet',
      inputPrice: 3,
      outputPrice: 15,
      plugins: [],
      key: 'claude-3-5-sonnet-20240620',
      isNew: false,
      maxOutputTokens: 4095,
      tokens: 200000,
      icon: (size) => <ModelIcon size={size} type="anthropic" />,
      baseModel: 'anthropic',
    },
    {
      name: 'Claude 3 Sonnet',
      inputPrice: 3,
      outputPrice: 15,
      plugins: ['web_search', 'image_generation', 'memory'],
      key: 'claude-3-sonnet-20240229',
      isNew: false,
      maxOutputTokens: 4095,
      tokens: 200000,
      icon: (size) => <ModelIcon size={size} type="anthropic" />,

      baseModel: 'anthropic',
    },
    {
      name: 'Claude 3 Haiku',
      key: 'claude-3-haiku-20240307',
      isNew: false,
      inputPrice: 0.25,
      outputPrice: 1.5,
      tokens: 200000,
      plugins: [],
      maxOutputTokens: 4095,
      icon: (size) => <ModelIcon size={size} type="anthropic" />,
      baseModel: 'anthropic',
    },
    {
      name: 'Gemini Pro 1.5',
      key: 'gemini-1.5-pro-latest',
      isNew: true,
      inputPrice: 3.5,
      outputPrice: 10.5,
      plugins: [],
      tokens: 200000,
      icon: (size) => <ModelIcon size={size} type="gemini" />,
      baseModel: 'gemini',
      maxOutputTokens: 8190,
    },
    {
      name: 'Gemini Flash 1.5',
      key: 'gemini-1.5-flash-latest',
      isNew: true,
      inputPrice: 0.35,
      outputPrice: 1.05,
      plugins: [],
      tokens: 200000,
      icon: (size) => <ModelIcon size={size} type="gemini" />,
      baseModel: 'gemini',
      maxOutputTokens: 8190,
    },
    {
      name: 'Gemini Pro',
      isNew: false,
      key: 'gemini-pro',
      inputPrice: 0.5,
      outputPrice: 1.5,
      plugins: [],
      tokens: 200000,
      icon: (size) => <ModelIcon size={size} type="gemini" />,
      baseModel: 'gemini',
      maxOutputTokens: 4095,
    },
  ];

  const allModels: TModelItem[] = useMemo(
    () => [
      ...models,
      ...(ollamaModelsQuery.data?.models?.map(
        (model: any): TModelItem => ({
          name: model.name,
          key: model.name,
          tokens: 128000,
          inputPrice: 0,
          outputPrice: 0,
          plugins: [],
          icon: (size) => <ModelIcon size={size} type="ollama" />,
          baseModel: 'ollama',
          maxOutputTokens: 2048,
        })
      ) || []),
    ],
    [ollamaModelsQuery.data?.models]
  );

  const getModelByKey = (key: TModelKey) => {
    return allModels.find((model) => model.key === key);
  };

  const getTestModelKey = (key: TBaseModel): TModelKey => {
    switch (key) {
      case 'openai':
        return 'gpt-3.5-turbo';
      case 'anthropic':
        return 'claude-3-haiku-20240307';
      case 'gemini':
        return 'gemini-pro';
      case 'ollama':
        return 'phi3:latest';
      default:
        throw new Error('Invalid base model');
    }
  };

  const assistants: TAssistant[] = [
    ...allModels?.map(
      (model): TAssistant => ({
        name: model.name,
        key: model.key,
        baseModel: model.key,
        type: 'base',
        systemPrompt:
          preferences.systemPrompt || defaultPreferences.systemPrompt,
      })
    ),
    ...(assistantQueries?.assistantsQuery?.data || []),
  ];

  const getAssistantByKey = (
    key: string
  ): { assistant: TAssistant; model: TModelItem } | undefined => {
    const assistant = assistants.find((assistant) => assistant.key === key);
    if (!assistant) {
      return;
    }
    const model = getModelByKey(assistant?.baseModel);

    if (!model) {
      return;
    }
    return {
      assistant,
      model,
    };
  };

  const getAssistantIcon = (assistantKey: string) => {
    const assistant = getAssistantByKey(assistantKey);
    return assistant?.assistant.type === 'base' ? (
      assistant?.model?.icon('sm')
    ) : (
      <ModelIcon type="custom" size="sm" />
    );
  };

  return {
    models: allModels,
    createInstance,
    getModelByKey,
    getTestModelKey,
    assistants: assistants.filter((a) =>
      allModels.some((m) => m.key === a.baseModel)
    ),
    getAssistantByKey,
    getAssistantIcon,
    ...assistantQueries,
  };
};
