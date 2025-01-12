import { defaultPreferences } from '@/config';
import type { TApiKeys, TPreferences, TPreferencesState } from '@/types';
import { create } from 'zustand';

const initialState = {
  preferences: defaultPreferences,
  apiKeys: {},
};
export const createPreferencesStore = () =>
  create<TPreferencesState>((set, get) => ({
    ...initialState,
    setPreferences: (preferences: Partial<TPreferences>) => {
      const existingPreferences = get().preferences;
      set({ preferences: { ...existingPreferences, ...preferences } });
    },
    setApiKeys: (apiKeys: TApiKeys) => {
      set({ apiKeys });
    },
  }));
