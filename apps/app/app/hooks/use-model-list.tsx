import { ModelIcon } from '@/app/(authenticated)/chat/components/icons/model-icon';
import { usePreferenceContext } from '@/app/context/preferences/provider';
import { defaultPreferences } from '@/app/hooks/use-preferences';
import type { TToolKey } from '@/app/hooks/use-tools';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatOpenAI } from '@langchain/openai';
import type { JSX } from 'react';

export type TBaseModel = 'openai' | 'anthropic' | 'gemini';
export type TModelKey =
  | 'gpt-4o'
  | 'gpt-4'
  | 'gpt-4-turbo'
  | 'gpt-3.5-turbo'
  | 'gpt-3.5-turbo-0125'
  | 'gpt-3.5-turbo-instruct'
  | 'claude-3-opus-20240229'
  | 'claude-3-sonnet-20240229'
  | 'claude-3-haiku-20240307'
  | 'gemini-pro'
  | 'gemini-1.5-flash-latest'
  | 'gemini-1.5-pro-latest';

export type TModel = {
  name: string;
  key: TModelKey;
  isNew?: boolean;
  icon: () => JSX.Element;
  inputPrice?: number;
  outputPrice?: number;
  tokens: number;
  plugins: TToolKey[];
  baseModel: TBaseModel;
  maxOutputTokens?: number;
};
export const useModelList = () => {
  const { preferences } = usePreferenceContext();
  const createInstance = async (model: TModel, apiKey: string) => {
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
      icon: () => <ModelIcon size="md" type="gpt4" />,
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
      icon: () => <ModelIcon size="md" type="gpt4" />,
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
      icon: () => <ModelIcon size="md" type="gpt4" />,
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
      icon: () => <ModelIcon size="md" type="gpt3" />,
      baseModel: 'openai',
      maxOutputTokens: 4095,
    },
    {
      name: 'GPT3.5 Turbo 0125',
      key: 'gpt-3.5-turbo-0125',
      isNew: false,
      tokens: 16385,
      plugins: ['web_search', 'duckduckgo_search'],
      icon: () => <ModelIcon size="md" type="gpt3" />,
      baseModel: 'openai',
      maxOutputTokens: 4095,
    },
    {
      name: 'GPT3.5 Turbo Instruct',
      key: 'gpt-3.5-turbo-instruct',
      isNew: false,
      tokens: 4000,
      inputPrice: 1.5,
      outputPrice: 2,
      plugins: ['web_search', 'duckduckgo_search'],
      icon: () => <ModelIcon size="md" type="gpt3" />,
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
      icon: () => <ModelIcon size="md" type="anthropic" />,
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
      icon: () => <ModelIcon size="md" type="anthropic" />,
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
      icon: () => <ModelIcon size="md" type="anthropic" />,
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
      icon: () => <ModelIcon size="md" type="gemini" />,
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
      icon: () => <ModelIcon size="md" type="gemini" />,
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
      icon: () => <ModelIcon size="md" type="gemini" />,
      baseModel: 'gemini',
      maxOutputTokens: 4095,
    },
  ];
  const getModelByKey = (key: TModelKey) => {
    return models.find((model) => model.key === key);
  };
  const getTestModelKey = (key: TBaseModel): TModelKey => {
    switch (key) {
      case 'openai':
        return 'gpt-3.5-turbo';
      case 'anthropic':
        return 'claude-3-haiku-20240307';
      case 'gemini':
        return 'gemini-pro';
    }
  };
  return { models, createInstance, getModelByKey, getTestModelKey };
};
