'use client';
import type { TBot } from '@/app/hooks/use-bots';
import {
  type TChatMessage,
  type TChatSession,
  useChatSession,
} from '@/app/hooks/use-chat-session';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createContext, useContext } from 'react';

export type TSessionsContext = {
  sessions: TChatSession[];
  isAllSessionLoading: boolean;
  isCurrentSessionLoading: boolean;
  createSession: (props: { bot?: TBot; redirect?: boolean }) => void;
  currentSession?: TChatSession;
  setCurrentSession?: React.Dispatch<
    React.SetStateAction<TChatSession | undefined>
  >;
  removeMessage: (messageId: string) => void;
  refetchSessions?: () => void;
  refetchCurrentSession?: () => void;
  addMessageToSession: (sessionId: string, message: TChatMessage) => void;
  getSessionById: (id: string) => Promise<TChatSession | undefined>;
} & ReturnType<typeof useChatSession>;

export const SessionContext = createContext<TSessionsContext | undefined>(
  undefined
);

export const useSessionsContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error(
      'useSessionsContext must be used within a SessionsProvider'
    );
  }
  return context;
};

export type TSessionsProvider = {
  children: React.ReactNode;
};

export const SessionsProvider = ({ children }: TSessionsProvider) => {
  const { sessionId } = useParams();
  const [sessions, setSessions] = useState<TChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<
    TChatSession | undefined
  >();
  const props = useChatSession(sessionId?.toString());
  const {
    sessionsQuery,
    createNewSessionMutation,
    removeMessageByIdMutation,
    addMessageToSessionMutation,
    getSessionByIdMutation,
    getSessionByIdQuery,
    addSessionsMutation,
  } = props;
  const currentSessionQuery = getSessionByIdQuery;
  const { push, refresh } = useRouter();
  useEffect(() => {
    sessionsQuery?.data && setSessions(sessionsQuery?.data || []);
  }, [sessionsQuery?.data]);
  useEffect(() => {
    currentSessionQuery?.data &&
      setCurrentSession(currentSessionQuery?.data || []);
  }, [currentSessionQuery?.data]);
  useEffect(() => {
    if (currentSessionQuery?.error) {
      createSession({ redirect: true });
    }
  }, [currentSessionQuery?.error]);
  const createSession = async (props: { bot?: TBot; redirect?: boolean }) => {
    const { bot, redirect } = props;
    await createNewSessionMutation.mutateAsync(bot, {
      onSuccess: (data) => {
        console.log('new session', data);
        if (redirect) {
          // window.open(`/chat/${data.id}`, "_self");
          push(`/chat/${data.id}`);
          //   refresh();
        }
      },
    });
  };
  const removeMessage = (messageId: string) => {
    if (!currentSession?.id) {
      return;
    }
    removeMessageByIdMutation.mutate(
      {
        sessionId: currentSession?.id,
        messageId,
      },
      {
        onSuccess: () => {
          currentSessionQuery.refetch();
        },
      }
    );
  };
  const addMessageToSession = async (
    sessionId: string,
    message: TChatMessage
  ) => {
    await addMessageToSessionMutation.mutateAsync({
      sessionId,
      message,
    });
  };
  const getSessionById = async (id: string) => {
    return await getSessionByIdMutation.mutateAsync(id);
  };
  return (
    <SessionContext.Provider
      value={{
        sessions,
        isAllSessionLoading: sessionsQuery.isLoading,
        isCurrentSessionLoading: currentSessionQuery.isLoading,
        createSession,
        setCurrentSession,
        currentSession,
        removeMessage,
        refetchSessions: sessionsQuery.refetch,
        refetchCurrentSession: currentSessionQuery.refetch,
        addMessageToSession,
        getSessionById,
        ...props,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
