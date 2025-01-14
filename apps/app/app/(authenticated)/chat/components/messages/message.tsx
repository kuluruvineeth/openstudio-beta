import { ContextMessage } from '@/app/(authenticated)/chat/components/messages/context-message';
import { HumanMessage } from '@/app/(authenticated)/chat/components/messages/human-message';
import { ImageMessage } from '@/app/(authenticated)/chat/components/messages/image-message';
import type { TChatMessage } from '@/types';
import { Add01Icon, MinusSignIcon } from '@hugeicons/react';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '@repo/design-system/components/ui/accordion';
import { Flex } from '@repo/design-system/components/ui/flex';
import { type FC, forwardRef } from 'react';
import { AIMessage } from './ai/ai-message';

export type TMessage = {
  message: TChatMessage;
  isLast: boolean;
};

const CustomTrigger = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof AccordionTrigger>
>(({ children, ...props }, ref) => (
  <AccordionHeader className="flex w-full">
    <AccordionTrigger
      {...props}
      ref={ref}
      className="group flex w-full items-end justify-between"
    >
      <Flex className="w-full flex-1 items-start">{children}</Flex>
      <Flex className="h-6 w-10 shrink-0 px-2" items="center" justify="center">
        <Add01Icon
          size={20}
          className="opacity-50 transition-transform duration-200 group-data-[state=open]:hidden"
        />
        <MinusSignIcon
          size={20}
          strokeWidth={1.5}
          className="opacity-50 transition-transform duration-200 group-data-[state=closed]:hidden"
        />
      </Flex>
    </AccordionTrigger>
  </AccordionHeader>
));

CustomTrigger.displayName = 'CustomTrigger';

export const Message: FC<TMessage> = ({ message, isLast }) => {
  return (
    <Accordion
      type="single"
      className="w-full overflow-hidden"
      collapsible
      defaultValue={message.id}
    >
      <AccordionItem
        value={message.id}
        key={message.id}
        className="flex w-full flex-col items-start gap-1 border-zinc-500/10 border-b py-8"
      >
        <CustomTrigger>
          <Flex direction="col" gap="md" items="start">
            <ImageMessage image={message.runConfig?.image} />
            <ContextMessage context={message.runConfig?.context} />
            <HumanMessage chatMessage={message} />
          </Flex>
        </CustomTrigger>
        <AccordionContent className="w-full items-start overflow-hidden">
          <AIMessage message={message} isLast={isLast} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
