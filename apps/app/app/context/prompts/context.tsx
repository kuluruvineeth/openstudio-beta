'use client';

import type { TPrompt } from '@/app/hooks/use-prompts';
import { createContext, useContext } from 'react';

export type TPromptsContext = {
  open: (action?: 'public' | 'local' | 'create') => void;
  dismiss: () => void;
  allPrompts: TPrompt[];
};

export const PromptsContext = createContext<undefined | TPromptsContext>(
  undefined
);

export const usePrompts = () => {
  const context = useContext(PromptsContext);
  if (context === undefined) {
    throw new Error('usePrompts must be used within a PromptssProvider');
  }
  return context;
};
