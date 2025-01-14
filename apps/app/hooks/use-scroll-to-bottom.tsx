import { useEffect, useState, useCallback } from 'react';

export const useScrollToBottom = () => {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [needsScroll, setNeedsScroll] = useState(false);

  const scrollToBottom = useCallback(() => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
      setIsAtBottom(true);
    }
  }, []);

  const handleScroll = useCallback(() => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const isAtBottom = scrollHeight - clientHeight <= scrollTop + 1;
      const hasScroll = scrollHeight > clientHeight;

      setIsAtBottom(isAtBottom);
      setNeedsScroll(hasScroll);
    }
  }, []);

  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
      handleScroll();
    }
    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  return {
    showScrollToBottom: !isAtBottom && needsScroll,
    scrollToBottom,
    isAtBottom,
  };
};
