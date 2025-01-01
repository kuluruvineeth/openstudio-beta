import type { TBaseModel, TModelKey } from '@/app/hooks/use-model-list';
import { get, set } from 'idb-keyval';

export type TApiKeys = Partial<Record<TBaseModel, string>>;
const defaultPreferences: TPreferences = {
  defaultModel: 'gpt-4-turbo',
};
export type TPreferences = {
  defaultModel: TModelKey;
};

export const usePreferences = () => {
  const getApiKeys = async (): Promise<TApiKeys> => {
    return (await get('api-keys')) || {};
  };

  const getPreferences = async (): Promise<TPreferences> => {
    return (await get('preferences')) || defaultPreferences;
  };
  const setPreferences = async (preferences: Partial<TPreferences>) => {
    const currentPreferences = await getPreferences();
    const newPreferences = { ...currentPreferences, ...preferences };
    await set('preferences', newPreferences);
  };
  const resetToDefaults = async () => {
    await set('preferences', defaultPreferences);
  };

  const setApiKey = async (key: TBaseModel, value: string) => {
    const keys = await getApiKeys();
    const newKeys = { ...keys, [key]: value };
    await set('api-keys', newKeys);
  };
  const getApiKey = async (key: TBaseModel) => {
    const keys = await getApiKeys();
    return keys[key];
  };
  return {
    getApiKeys,
    setApiKey,
    getApiKey,
    getPreferences,
    setPreferences,
    resetToDefaults,
  };
};
