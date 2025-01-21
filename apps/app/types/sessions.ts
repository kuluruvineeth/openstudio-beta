import type { useChatSessionQueries } from '@/services/sessions/queries';
import type { TChatMessage } from '@/types';
import type { TCustomAssistant } from '@repo/backend/types';

export type TSessionsState = {
  activeSessionId?: string;
  setActiveSessionId: (id: string) => void;
};

export type TLegacyChatSession = {
  title?: string;
  id: string;
  createdAt: string;
  updatedAt?: string;
};

export type TChatSession = {
  title: string | null;
  id: string;
  customAssistant?: TCustomAssistant | null;
  isExample?: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  organizationId: string;
  userId: string;
};

export type TSessionsProvider = {
  children: React.ReactNode;
};
export type TSessionsContext = {
  sessions: TChatSession[];
  activeSessionId?: string;
  setActiveSessionId: (id: string) => void;
  isAllSessionLoading: boolean;
  createSession: () => Promise<void>;
  refetchSessions?: () => void;
  addMessage: (parentId: string, message: TChatMessage) => void;
} & ReturnType<typeof useChatSessionQueries>;
