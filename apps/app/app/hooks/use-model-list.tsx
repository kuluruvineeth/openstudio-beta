import { ModelIcon } from '@/app/(authenticated)/chat/components/icons/model-icon';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatOpenAI } from '@langchain/openai';
import type { JSX } from 'react';

export type TBaseModel = 'openai' | 'anthropic' | 'gemini';
export type TModelKey =
  | 'gpt-4-turbo'
  | 'gpt-3.5-turbo'
  | 'gpt-3.5-turbo-0125'
  | 'claude-3-opus-20240229'
  | 'claude-3-sonnet-20240229'
  | 'claude-3-haiku-20240307';

export type TModel = {
  name: string;
  key: TModelKey;
  icon: () => JSX.Element;
  tokens: number;
  baseModel: TBaseModel;
};

export const useModelList = () => {
  const createInstance = async (model: TModel, apiKey: string) => {
    switch (model.baseModel) {
      case 'openai':
        return new ChatOpenAI({
          model: model.key,
          apiKey,
        });
      case 'anthropic':
        return new ChatAnthropic({
          model: model.key,
          apiKey,
        });
      case 'gemini':
        return new ChatGoogleGenerativeAI({
          model: model.key,
          apiKey,
        });
      default:
        throw new Error('Invalid model');
    }
  };
  const models: TModel[] = [
    {
      name: 'GPT4 Turbo',
      key: 'gpt-4-turbo',
      tokens: 128000,
      icon: () => <ModelIcon size="md" type="gpt4" />,
      baseModel: 'openai',
    },
    {
      name: 'GPT3.5 Turbo',
      key: 'gpt-3.5-turbo',
      tokens: 16385,
      icon: () => <ModelIcon size="md" type="gpt3" />,
      baseModel: 'openai',
    },
    {
      name: 'GPT3.5 Turbo 0125',
      key: 'gpt-3.5-turbo-0125',
      tokens: 16385,
      icon: () => <ModelIcon size="md" type="gpt3" />,
      baseModel: 'openai',
    },
    {
      name: 'Claude 3 Opus',
      key: 'claude-3-opus-20240229',
      tokens: 200000,
      icon: () => <ModelIcon size="md" type="anthropic" />,
      baseModel: 'anthropic',
    },
    {
      name: 'Claude 3 Sonnet',
      key: 'claude-3-sonnet-20240229',
      tokens: 200000,
      icon: () => <ModelIcon size="md" type="anthropic" />,
      baseModel: 'anthropic',
    },
    {
      name: 'Claude 3 Haiku',
      key: 'claude-3-haiku-20240307',
      tokens: 200000,
      icon: () => <ModelIcon size="md" type="anthropic" />,
      baseModel: 'anthropic',
    },
  ];
  const getModelByKey = (key: TModelKey) => {
    return models.find((model) => model.key === key);
  };
  return { models, createInstance, getModelByKey };
};
