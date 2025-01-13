import type { TModelItem } from '@/types';

export const providers = [
  'chathub',
  'openai',
  'anthropic',
  'gemini',
  'ollama',
  'groq',
] as const;

export const ollamaModelsSupportsTools = ['llama3-groq-tool-use:latest'];

export const models: TModelItem[] = [
  {
    name: 'ChatHub',
    key: 'chathub',
    isFree: true,
    tokens: 128000,
    maxOutputTokens: 2048,
    vision: true,
    plugins: ['web_search', 'image_generation', 'memory', 'webpage_reader'],
    icon: 'chathub',
    provider: 'chathub',
  },
  {
    name: 'GPT 4o Mini',
    key: 'gpt-4o-mini',
    isNew: true,
    tokens: 128000,
    maxOutputTokens: 2048,
    vision: true,
    plugins: ['web_search', 'image_generation', 'memory', 'webpage_reader'],
    icon: 'gpt4',
    provider: 'openai',
  },
  {
    name: 'GPT 4o',
    key: 'gpt-4o',
    isNew: false,
    tokens: 128000,
    maxOutputTokens: 2048,
    vision: true,
    plugins: ['web_search', 'image_generation', 'memory', 'webpage_reader'],
    icon: 'gpt4',
    provider: 'openai',
  },
  {
    name: 'GPT4 Turbo',
    key: 'gpt-4-turbo',
    isNew: false,
    tokens: 128000,
    maxOutputTokens: 4096,
    vision: true,
    plugins: ['web_search', 'image_generation', 'memory', 'webpage_reader'],
    icon: 'gpt4',
    provider: 'openai',
  },
  {
    name: 'GPT4',
    key: 'gpt-4',
    isNew: false,
    tokens: 128000,
    maxOutputTokens: 4096,
    plugins: ['web_search', 'image_generation', 'memory', 'webpage_reader'],
    icon: 'gpt4',
    provider: 'openai',
  },
  {
    name: 'GPT3.5 Turbo',
    key: 'gpt-3.5-turbo',
    isNew: false,
    tokens: 16384,
    maxOutputTokens: 4096,
    plugins: ['web_search', 'image_generation', 'memory', 'webpage_reader'],
    icon: 'gpt3',
    provider: 'openai',
  },
  {
    name: 'GPT3.5 Turbo 0125',
    key: 'gpt-3.5-turbo-0125',
    isNew: false,
    tokens: 16384,
    maxOutputTokens: 4096,
    plugins: ['web_search', 'image_generation', 'memory', 'webpage_reader'],
    icon: 'gpt3',
    provider: 'openai',
  },
  {
    name: 'Claude 3 Opus',
    key: 'claude-3-opus-20240229',
    isNew: false,
    tokens: 200000,
    vision: true,
    maxOutputTokens: 4096,
    plugins: ['web_search', 'image_generation', 'memory', 'webpage_reader'],
    icon: 'anthropic',
    provider: 'anthropic',
  },
  {
    name: 'Claude 3.5 Sonnet',
    key: 'claude-3-5-sonnet-20240620',
    isNew: false,
    tokens: 200000,
    vision: true,
    maxOutputTokens: 4096,
    plugins: ['web_search', 'image_generation', 'memory', 'webpage_reader'],
    icon: 'anthropic',
    provider: 'anthropic',
  },
  {
    name: 'Claude 3 Sonnet',
    key: 'claude-3-sonnet-20240229',
    isNew: false,
    tokens: 200000,
    vision: true,
    maxOutputTokens: 4096,
    plugins: ['web_search', 'image_generation', 'memory', 'webpage_reader'],
    icon: 'anthropic',
    provider: 'anthropic',
  },
  {
    name: 'Claude 3 Haiku',
    key: 'claude-3-haiku-20240307',
    isNew: false,
    tokens: 200000,
    vision: true,
    maxOutputTokens: 4096,
    plugins: ['web_search', 'image_generation', 'memory', 'webpage_reader'],
    icon: 'anthropic',
    provider: 'anthropic',
  },
  {
    name: 'Gemini Pro 1.5',
    key: 'gemini-1.5-pro-latest',
    isNew: false,
    tokens: 200000,
    vision: true,
    maxOutputTokens: 8192,
    plugins: [],
    icon: 'gemini',
    provider: 'gemini',
  },
  {
    name: 'Gemini Flash 1.5',
    key: 'gemini-1.5-flash-latest',
    isNew: false,
    tokens: 200000,
    vision: true,
    maxOutputTokens: 8192,
    plugins: [],
    icon: 'gemini',
    provider: 'gemini',
  },
  {
    name: 'Gemini Pro',
    key: 'gemini-pro',
    isNew: false,
    tokens: 200000,
    maxOutputTokens: 4096,
    plugins: [],
    icon: 'gemini',
    provider: 'gemini',
  },
  {
    name: 'Gemini Pro',
    key: 'gemini-pro',
    isNew: false,
    tokens: 200000,
    maxOutputTokens: 4096,
    plugins: [],
    icon: 'gemini',
    provider: 'gemini',
  },
  {
    name: 'LLama3 70b Groq',
    key: 'llama3-groq-70b-8192-tool-use-preview',
    isNew: false,
    tokens: 200000,
    plugins: ['web_search', 'image_generation', 'memory', 'webpage_reader'],
    maxOutputTokens: 4096,
    icon: 'groq',
    provider: 'groq',
  },
  {
    name: 'LLama3 8b Groq',
    key: 'llama3-8b-8192',
    isNew: false,
    tokens: 200000,
    plugins: [],
    maxOutputTokens: 4096,
    icon: 'groq',
    provider: 'groq',
  },
];
