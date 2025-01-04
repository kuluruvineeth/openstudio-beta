import type { TBot } from '@/app/hooks/use-bots';
import type { TRunModel } from '@/app/hooks/use-llm';
import type { TModelKey } from '@/app/hooks/use-model-list';
import type { PromptType, RoleType } from '@/app/lib/prompts';
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

export type InputProps = {
  type: PromptType;
  context?: string;
  role: RoleType;
  query?: string;
  image?: string;
};

export type TChatMessage = {
  id: string;
  model: TModelKey;
  image?: string;
  rawHuman?: string;
  rawAI?: string;
  sessionId: string;
  runModelProps: TRunModel;
  toolName?: string;
  toolResult?: string;
  isLoading?: boolean;
  isToolRunning?: boolean;
  hasError?: boolean;
  errorMesssage?: string;
  createdAt: string;
};

export type TChatSession = {
  messages: TChatMessage[];
  bot?: TBot;
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
        if (!!session?.messages?.length) {
          const isExisingMessage = session.messages.find(
            (m) => m.id === chatMessage.id
          );
          return {
            ...session,
            messages: isExisingMessage
              ? session.messages.map((m) => {
                  if (m.id === chatMessage.id) {
                    console.log('m', chatMessage);
                    return { ...m, ...chatMessage };
                  }
                  return m;
                })
              : [...session.messages, chatMessage],
            title: chatMessage.rawHuman,
            updatedAt: moment().toISOString(),
          };
        }

        console.log('new message', chatMessage);
        return {
          ...session,
          messages: [chatMessage],
          title: chatMessage.rawHuman,
          updatedAt: moment().toISOString(),
        };
      }
      return session;
    });
    console.log('newSessions', newSessions);
    await set('chat-sessions', newSessions);
  };
  const updateSession = async (
    sessionId: string,
    newSession: Partial<Omit<TChatSession, 'id'>>
  ) => {
    const sessions = await getSessions();
    const newSessions = sessions.map((session) => {
      if (session.id === sessionId) {
        return { ...session, ...newSession };
      }
      return session;
    });
    console.log('new updated Sessions', newSessions);
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
    return newSessions;
  };

  const removeMessageById = async (sessionId: string, messageId: string) => {
    const sessions = await getSessions();
    const newSessions = sessions.map((session) => {
      if (session.id === sessionId) {
        const newMessages = session.messages.filter(
          (message) => message.id !== messageId
        );
        console.log('newMessages', newMessages, messageId, sessionId);
        return { ...session, messages: newMessages };
      }
      return session;
    });
    const newFilteredSessions = newSessions?.filter(
      (s) => !!s?.messages?.length
    );
    await set('chat-sessions', newFilteredSessions);
    return newFilteredSessions;
  };

  const sortSessions = (
    sessions: TChatSession[],
    sortBy: 'createdAt' | 'updatedAt'
  ) => {
    return sessions.sort((a, b) => moment(b[sortBy]).diff(moment(a[sortBy])));
  };

  const sortMessages = (messages: TChatMessage[], sortBy: 'createdAt') => {
    return messages.sort((a, b) => moment(a[sortBy]).diff(moment(b[sortBy])));
  };

  const createNewSession = async (bot?: TBot) => {
    const sessions = (await getSessions()) || [];
    const latestSession = sortSessions(sessions, 'createdAt')?.[0];
    if (latestSession && !latestSession?.messages?.length) {
      if (latestSession.bot) {
        await updateSession(latestSession.id, { bot: undefined });
        return { ...latestSession, bot: undefined };
      }
      return latestSession;
    }
    const newSession: TChatSession = {
      id: v4(),
      messages: [],
      title: 'Untitled',
      bot,
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
    sortMessages,
    removeMessageById,
  };
};
