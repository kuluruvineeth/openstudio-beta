import { ToolBadge } from '@/app/(organization)/chat/components/tools/tool-badge';
import { useChatContext, usePreferenceContext } from '@/context';
import { slideUpVariant } from '@/helper/animations';
import { useAssistantUtils } from '@/hooks';
import { useLLMRunner } from '@/hooks/use-llm-runner';
import type { TChatMessage } from '@/types';
import {
  ArrowRight02Icon,
  RepeatIcon,
} from '@hugeicons-pro/core-stroke-rounded';
import { HugeiconsIcon } from '@hugeicons/react';
import { Flex } from '@repo/design-system/components/ui/flex';
import { StaggerContainer } from '@repo/design-system/components/ui/stagger-container';
import { Type } from '@repo/design-system/components/ui/text';
import { motion } from 'framer-motion';
import type { FC } from 'react';

export type TAIRelatedQuestions = {
  message: TChatMessage;
  modelId?: string;
  show: boolean;
};

export const AIRelatedQuestions: FC<TAIRelatedQuestions> = ({
  message,
  show,
  modelId,
}) => {
  const { store } = useChatContext();
  const isGenerating = store((state) => state.isGenerating);
  const { preferences } = usePreferenceContext();
  const { getAssistantByKey } = useAssistantUtils();
  const { invokeModel } = useLLMRunner();

  const handleOnClick = (question: string) => {
    const assistant = preferences.defaultAssistant;

    const props = getAssistantByKey(assistant);
    if (!props?.assistant) {
      return;
    }
    message.sessionId &&
      invokeModel({
        input: question,
        sessionId: message.sessionId,
        assistant: props.assistant,
      });
  };

  if (
    !Array.isArray(message?.relatedQuestions) ||
    !message?.relatedQuestions?.length ||
    !show ||
    isGenerating
  ) {
    return null;
  }

  return (
    <StaggerContainer>
      <Flex
        direction="col"
        gap="sm"
        className="mt-4 w-full border-zinc-500/10 border-t pt-8"
      >
        <ToolBadge icon={RepeatIcon} text={'Related'} />
        {message?.relatedQuestions?.map((question) => {
          return (
            <motion.div key={question} variants={slideUpVariant}>
              <Type
                className="cursor-pointer items-center gap-2 py-0.5 decoration-zinc-500 underline-offset-4 opacity-70 hover:underline hover:opacity-100"
                size="sm"
                onClick={() => handleOnClick(question)}
                weight="medium"
              >
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  size={18}
                  strokeWidth={2}
                  className="flex-shrink-0"
                />
                {question}
              </Type>
            </motion.div>
          );
        })}
      </Flex>
    </StaggerContainer>
  );
};
