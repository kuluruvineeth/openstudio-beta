import { useScrollToBottom } from '@/hooks';
import { ArrowDown02Icon } from '@hugeicons/react';
import { Button } from '@repo/design-system/components/ui';
import { motion } from 'framer-motion';
import type { FC } from 'react';

export type TScrollToBottomButton = {
  show: boolean;
};

export const ScrollToBottomButton: FC<TScrollToBottomButton> = ({ show }) => {
  const { scrollToBottom, showScrollToBottom } = useScrollToBottom();
  if (!showScrollToBottom || !show) return null;
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      <Button
        onClick={scrollToBottom}
        size="iconSm"
        variant="outlined"
        rounded="full"
      >
        <ArrowDown02Icon size={16} strokeWidth="2" />
      </Button>
    </motion.span>
  );
};
