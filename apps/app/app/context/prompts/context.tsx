'use client';

import { createContext, useContext } from 'react';

export type TPromptsContext = {
  open: () => void;
  dismiss: () => void;
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
