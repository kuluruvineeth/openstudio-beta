import type { TModelItem } from '@/types';

export const providers = [
  'chathub',
  'openai',
  'anthropic',
  'gemini',
  'ollama',
  'groq',
  'deepseek',
  'meta',
  'xai',
  'perplexity',
] as const;

export const ollamaModelsSupportsTools = [
  'llama3-groq-tool-use:latest',
  'llama3.2:3b',
];

export const allPlugins = [
  'web_search',
  'image_generation',
  'memory',
  'webpage_reader',
  'py_interpreter',
  'bar_chart',
  'pie_chart',
  'line_chart',
];

export const models: TModelItem[] = [
  {
    name: 'ChatHub',
    key: 'chathub',
    isFree: true,
    isNew: true,
    tokens: 640000,
    maxOutputTokens: 8000,
    description: 'Free Model',
    vision: false,
    plugins: [],
    icon: 'chathub',
    provider: 'chathub',
    inputTokenPrice: 0.000055, // $0.55 per 1M tokens
    outputTokenPrice: 0.000219, // $2.19 per 1M tokens
  },
  {
    name: 'GPT 4o Mini',
    key: 'gpt-4o-mini',
    isNew: false,
    tokens: 128000,
    maxOutputTokens: 2048,
    description: 'Best for everyday tasks',
    vision: true,
    plugins: allPlugins,
    icon: 'gpt4',
    provider: 'openai',
    inputTokenPrice: 0.000015, // $0.15 per 1M tokens
    outputTokenPrice: 0.00006, // $0.6 per 1M tokens
  },
  {
    name: 'O3 Mini',
    key: 'o3-mini-2025-01-31',
    isNew: true,
    tokens: 200000,
    maxOutputTokens: 8192,
    description: 'Best for everyday tasks',
    vision: true,
    plugins: allPlugins,
    icon: 'gpt4',
    provider: 'openai',
    inputTokenPrice: 0.00011,
    outputTokenPrice: 0.00044,
  },
  // {
  //   name: "O1 Mini",
  //   key: "o1-mini-2024-09-12",
  //   isNew: false,
  //   tokens: 200000,
  //   maxOutputTokens: 8192,
  //   description: "Best for everyday tasks",
  //   vision: true,
  //   plugins: allPlugins,
  //   icon: "gpt4",
  //   provider: "openai",
  // },
  // {
  //   name: 'GPT 4o',
  //   key: 'gpt-4o',
  //   isNew: false,
  //   tokens: 128000,
  //   maxOutputTokens: 2048,
  //   vision: true,
  //   plugins: ['web_search', 'image_generation', 'memory', 'webpage_reader'],
  //   icon: 'gpt4',
  //   provider: 'openai',
  // },
  {
    name: 'GPT 4 Turbo',
    key: 'gpt-4-turbo',
    isNew: false,
    tokens: 128000,
    maxOutputTokens: 4096,
    description: 'Best for complex tasks',
    vision: true,
    plugins: allPlugins,
    icon: 'gpt4',
    provider: 'openai',
    inputTokenPrice: 0.001, // $10 per 1M tokens
    outputTokenPrice: 0.003, // $30 per 1M tokens
  },
  {
    name: 'GPT4',
    key: 'gpt-4',
    isNew: false,
    tokens: 128000,
    maxOutputTokens: 4096,
    description: 'Best for complex tasks',
    plugins: allPlugins,
    icon: 'gpt4',
    provider: 'openai',
    inputTokenPrice: 0.003, // $30 per 1M tokens
    outputTokenPrice: 0.006, // $60 per 1M tokens
  },
  {
    name: 'GPT3.5 Turbo',
    key: 'gpt-3.5-turbo-0125',
    isNew: false,
    tokens: 16384,
    maxOutputTokens: 4096,
    description: 'Best for complex tasks',
    plugins: allPlugins,
    icon: 'gpt3',
    provider: 'openai',
    inputTokenPrice: 0.00005, // $0.5 per 1M tokens
    outputTokenPrice: 0.00015, // $1.5 per 1M tokens
  },
  {
    name: 'Claude 3.7 Sonnet Latest',
    key: 'claude-3-7-sonnet-20250219',
    isNew: true,
    tokens: 200000,
    description: 'Best for complex tasks',
    vision: true,
    maxOutputTokens: 8192,
    plugins: allPlugins,
    icon: 'anthropic',
    provider: 'anthropic',
    inputTokenPrice: 0.0003, // $3 per 1M tokens
    outputTokenPrice: 0.0015, // $15 per 1M tokens
  },
  {
    name: 'Claude 3 Opus',
    key: 'claude-3-opus-20240229',
    isNew: false,
    tokens: 200000,
    description: 'Best for complex tasks',
    vision: true,
    maxOutputTokens: 4096,
    plugins: allPlugins,
    icon: 'anthropic',
    provider: 'anthropic',
    inputTokenPrice: 0.0015, // $15 per 1M tokens
    outputTokenPrice: 0.0075, // $75 per 1M tokens
  },
  {
    name: 'Claude 3 Sonnet',
    key: 'claude-3-sonnet-20240229',
    isNew: false,
    tokens: 200000,
    description: 'Best for complex tasks',
    vision: true,
    maxOutputTokens: 4096,
    plugins: allPlugins,
    icon: 'anthropic',
    provider: 'anthropic',
    inputTokenPrice: 0.0003, // $3 per 1M tokens
    outputTokenPrice: 0.0015, // $15 per 1M tokens
  },
  {
    name: 'Claude 3.5 Sonnet',
    key: 'claude-3-5-sonnet-20241022',
    isNew: false,
    tokens: 200000,
    description: 'Best for complex tasks',
    vision: true,
    maxOutputTokens: 8192,
    plugins: allPlugins,
    icon: 'anthropic',
    provider: 'anthropic',
    inputTokenPrice: 0.0003, // $3 per 1M tokens
    outputTokenPrice: 0.0015, // $15 per 1M tokens
  },
  {
    name: 'Claude 3.5 Haiku',
    key: 'claude-3-5-haiku-20241022',
    isNew: false,
    tokens: 200000,
    description: 'Best for complex tasks',
    vision: false,
    maxOutputTokens: 8192,
    plugins: allPlugins,
    icon: 'anthropic',
    provider: 'anthropic',
    inputTokenPrice: 0.00008, // $0.8 per 1M tokens
    outputTokenPrice: 0.0004, // $4 per 1M tokens
  },
  {
    name: 'Claude 3 Haiku',
    key: 'claude-3-haiku-20240307',
    isNew: false,
    tokens: 200000,
    vision: true,
    maxOutputTokens: 4096,
    description: 'Best for complex tasks',
    plugins: allPlugins,
    icon: 'anthropic',
    provider: 'anthropic',
    inputTokenPrice: 0.000025, // $0.25 per 1M tokens
    outputTokenPrice: 0.0001, // $1 per 1M tokens
  },
  {
    name: 'Gemini 2.5 Pro Exp',
    key: 'gemini-2.5-pro-exp-03-25',
    isNew: true,
    tokens: 2097152,
    description: 'Best for complex tasks',
    vision: true,
    maxOutputTokens: 8192,
    plugins: allPlugins,
    icon: 'gemini',
    provider: 'gemini',
    inputTokenPrice: 0.0, // $0.0 per 1M tokens
    outputTokenPrice: 0.0, // $0.0 per 1M tokens
  },
  {
    name: 'Gemini Flash 2.0',
    key: 'gemini-2.0-flash',
    isNew: false,
    tokens: 1048576,
    description: 'Best for complex tasks',
    vision: true,
    maxOutputTokens: 8192,
    plugins: [],
    icon: 'gemini',
    provider: 'gemini',
    inputTokenPrice: 0.0, // $0.0 per 1M tokens
    outputTokenPrice: 0.0, // $0.0 per 1M tokens
  },
  {
    name: 'Gemini Flash 2.0 Lite Preview',
    key: 'gemini-2.0-flash-lite-preview-02-05',
    isNew: false,
    tokens: 1048576,
    description: 'Best for complex tasks',
    vision: true,
    maxOutputTokens: 8192,
    plugins: [],
    icon: 'gemini',
    provider: 'gemini',
    inputTokenPrice: 0.0, // $0.0 per 1M tokens
    outputTokenPrice: 0.0, // $0.0 per 1M tokens
  },
  {
    name: 'Gemini Pro 2.0',
    key: 'gemini-2.0-pro-exp-02-05',
    isNew: false,
    tokens: 2097152,
    description: 'Best for complex tasks',
    vision: true,
    maxOutputTokens: 8192,
    plugins: [],
    icon: 'gemini',
    provider: 'gemini',
    inputTokenPrice: 0.0, // $0.0 per 1M tokens
    outputTokenPrice: 0.0, // $0.0 per 1M tokens
  },
  {
    name: 'Gemini Flash 2.0 Exp',
    key: 'gemini-2.0-flash-exp',
    isNew: false,
    tokens: 1048576,
    description: 'Best for complex tasks',
    vision: true,
    maxOutputTokens: 8192,
    plugins: [],
    icon: 'gemini',
    provider: 'gemini',
    inputTokenPrice: 0.0, // $0.0 per 1M tokens
    outputTokenPrice: 0.0, // $0.0 per 1M tokens
  },
  {
    name: 'Gemini Flash 2.0 Thinking Experimental 01-21',
    key: 'gemini-2.0-flash-thinking-exp-01-21',
    isNew: false,
    tokens: 1048576,
    description: 'Best for complex tasks',
    vision: true,
    maxOutputTokens: 8192,
    plugins: [],
    icon: 'gemini',
    provider: 'gemini',
    inputTokenPrice: 0.0, // $0.0 per 1M tokens
    outputTokenPrice: 0.0, // $0.0 per 1M tokens
  },
  {
    name: 'Gemini Experimental 1206',
    key: 'gemini-exp-1206',
    isNew: false,
    tokens: 2097152,
    description: 'Best for complex tasks',
    vision: true,
    maxOutputTokens: 8192,
    plugins: [],
    icon: 'gemini',
    provider: 'gemini',
    inputTokenPrice: 0.0, // $0.0 per 1M tokens
    outputTokenPrice: 0.0, // $0.0 per 1M tokens
  },
  {
    name: 'LearnLM 1.5 Pro Experimental',
    key: 'learnlm-1.5-pro-experimental',
    isNew: false,
    tokens: 32767,
    description: 'Best for complex tasks',
    vision: true,
    maxOutputTokens: 8192,
    plugins: [],
    icon: 'gemini',
    provider: 'gemini',
    inputTokenPrice: 0.0, // $0.0 per 1M tokens
    outputTokenPrice: 0.0, // $0.0 per 1M tokens
  },
  {
    name: 'Gemini Pro 1.5',
    key: 'gemini-1.5-pro',
    isNew: false,
    tokens: 2000000,
    description: 'Best for complex tasks',
    vision: true,
    maxOutputTokens: 8192,
    plugins: [],
    icon: 'gemini',
    provider: 'gemini',
    inputTokenPrice: 0.000125, // $1.25 per 1M tokens
    outputTokenPrice: 0.0005, // $5 per 1M tokens
  },
  {
    name: 'Gemini Flash 1.5',
    key: 'gemini-1.5-flash',
    isNew: false,
    tokens: 1000000,
    description: 'Best for complex tasks',
    vision: true,
    maxOutputTokens: 8192,
    plugins: [],
    icon: 'gemini',
    provider: 'gemini',
    inputTokenPrice: 0.000015, // $0.15 per 1M tokens
    outputTokenPrice: 0.00006, // $0.6 per 1M tokens
  },
  {
    name: 'Gemini 1.5 Flash 8B',
    key: 'gemini-1.5-flash-8b',
    isNew: false,
    tokens: 1000000,
    description: 'Best for complex tasks',
    vision: true,
    maxOutputTokens: 8192,
    plugins: [],
    icon: 'gemini',
    provider: 'gemini',
    inputTokenPrice: 0.0000075, // $0.075 per 1M tokens
    outputTokenPrice: 0.00003, // $0.3 per 1M tokens
  },
  {
    name: 'LLama3.2 90b Vision Preview',
    key: 'llama-3.2-90b-vision-preview',
    isNew: false,
    tokens: 128000,
    description: 'Best for complex tasks',
    plugins: [],
    maxOutputTokens: 8192,
    icon: 'groq',
    provider: 'groq',
    inputTokenPrice: 0.0, // $0.0 per 1M tokens
    outputTokenPrice: 0.0, // $0.0 per 1M tokens
  },
  {
    name: 'LLama3.3 70b Versatile',
    key: 'llama-3.3-70b-versatile',
    isNew: false,
    tokens: 128000,
    description: 'Best for complex tasks',
    plugins: [],
    maxOutputTokens: 32768,
    icon: 'groq',
    provider: 'groq',
    inputTokenPrice: 0.0, // $0.0 per 1M tokens
    outputTokenPrice: 0.0, // $0.0 per 1M tokens
  },
  {
    name: 'DeepSeek R1',
    key: 'deepseek-r1-distill-llama-70b',
    isNew: true,
    tokens: 128000,
    description: 'Best for reasoning and faster response',
    plugins: [],
    maxOutputTokens: 4096,
    icon: 'deepseek',
    provider: 'deepseek',
    inputTokenPrice: 0.0, // $0.0 per 1M tokens
    outputTokenPrice: 0.0, // $0.0 per 1M tokens
  },
  {
    name: 'grok-2',
    key: 'grok-2-latest',
    isNew: false,
    tokens: 131072,
    description: 'Best for complex tasks',
    plugins: [],
    maxOutputTokens: 8192,
    icon: 'xai',
    provider: 'xai',
    inputTokenPrice: 0.0002, // $2.0 per 1M tokens
    outputTokenPrice: 0.001, // $10.0 per 1M tokens
  },
  {
    name: 'grok-2-vision',
    key: 'grok-2-vision-latest',
    isNew: false,
    tokens: 32768,
    description: 'Best for complex tasks',
    plugins: [],
    maxOutputTokens: 4096,
    icon: 'xai',
    provider: 'xai',
    inputTokenPrice: 0.0002, // $2.0 per 1M tokens, i want to calculate in cents
    outputTokenPrice: 0.001, // $10.0 per 1M tokens
  },
  {
    name: 'sonar-reasoning-pro',
    key: 'sonar-reasoning-pro',
    isNew: true,
    tokens: 127000,
    description: 'Best for complex tasks',
    plugins: [],
    maxOutputTokens: 8192,
    icon: 'perplexity',
    provider: 'perplexity',
    inputTokenPrice: 0.001,
    outputTokenPrice: 0.0005,
  },
  {
    name: 'sonar-pro',
    key: 'sonar-pro',
    isNew: false,
    tokens: 200000,
    description: 'Best for complex tasks',
    plugins: [],
    maxOutputTokens: 8192,
    icon: 'perplexity',
    provider: 'perplexity',
    inputTokenPrice: 0.003,
    outputTokenPrice: 0.0015,
  },
];

// return cost in cents
export function calculateCost(
  model: TModelItem,
  usage: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  }
) {
  const { input_tokens, output_tokens, total_tokens } = usage;
  const cost =
    input_tokens * model.inputTokenPrice +
    output_tokens * model.outputTokenPrice; //store in cents
  return cost;
}
