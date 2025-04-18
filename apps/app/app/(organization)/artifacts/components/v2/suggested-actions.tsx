'use client';

import type { ChatRequestOptions, CreateMessage, Message } from '@repo/ai';
import { Button } from '@repo/design-system/components/ui/button';
import { motion } from 'framer-motion';
import { memo } from 'react';

interface SuggestedActionsProps {
  chatId: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: 'What are the advantages',
      label: 'of building products?',
      action: 'What are the advantages of building products?',
    },
    {
      title: 'Write code to',
      label: `plot a graph of company revenue`,
      action: `Write code to plot a graph of company revenue`,
    },
    {
      title: 'Help me write an essay',
      label: `about the future of AI`,
      action: `Help me write an essay about the future of AI`,
    },
    {
      title: 'What is the weather',
      label: 'in Bengaluru?',
      action: 'What is the weather in Bengaluru?',
    },
  ];

  return (
    <div className="grid w-full gap-2 sm:grid-cols-2">
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chatv2/${chatId}`);

              append({
                role: 'user',
                content: suggestedAction.action,
              });
            }}
            className="h-auto w-full flex-1 items-start justify-start gap-1 rounded-xl border px-4 py-3.5 text-left text-sm sm:flex-col"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
