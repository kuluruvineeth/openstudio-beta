'use client';

import { Button } from '@repo/design-system/components/ui/button';
import type { ButtonProps } from '@repo/design-system/components/ui/button';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { SparklesIcon } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

export function CategorizeWithAiButton({
  buttonProps,
  content,
}: {
  buttonProps?: ButtonProps;
  content?: string;
}) {
  const [isCategorizing, setIsCategorizing] = useState(false);

  //   const { setIsBulkCategorizing } = useCategorizeProgress();

  return (
    <>
      <CategorizeWithAiButtonTooltip content={content}>
        <Button
          type="button"
          loading={isCategorizing}
          disabled={isCategorizing}
          onClick={() => {}}
          {...buttonProps}
        >
          {buttonProps?.children || (
            <>
              <SparklesIcon className="mr-2 size-4" />
              Categorize Senders with AI
            </>
          )}
        </Button>
      </CategorizeWithAiButtonTooltip>
    </>
  );
}

function CategorizeWithAiButtonTooltip({
  children,
  content,
}: {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  children: React.ReactElement<any>;
  content?: string;
}) {
  return <Tooltip content={content}>{children}</Tooltip>;
}
