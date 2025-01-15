import { CodeBlock } from '@/app/(authenticated)/chat/components/codeblock';
import type { ToolDefinition, ToolExecutionState } from '@/types';
import { Badge, Button } from '@repo/design-system/components/ui';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { cn } from '@repo/design-system/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export type AiToolBlockProps = {
  tool: ToolExecutionState;
  definition: ToolDefinition;
};

export const AiToolBlock = ({ tool, definition }: AiToolBlockProps) => {
  const Icon = definition.compactIcon;
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Flex
      className="w-full rounded-lg bg-zinc-500/10 p-3 pr-3"
      direction="col"
      gap="sm"
    >
      <Flex gap="sm" className="w-full">
        <Icon size={16} strokeWidth={2} className="mt-0.5 flex-shrink-0" />
        <Flex direction="col" gap="xs" className="w-full flex-1">
          <Type size="sm" weight="medium">
            {tool.isLoading
              ? definition.loadingMessage
              : definition.successMessage}
          </Type>
          {tool.executionArgs && <Badge>{tool.toolName}</Badge>}
        </Flex>
        <Button
          variant="ghost"
          size="iconXS"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ChevronDown
            size={16}
            strokeWidth={2}
            className={cn(
              'flex-shrink-0 transition-transform',
              isExpanded ? 'rotate-180' : ''
            )}
          />
        </Button>
      </Flex>
      {isExpanded && (
        <Flex direction="col" gap="sm" className="w-full">
          <CodeBlock code={JSON.stringify(tool.executionArgs)} lang="json" />
        </Flex>
      )}
    </Flex>
  );
};
