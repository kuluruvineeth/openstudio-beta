import { useTools } from '@/hooks';
import { mono } from '@/lib/fonts';
import type { ToolExecutionState } from '@/types/tools';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';

type AIToolMessageProps = {
  tool: ToolExecutionState;
};
export const AIToolMessage = ({ tool }: AIToolMessageProps) => {
  const { getToolByKey } = useTools();
  const toolUsed = tool.toolName ? getToolByKey(tool.toolName) : undefined;
  if (!toolUsed) {
    return null;
  }
  const Icon = toolUsed.compactIcon;
  return (
    <Flex direction="col" items="start" gap="sm" className="mb-4 w-full">
      <Flex className="w-full rounded-lg bg-zinc-50 p-2.5 pr-3" gap="sm">
        <Icon size={16} strokeWidth={2} className="mt-0.5 flex-shrink-0" />
        <Flex direction="col" gap="xs">
          <Type size="sm" weight="medium">
            {tool.isLoading ? toolUsed.loadingMessage : toolUsed.successMessage}
          </Type>
          {tool.executionArgs && (
            <Type
              className="line-clamp-1"
              style={mono.style}
              size="xs"
              textColor="secondary"
            >
              {JSON.stringify(tool.executionArgs) || 'No arguments'}
            </Type>
          )}
        </Flex>
      </Flex>
      {/* {toolUsed.successMessage && (
        <ToolBadge
          icon={Icon}
          isLoading={tool.isLoading}
          loadingPlaceholder={toolUsed.loadingMessage}
          text={toolUsed.successMessage}
        />
      )} */}
      {tool.renderData && toolUsed.renderComponent?.(tool.renderData)}
    </Flex>
  );
};
