import { cn } from '@repo/design-system/lib/utils';
import Image from 'next/image';

export type ModelIconType =
  | 'gpt3'
  | 'gpt4'
  | 'anthropic'
  | 'gemini'
  | 'openai'
  | 'chathub'
  | 'websearch'
  | 'calculator'
  | 'duckduckgo_search'
  | 'website_reader'
  | 'ollama'
  | 'groq';

export type TModelIcon = {
  type: ModelIconType;
  size: 'sm' | 'md' | 'lg';
  base64?: string;
};

export const ModelIcon = ({ type, size, base64 }: TModelIcon) => {
  const iconSrc = {
    gpt3: '/icons/gpt3.svg',
    gpt4: '/icons/gpt4.svg',
    anthropic: '/icons/claude.svg',
    gemini: '/icons/gemini.svg',
    openai: '/icons/openai.svg',
    chathub: '/icons/chathub.svg',
    websearch: '/icons/websearch.svg',
    calculator: '/icons/calculator.svg',
    duckduckgo_search: '/icons/duckduckgo.svg',
    website_reader: '/icons/website_reader.svg',
    ollama: '/icons/ollama.svg',
    groq: '/icons/groq.svg',
  };

  return (
    <div
      className={cn(
        'relative rounded-md',
        size === 'sm' && 'h-6 w-6',
        size === 'md' && 'h-8 w-8',
        size === 'lg' && 'h-10 w-10'
      )}
    >
      <Image
        src={base64 ? base64 : iconSrc[type]}
        width={0}
        height={0}
        alt={type}
        className={'relative h-full w-full rounded-md object-cover'}
        sizes="100vw"
      />
    </div>
  );
};
