import { ModelIcon } from '@/app/(authenticated)/chat/components/model-icon';
import { configs, defaultPreferences } from '@/config';
import { models } from '@/config/models';
import { usePreferenceContext } from '@/context';
import { useAssistantsQueries } from '@/services/assistants';
import type { TAssistant, TModelItem, TModelKey } from '@/types';
import { useMemo } from 'react';

export const useAssistantUtils = () => {
  const assistantQueries = useAssistantsQueries();
  const { preferences } = usePreferenceContext();

  const ollamaModelsQuery = assistantQueries.useOllamaModelsQuery(
    `${preferences.ollamaBaseUrl}${configs.ollamaTagsEndpoint}`
  );

  const allModels: TModelItem[] = useMemo(
    () => [
      ...models,
      ...(ollamaModelsQuery.data?.models?.map(
        (model: any): TModelItem => ({
          name: model.name,
          key: model.name,
          tokens: 128000,
          plugins: [],
          icon: 'ollama',
          provider: 'ollama',
          maxOutputTokens: 2048,
        })
      ) || []),
    ],
    [ollamaModelsQuery.data?.models]
  );

  const getModelByKey = (key: TModelKey) => {
    return allModels.find((model) => model.key === key);
  };

  const assistants: TAssistant[] = [
    ...allModels.map(
      (model): TAssistant => ({
        name: model.name,
        key: model.key,
        baseModel: model.key,
        type: 'base',
        systemPrompt:
          preferences.systemPrompt || defaultPreferences.systemPrompt,
      })
    ),
    ...(assistantQueries?.assistantsQuery.data || []),
  ];

  const getAssistantByKey = (
    key: string
  ): { assistant: TAssistant; model: TModelItem } | undefined => {
    const assistant = assistants.find((assistant) => assistant.key === key);
    if (!assistant) return;

    const model = getModelByKey(assistant.baseModel);
    if (!model) return;

    return { assistant, model };
  };

  const getAssistantIcon = (assistantKey: string, size: 'sm' | 'md' | 'lg') => {
    const assistant = getAssistantByKey(assistantKey);
    return assistant?.assistant.type === 'base' ? (
      <ModelIcon size={size} type={assistant?.model?.icon} />
    ) : (
      <ModelIcon type="custom" size={size} />
    );
  };

  return {
    models: allModels,
    getModelByKey,
    getAssistantIcon,
    assistants: assistants.filter((a) =>
      allModels.some((m) => m.key === a.baseModel)
    ),
    getAssistantByKey,
    ...assistantQueries,
  };
};
