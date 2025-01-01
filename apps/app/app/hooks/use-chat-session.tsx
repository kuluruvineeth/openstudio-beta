import type { TModelKey } from '@/app/hooks/use-model-list';
import type { PromptType, RoleType } from '@/app/lib/prompts';
import type { AIMessage, HumanMessage } from '@langchain/core/messages';
import { get, set } from 'idb-keyval';
import moment from 'moment';
import { v4 } from 'uuid';

export const ModelType = {
  GPT3: 'gpt-3',
  GPT4: 'gpt-4',
  CLAUDE2: 'claude-2',
  CLAUDE3: 'claude-3',
} as const;

export type ModelType = (typeof ModelType)[keyof typeof ModelType];

export type PromptProps = {
  type: PromptType;
  context?: string;
  role: RoleType;
  query?: string;
  regenerate?: boolean;
};

export type TChatMessage = {
  id: string;
  model: TModelKey;
  human: HumanMessage;
  ai: AIMessage;
  rawHuman: string;
  rawAI: string;
  props?: PromptProps;
  createdAt?: string;
};

export type TChatSession = {
  messages: TChatMessage[];
  title?: string;
  id: string;
  createdAt: string;
  updatedAt?: string;
};

export const useChatSession = () => {
  const getSessions = async (): Promise<TChatSession[]> => {
    return (await get('chat-sessions')) || [];
  };
  const setSession = async (chatSession: TChatSession) => {
    const sessions = await getSessions();
    const newSessions = [...sessions, chatSession];
    await set('chat-sessions', newSessions);
  };
  const addMessageToSession = async (
    sessionId: string,
    chatMessage: TChatMessage
  ) => {
    const sessions = await getSessions();
    const newSessions = sessions.map((session) => {
      if (session.id === sessionId) {
        if (!session?.messages?.length) {
          return {
            ...session,
            messages: [...session.messages, chatMessage],
            title: chatMessage.rawHuman,
            updatedAt: moment().toISOString(),
          };
        }
        return {
          ...session,
          messages: [...session.messages, chatMessage],
          updatedAt: moment().toISOString(),
        };
      }
      return session;
    });
    await set('chat-sessions', newSessions);
  };
  const updateSession = async (
    sessionId: string,
    newSession: Omit<TChatSession, 'id'>
  ) => {
    const sessions = await getSessions();
    const newSessions = sessions.map((session) => {
      if (session.id === sessionId) {
        return { ...session, ...newSession };
      }
      return session;
    });
    await set('chat-sessions', newSessions);
  };
  const getSessionById = async (id: string) => {
    const sessions = await getSessions();
    return sessions.find((session: TChatSession) => session.id === id);
  };
  const removeSessionById = async (id: string) => {
    const sessions = await getSessions();
    const newSessions = sessions.filter(
      (session: TChatSession) => session.id !== id
    );
    await set('chat-sessions', newSessions);
  };

  const sortSessions = (
    sessions: TChatSession[],
    sortBy: 'createdAt' | 'updatedAt'
  ) => {
    return sessions.sort((a, b) => moment(b[sortBy]).diff(moment(a[sortBy])));
  };

  const createNewSession = async () => {
    const sessions = (await getSessions()) || [];
    const latestSession = sortSessions(sessions, 'createdAt')?.[0];
    if (latestSession && !latestSession?.messages?.length) {
      return latestSession;
    }
    const newSession: TChatSession = {
      id: v4(),
      messages: [],
      title: 'Untitled',
      createdAt: moment().toISOString(),
    };
    const newSessions = [...sessions, newSession];
    await set('chat-sessions', newSessions);
    return newSession;
  };

  const clearSessions = async () => {
    await set('chat-sessions', []);
  };

  return {
    getSessions,
    setSession,
    getSessionById,
    removeSessionById,
    updateSession,
    addMessageToSession,
    createNewSession,
    clearSessions,
    sortSessions,
  };
};
