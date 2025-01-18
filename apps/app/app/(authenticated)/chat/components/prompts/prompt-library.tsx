import type { TPrompt } from '@/types';
import { GoogleGeminiIcon } from '@hugeicons/react';
import { DotsThree, Pencil, TrashSimple } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@repo/design-system/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Edit02Icon } from '@repo/design-system/components/ui/icons';

export type TPromptLibrary = {
  onPromptSelect: (prompt: TPrompt) => void;
  publicPrompts: TPrompt[];
  localPrompts: TPrompt[];
  onEdit: (prompt: TPrompt) => void;
  onDelete: (prompt: TPrompt) => void;
  onCreate: () => void;
};

export const PromptLibrary = ({
  onPromptSelect,
  localPrompts,
  publicPrompts,
  onCreate,
  onEdit,
  onDelete,
}: TPromptLibrary) => {
  return (
    <Command>
      <CommandInput placeholder="Search Prompts" className="h-12" />
      <CommandSeparator />
      <div className="relative flex h-full w-full flex-col">
        <CommandEmpty className="flex w-full flex-col items-center justify-center gap-2 p-4 text-sm text-zinc-500">
          No prompts found
          <Button variant="outlined" size="sm" onClick={onCreate}>
            Create new prompt
          </Button>
        </CommandEmpty>

        <CommandList className="px-2 pb-2">
          <CommandItem
            value={'Create prompt'}
            className="w-full"
            onSelect={onCreate}
          >
            <Edit02Icon size={16} variant="stroke" strokeWidth="2" />
            Create Prompt
          </CommandItem>
          {!!localPrompts?.length && (
            <CommandGroup heading="Local Prompts">
              {localPrompts.map((prompt) => (
                <CommandItem
                  value={prompt.name}
                  key={prompt.id}
                  className="w-full"
                  onSelect={() => onPromptSelect(prompt)}
                >
                  <GoogleGeminiIcon
                    size={20}
                    variant="stroke"
                    strokeWidth="2"
                  />
                  {prompt.name}
                  <Flex className="flex-1" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="iconSm">
                        <DotsThree size={24} weight="bold" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="min-w-[200px] text-sm md:text-base"
                      align="end"
                    >
                      <DropdownMenuItem
                        onClick={(e) => {
                          onEdit(prompt);
                          e.stopPropagation();
                        }}
                      >
                        <Pencil size={14} weight="bold" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          onDelete(prompt);
                          e.stopPropagation();
                        }}
                      >
                        <TrashSimple size={14} weight="bold" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <CommandGroup heading="Public Prompts">
            {publicPrompts.map((prompt) => (
              <CommandItem
                value={prompt.name}
                key={prompt.id}
                className="w-full"
                onSelect={() => onPromptSelect(prompt)}
              >
                <GoogleGeminiIcon size={20} variant="stroke" strokeWidth="2" />
                {prompt.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </div>
    </Command>
  );
};
