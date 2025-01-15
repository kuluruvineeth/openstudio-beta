import { useAssistantUtils } from '@/hooks/use-assistant-utils';
import type { TAssistant, TModelKey } from '@/types';
import { Button } from '@repo/design-system/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import {
  ArrowDown01Icon,
  SparklesIcon,
} from '@repo/design-system/components/ui/icons';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { useState } from 'react';

export type TRegenerateModelSelect = {
  assistant: TAssistant;
  onRegenerate: (modelKey: TModelKey) => void;
};

export const RegenerateWithModelSelect = ({
  assistant,
  onRegenerate,
}: TRegenerateModelSelect) => {
  const { assistants, getAssistantByKey, getAssistantIcon } =
    useAssistantUtils();
  const [isOpen, setIsOpen] = useState(false);

  const messageAssistantProps = getAssistantByKey(assistant.key);

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip content="Regenerate">
          <DropdownMenuTrigger asChild>
            {
              <Button variant="secondary" size="sm" rounded="lg">
                <SparklesIcon size={16} variant="stroke" strokeWidth="2" />
                {messageAssistantProps?.model?.name}
                <ArrowDown01Icon size={16} variant="stroke" strokeWidth="2" />
              </Button>
            }
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent className="no-scrollbar h-[250px] min-w-[250px] overflow-y-auto">
          {assistants.map((assistant) => {
            const assistantProps = getAssistantByKey(assistant.key);
            return (
              <DropdownMenuItem
                key={assistant.key}
                onClick={() => {
                  onRegenerate(assistant.key);
                }}
              >
                {getAssistantIcon(assistant.key, 'sm')}
                {assistantProps?.assistant.name}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
