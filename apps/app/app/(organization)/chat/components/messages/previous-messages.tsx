import { Message } from '@/app/(organization)/chat/components/messages/message';
import { useChatContext } from '@/context';
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';
import type { TChatMessage } from '@/types';
import { useMemo } from 'react';

interface PreviousMessagesProps {
  assistantKey?: string;
}

export const PreviousMessages = ({ assistantKey }: PreviousMessagesProps) => {
  const { store } = useChatContext();
  const messages = store((state) => state.messages) || [];
  const isStopped = store((state) => state.currentMessage?.stop);
  const hasCurrentMessage = store((state) => !!state.currentMessage);
  const { scrollToBottom } = useScrollToBottom();

  const renderMessage = (message: TChatMessage, index: number) => {
    const isLast = !hasCurrentMessage && messages.length - 1 === index;
    return (
      <Message
        message={message}
        isLast={isLast}
        key={message.id}
        modelId={assistantKey}
      />
    );
  };

  // useEffect(() => {
  //   if (messages?.length) {
  //     scrollToBottom();
  //   }
  // }, [messages.length]);

  const previousMessages = useMemo(() => {
    return messages.map(renderMessage);
  }, [messages, isStopped]);

  return previousMessages;
};
