'use client';

import { useChatSessionQueries } from '@/services/sessions/queries';
import { createSessionsStore } from '@/store/sessions/store';
import type {
  TChatMessage,
  TChatSession,
  TSessionsContext,
  TSessionsProvider,
} from '@/types';
import {
  type FC,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const SessionContext = createContext<TSessionsContext | undefined>(
  undefined
);

export const SessionsProvider: FC<TSessionsProvider> = ({ children }) => {
  const store = useMemo(() => createSessionsStore(), []);
  const [sessions, setSessions] = useState<TChatSession[]>([]);
  const activeSessionId = store((state) => state.activeSessionId);
  const setActiveSessionId = store((state) => state.setActiveSessionId);
  const useChatSessionQueriesProps = useChatSessionQueries();
  const { sessionsQuery, createNewSessionMutation, addMessageMutation } =
    useChatSessionQueriesProps;

  useEffect(() => {
    sessionsQuery?.data && setSessions(sessionsQuery?.data || []);
  }, [sessionsQuery?.data]);

  const createSession = async (props: { redirect?: boolean }) => {
    const { redirect } = props;
    await createNewSessionMutation.mutateAsync(undefined, {
      onSuccess: (data) => {
        if (redirect) {
          setActiveSessionId(data.id);
        }
      },
    });
  };

  useEffect(() => {
    if (!activeSessionId) {
      createSession({ redirect: true });
    }
  }, []);

  const addMessage = async (parentId: string, message: TChatMessage) => {
    await addMessageMutation.mutateAsync({
      parentId,
      message,
    });
  };

  return (
    <SessionContext.Provider
      value={{
        sessions,
        activeSessionId,
        setActiveSessionId,
        isAllSessionLoading: sessionsQuery.isLoading,
        createSession,
        refetchSessions: sessionsQuery.refetch,
        addMessage,
        ...useChatSessionQueriesProps,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSessions = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessions must be used within a SessionsProvider');
  }
  return context;
};
