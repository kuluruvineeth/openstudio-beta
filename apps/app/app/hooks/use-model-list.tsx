import { ModelIcon } from '@/app/(authenticated)/chat/components/icons/model-icon';
import { usePreferenceContext } from '@/app/context/preferences/provider';
import { defaultPreferences } from '@/app/hooks/use-preferences';
import type { TToolKey } from '@/app/hooks/use-tools';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatOpenAI } from '@langchain/openai';
import { useQuery } from '@tanstack/react-query';
import type { JSX } from 'react';
import { useMemo } from 'react';

export type TBaseModel = 'openai' | 'anthropic' | 'gemini' | 'ollama';
export const models = [
  'gpt-4o',
  'gpt-4',
  'gpt-4-turbo',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-0125',
  'claude-3-opus-20240229',
  'claude-3-sonnet-20240229',
  'claude-3-haiku-20240307',
  'gemini-pro',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest',
  'phi3:latest',
];
export type TModelKey = (typeof models)[number] | string;

export type TModel = {
  name: string;
  key: TModelKey;
  isNew?: boolean;
  icon: (size: 'sm' | 'md' | 'lg') => JSX.Element;
  inputPrice?: number;
  outputPrice?: number;
  tokens: number;
  plugins: TToolKey[];
  baseModel: TBaseModel;
  maxOutputTokens?: number;
};
export const useModelList = () => {
  const { preferences } = usePreferenceContext();

  const ollamaModelsQuery = useQuery({
    queryKey: ['ollama-models'],
    queryFn: () =>
      fetch(`${preferences.ollamaBaseUrl}/api/tags`).then((res) => res.json()),
    enabled: !!preferences,
  });

  const createInstance = async (model: TModel, apiKey?: string) => {
    const temperature =
      preferences.temperature || defaultPreferences.temperature;
    const topP = preferences.topP || defaultPreferences.topP;
    const topK = preferences.topK || defaultPreferences.topK;
    const maxTokens = preferences.maxTokens || model.tokens;

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
          apiKey,
          streaming: true,
          anthropicApiUrl: `${window.location.origin}/api/anthropic/`,
          temperature,
          topP,
          maxTokens,
          topK,
          maxRetries: 2,
        });
      case 'gemini':
        return new ChatGoogleGenerativeAI({
          model: model.key,
          apiKey,
          streaming: true,
          temperature,
          maxRetries: 1,
          onFailedAttempt: (error) => {
            console.error('Failed attempt', error);
          },
          topP,
          topK,
          maxOutputTokens: maxTokens,
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
  const models: TModel[] = [
    {
      name: 'GPT 4o',
      key: 'gpt-4o',
      isNew: true,
      inputPrice: 5,
      outputPrice: 15,
      plugins: ['web_search', 'duckduckgo_search'],
      tokens: 128000,
      icon: (size) => <ModelIcon size={size} type="gpt4" />,
      baseModel: 'openai',
      maxOutputTokens: 2048,
    },
    {
      name: 'GPT4 Turbo',
      key: 'gpt-4-turbo',
      tokens: 128000,
      isNew: false,
      plugins: ['web_search', 'duckduckgo_search'],
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
      plugins: ['web_search', 'calculator'],
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
      plugins: [
        'web_search',
        'calculator',
        'duckduckgo_search',
        'read_website',
      ],
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
      plugins: ['web_search', 'duckduckgo_search'],
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
      plugins: [],
      icon: (size) => <ModelIcon size={size} type="anthropic" />,
      baseModel: 'anthropic',
      maxOutputTokens: 4095,
    },
    {
      name: 'Claude 3 Sonnet',
      key: 'claude-3-sonnet-20240229',
      isNew: false,
      inputPrice: 3,
      outputPrice: 15,
      plugins: [],
      tokens: 200000,
      icon: (size) => <ModelIcon size={size} type="anthropic" />,
      baseModel: 'anthropic',
      maxOutputTokens: 4095,
    },
    {
      name: 'Claude 3 Haiku',
      key: 'claude-3-haiku-20240307',
      isNew: false,
      inputPrice: 0.25,
      outputPrice: 1.5,
      plugins: [],
      tokens: 200000,
      icon: (size) => <ModelIcon size={size} type="anthropic" />,
      baseModel: 'anthropic',
      maxOutputTokens: 4095,
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
      maxOutputTokens: 4095,
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
      key: 'gemini-pro',
      isNew: false,
      inputPrice: 0.5,
      outputPrice: 1.5,
      plugins: [],
      tokens: 200000,
      icon: (size) => <ModelIcon size={size} type="gemini" />,
      baseModel: 'gemini',
      maxOutputTokens: 4095,
    },
  ];

  const allModels: TModel[] = useMemo(
    () => [
      ...models,
      ...(ollamaModelsQuery.data?.models?.map(
        (model: any): TModel => ({
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
    }
  };
  return { models: allModels, createInstance, getModelByKey, getTestModelKey };
};
