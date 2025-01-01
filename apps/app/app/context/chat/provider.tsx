'use client';

import { ChatContext } from '@/app/context/chat/context';
import { useChatSession } from '@/app/hooks/use-chat-session';
import type { TChatSession } from '@/app/hooks/use-chat-session';
import { useLLM } from '@/app/hooks/use-llm';
import type { TStreamProps } from '@/app/hooks/use-llm';
import type React from 'react';
import { useEffect, useState } from 'react';

export type TChatProvider = {
  children: React.ReactNode;
};
export const ChatProvider = ({ children }: TChatProvider) => {
  const { getSessions, createNewSession } = useChatSession();
  const [sessions, setSessions] = useState<TChatSession[]>([]);
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true);
  const [lastStream, setLastStream] = useState<TStreamProps>();
  const { runModel } = useLLM({
    onStreamStart: () => {
      setLastStream(undefined);
    },
    onStream: async (props) => {
      setLastStream(props);
    },
    onStreamEnd: () => {
      fetchSessions().then(() => {
        setLastStream(undefined);
      });
    },
  });

  const fetchSessions = async () => {
    const sessions = await getSessions();
    setSessions(sessions);
    setIsSessionLoading(false);
  };
  const createSession = async () => {
    await createNewSession();
    fetchSessions();
  };
  useEffect(() => {
    setIsSessionLoading(true);
    fetchSessions();
  }, []);
  const refetchSessions = () => {
    fetchSessions();
  };
  return (
    <ChatContext.Provider
      value={{
        chatSession: [],
        sessions,
        refetchSessions,
        isSessionLoading,
        createSession,
        runModel,
        lastStream,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
