import type { TModelKey } from '@/app/hooks/use-model-list';
import { sortSessions } from '@/app/lib/helper';
import { useMutation, useQuery } from '@tanstack/react-query';
import { get, set } from 'idb-keyval';
import moment from 'moment';
import { v4 } from 'uuid';

export type TAssistantType = 'base' | 'custom';

export type TAssistant = {
  name: string;
  systemPrompt: string;
  baseModel: TModelKey;
  key: TModelKey | string;
  type: TAssistantType;
};

export type TLLMInputProps = {
  context?: string;
  input?: string;
  image?: string;
  sessionId: string;
  messageId?: string;
  assistant: TAssistant;
};

export type TToolResponse = {
  toolName: string;
  toolLoading?: boolean;
  toolArgs?: any;
  toolResponse?: any;
  toolRenderArgs?: any;
};

export type TChatMessage = {
  id: string;
  image?: string;
  rawHuman?: string;
  rawAI?: string;
  sessionId: string;
  inputProps: TLLMInputProps;
  tools?: TToolResponse[];
  isLoading?: boolean;
  stop?: boolean;
  stopReason?: 'error' | 'cancel' | 'apikey' | 'recursion' | 'finish';
  createdAt: string;
};

export type TChatSession = {
  messages: TChatMessage[];
  title?: string;
  id: string;
  createdAt: string;
  updatedAt?: string;
};

export const useChatSession = (id?: string) => {
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
        console.log('session add message', session);
        if (!!session?.messages?.length) {
          const isExisingMessage = session.messages.find(
            (m) => m.id === chatMessage.id
          );
          return {
            ...session,
            messages: isExisingMessage
              ? session.messages.map((m) => {
                  if (m.id === chatMessage.id) {
                    return { ...m, ...chatMessage };
                  }
                  return m;
                })
              : [...session.messages, chatMessage],
            updatedAt: moment().toISOString(),
          };
        }
        console.log('session add message 2', session);

        return {
          ...session,
          messages: [chatMessage],
          title: chatMessage.rawHuman,
          updatedAt: moment().toISOString(),
        };
      }
      return session;
    });

    console.log('new add message', newSessions);

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

  const sessionsQuery = useQuery({
    queryKey: ['chat-sessions'],
    queryFn: async () => {
      return await getSessions();
    },
  });

  const setSessionMutation = useMutation({
    mutationFn: async (session: TChatSession) => await setSession(session),
    onSuccess: () => {
      sessionsQuery.refetch();
    },
  });

  const addMessageToSessionMutation = useMutation({
    mutationFn: async ({
      sessionId,
      message,
    }: {
      sessionId: string;
      message: TChatMessage;
    }) => {
      await addMessageToSession(sessionId, message);
    },
    onSuccess: () => {
      sessionsQuery.refetch();
    },
  });

  const updateSessionMutation = useMutation({
    mutationFn: async ({
      sessionId,
      session,
    }: {
      sessionId: string;
      session: Partial<Omit<TChatSession, 'id'>>;
    }) => {
      await updateSession(sessionId, session);
    },
    onSuccess: () => {
      sessionsQuery.refetch();
    },
  });

  const removeSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => await removeSessionById(sessionId),
    onSuccess: () => {
      sessionsQuery.refetch();
    },
  });

  const removeSessionByIdMutation = useMutation({
    mutationFn: async (sessionId: string) => await removeSessionById(sessionId),
    onSuccess: () => {
      sessionsQuery.refetch();
    },
  });

  const getSessionByIdQuery = useQuery({
    queryKey: ['chat-session', id],
    queryFn: async () => {
      if (!id) return;
      return await getSessionById(id);
    },

    enabled: !!id,
  });

  const createNewSessionMutation = useMutation({
    mutationFn: async () => await createNewSession(),
    onSuccess: () => {
      sessionsQuery.refetch();
    },
  });

  const clearSessionsMutation = useMutation({
    mutationFn: async () => await clearSessions(),
    onSuccess: () => {
      sessionsQuery.refetch();
    },
  });

  const removeMessageByIdMutation = useMutation({
    mutationFn: async ({
      sessionId,
      messageId,
    }: {
      sessionId: string;
      messageId: string;
    }) => {
      await removeMessageById(sessionId, messageId);
    },
    onSuccess: () => {
      sessionsQuery.refetch();
    },
  });

  const getSessionByIdMutation = useMutation({
    mutationFn: async (id: string) => await getSessionById(id),
  });

  const addSessionsMutation = useMutation({
    mutationFn: async (sessions: TChatSession[]) => {
      const existingSessions = await getSessions();
      const newSessions = [...existingSessions, ...sessions];
      await set('chat-sessions', newSessions);
      return newSessions;
    },
    onSuccess: () => {
      sessionsQuery.refetch();
    },
  });

  return {
    sessionsQuery,
    setSessionMutation,
    addMessageToSessionMutation,
    updateSessionMutation,
    removeSessionMutation,
    removeSessionByIdMutation,
    getSessionByIdQuery,
    createNewSessionMutation,
    clearSessionsMutation,
    removeMessageByIdMutation,
    getSessionByIdMutation,
    addSessionsMutation,
  };
};
