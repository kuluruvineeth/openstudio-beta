'use client';
import { defaultPreferences } from '@/config';
import { usePreferencesQueries } from '@/services/preferences';
import type { TApiKeyInsert, TApiKeys, TPreferences, TProvider } from '@/types';
import { useEffect, useState } from 'react';
import { createContext, useContext } from 'react';

export type TPreferenceContext = {
  preferences: TPreferences;
  updatePreferences: (
    newPreferences: Partial<TPreferences>,
    onSuccess?: (preference: TPreferences) => void
  ) => void;
  apiKeys: TApiKeys[];
  updateApiKey: (key: TProvider, value: string) => void;
  updateApiKeys: (newApiKeys: TApiKeys[]) => void;
  getApiKey: (provider: TProvider) => string | undefined;
};
export const PreferenceContext = createContext<undefined | TPreferenceContext>(
  undefined
);
export const usePreferenceContext = () => {
  const context = useContext(PreferenceContext);
  if (context === undefined) {
    throw new Error('usePreference must be used within a PreferencesProvider');
  }
  return context;
};

export type TPreferencesProvider = {
  children: React.ReactNode;
};

export const PreferenceProvider = ({ children }: TPreferencesProvider) => {
  const [preferences, setPreferences] = useState<TPreferences>();
  const [apiKeys, setApiKeys] = useState<TApiKeys[]>([]);
  const {
    preferencesQuery,
    setPreferencesMutation,
    apiKeysQuery,
    setApiKeyMutation,
  } = usePreferencesQueries();

  useEffect(() => {
    setPreferences(defaultPreferences);
  }, []);

  useEffect(() => {
    preferencesQuery.data
      ? setPreferences(preferencesQuery.data)
      : setPreferences(defaultPreferences);
  }, [preferencesQuery.data]);

  useEffect(() => {
    setApiKeys(apiKeysQuery.data || []);
  }, [apiKeysQuery.data]);

  const updatePreferences = async (
    newPreferences: Partial<TPreferences>,
    onSuccess?: (preference: TPreferences) => void
  ) => {
    setPreferences((existing) => ({
      ...defaultPreferences,
      ...existing,
      ...newPreferences,
    }));
    setPreferencesMutation.mutate(
      { id: 1, ...newPreferences },
      {
        onSuccess: (preference) => {
          preferencesQuery.refetch();
          onSuccess && onSuccess(preference);
        },
      }
    );
  };
  const updateApiKey = async (key: TProvider, value: string) => {
    setApiKeyMutation.mutate({ key, value });
  };

  const updateApiKeys = (newApiKeys: TApiKeyInsert[]) => {
    setApiKeys(newApiKeys);
  };

  return (
    <PreferenceContext.Provider
      value={{
        preferences: { ...defaultPreferences, ...preferences },
        updatePreferences,
        apiKeys,
        updateApiKey,
        updateApiKeys,
        getApiKey: (provider: TProvider) => {
          if (provider === 'ollama') {
            return 'ollama';
          }
          if (provider === 'chathub') {
            return 'chathub';
          }
          return apiKeys.find((key) => key.provider === provider)?.key;
        },
      }}
    >
      {children}
    </PreferenceContext.Provider>
  );
};
