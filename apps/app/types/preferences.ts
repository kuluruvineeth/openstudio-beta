import type { TAssistant, TBaseModel, TToolKey } from '@/types';

export type TApiKeys = Partial<Record<TBaseModel, string>>;

export type TPreferences = {
  defaultAssistant: TAssistant['key'];
  systemPrompt: string;
  messageLimit: number;
  temperature: number;
  memories: string[];
  defaultPlugins: TToolKey[];
  whisperSpeechToTextEnabled: boolean;
  dalleImageQuality: 'standard' | 'hd';
  dalleImageSize:
    | '1024x1024'
    | '512x512'
    | '256x256'
    | '1792x1024'
    | '1024x1792';
  maxTokens: number;
  defaultWebSearchEngine: 'google' | 'duckduckgo';
  ollamaBaseUrl: string;
  topP: number;
  topK: number;
  googleSearchEngineId?: string;
  googleSearchApiKey?: string;
};
