'use client';

import type { PromptProps, TChatSession } from '@/app/hooks/use-chat-session';
import type { TStreamProps } from '@/app/hooks/use-llm';
import { createContext, useContext } from 'react';

export type TChatContext = {
  sessions: TChatSession[];
  refetchSessions: () => void;
  isAllSessionLoading: boolean;
  isCurrentSessionLoading: boolean;
  createSession: () => Promise<TChatSession>;
  removeSession: (sessionId: string) => Promise<void>;
  clearChatSessions: () => Promise<void>;
  currentSession: TChatSession | undefined;
  streamingMessage?: TStreamProps;
  stopGeneration: () => void;
  runModel: (props: PromptProps, sessionId: string) => Promise<void>;
  removeMessage: (messageId: string) => void;
};
export const ChatContext = createContext<TChatContext | undefined>(undefined);
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
