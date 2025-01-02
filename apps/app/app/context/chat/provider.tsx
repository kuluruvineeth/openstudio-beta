'use client';

import { ChatContext } from '@/app/context/chat/context';
import {
  type TChatMessage,
  type TChatSession,
  useChatSession,
} from '@/app/hooks/use-chat-session';
import { useLLM } from '@/app/hooks/use-llm';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type React from 'react';

export type TChatProvider = {
  children: React.ReactNode;
};

export const ChatProvider = ({ children }: TChatProvider) => {
  const { sessionId } = useParams();
  const {
    getSessions,
    createNewSession,
    getSessionById,
    clearSessions,
    removeSessionById,
    removeMessageById,
  } = useChatSession();
  const [sessions, setSessions] = useState<TChatSession[]>([]);
  const [isAllSessionLoading, setAllSessionLoading] = useState<boolean>(true);
  const [isCurrentSessionLoading, setCurrentSessionLoading] =
    useState<boolean>(false);
  const [currentSession, setCurrentSession] = useState<
    TChatSession | undefined
  >();
  const [streaming, setStreaming] = useState<boolean>(false);

  const { runModel, stopGeneration } = useLLM({
    onInit: async (props) => {
      appendToCurrentSession(props);
    },
    onStreamStart: async (props) => {
      appendToCurrentSession(props);
      setStreaming(true);
    },
    onStream: async (props) => {
      appendToCurrentSession(props);
    },
    onStreamEnd: async (props) => {
      appendToCurrentSession(props);
      setStreaming(false);
    },
    onError: async (error) => {
      appendToCurrentSession(error);
      setStreaming(false);
    },
  });

  const appendToCurrentSession = (props: TChatMessage) => {
    setCurrentSession((session) => {
      if (!session) return undefined;
      const exisingMessage = session.messages.find(
        (message) => message.id === props.id
      );
      if (exisingMessage) {
        return {
          ...session,
          messages: session.messages.map((message) => {
            if (message.id === props.id) {
              return props;
            }
            return message;
          }),
        };
      }
      return {
        ...session,
        messages: [...session.messages, props],
      };
    });
  };

  const fetchCurrentSession = async () => {
    if (!sessionId) {
      return;
    }
    getSessionById(sessionId?.toString())
      .then((session) => {
        setCurrentSession(session);
        setCurrentSessionLoading(false);
      })
      .catch(() => {
        setCurrentSessionLoading(false);
      });
  };

  useEffect(() => {
    if (!sessionId) {
      return;
    }
    setCurrentSessionLoading(true);
    fetchCurrentSession();
  }, [sessionId]);

  const fetchAllSessions = async () => {
    const sessions = await getSessions();
    setSessions(sessions);
    setAllSessionLoading(false);
  };

  const createSession = async () => {
    const newSession = await createNewSession();
    fetchAllSessions();
    return newSession;
  };

  useEffect(() => {
    setAllSessionLoading(true);
    fetchAllSessions();
  }, []);

  const clearChatSessions = async () => {
    clearSessions().then(() => {
      setSessions([]);
    });
  };

  const removeSession = async (sessionId: string) => {
    setCurrentSessionLoading(true);
    await removeSessionById(sessionId);
    setCurrentSessionLoading(false);
    setAllSessionLoading(true);
    await fetchAllSessions();
    setAllSessionLoading(false);
  };

  const removeMessage = (messageId: string) => {
    if (!currentSession?.id) {
      return;
    }
    setCurrentSessionLoading(true);
    removeMessageById(currentSession?.id, messageId).then(async () => {
      fetchCurrentSession().then(() => {
        setCurrentSessionLoading(false);
      });
    });
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        refetchSessions: fetchAllSessions,
        isAllSessionLoading,
        isCurrentSessionLoading,
        createSession,
        runModel,
        clearChatSessions,
        removeSession,
        streaming,
        currentSession,
        stopGeneration,
        removeMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
