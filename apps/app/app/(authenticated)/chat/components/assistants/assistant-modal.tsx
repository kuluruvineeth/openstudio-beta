import { CreateAssistant } from '@/app/(authenticated)/chat/components/assistants/create-assistant';
import { usePreferenceContext } from '@/context';
import { useAssistantUtils } from '@/hooks';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from '@repo/design-system/components/ui/command';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { cn } from '@repo/design-system/lib/utils';

import { AssistantBanner } from '@/app/(authenticated)/chat/components/assistants/assistant-banner';
import { AssistantHeader } from '@/app/(authenticated)/chat/components/assistants/assistant-header';
import { AssistantItem } from '@/app/(authenticated)/chat/components/assistants/assistant-item';
import { defaultPreferences } from '@/config';
import type { TAssistant } from '@/types';
import { CommandGroup } from '@repo/design-system/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from '@repo/design-system/components/ui/dialog';
import { type FC, useEffect, useRef, useState } from 'react';
import { Drawer } from 'vaul';

export type TAssitantModal = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAssistantKey: string;
  onAssistantchange: (assistantKey: string) => void;
};
export const AssistantModal: FC<TAssitantModal> = ({
  open,
  onOpenChange,
  selectedAssistantKey,
  onAssistantchange,
}) => {
  const { preferences, updatePreferences } = usePreferenceContext();

  const {
    assistants,
    createAssistantMutation,
    deleteAssistantMutation,
    updateAssistantMutation,
  } = useAssistantUtils();

  const searchRef = useRef<HTMLInputElement>(null);
  const [openCreateAssistant, setOpenCreateAssistant] = useState(false);
  const [updateAssistant, setUpdateAssistant] = useState<TAssistant>();

  const customAssistants = assistants?.filter((a) => a.type === 'custom');
  const baseAssistants = assistants?.filter((a) => a.type === 'base');

  useEffect(() => {
    if (open && searchRef?.current) {
      searchRef?.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    onAssistantchange(preferences.defaultAssistant);
  }, [preferences]);

  const renderAssistants = (assistants: TAssistant[]) => {
    return assistants?.map((assistant) => {
      return (
        <AssistantItem
          key={assistant.key}
          onDelete={(assistant) => {
            deleteAssistantMutation?.mutate(assistant.key, {
              onSuccess: () => {
                updatePreferences({
                  defaultAssistant: defaultPreferences.defaultAssistant,
                });
              },
            });
          }}
          onEdit={(assistant) => {
            setOpenCreateAssistant(true);
            setUpdateAssistant(assistant);
          }}
          assistant={assistant}
          onSelect={(assistant) => {
            onAssistantchange(assistant.key);
            onOpenChange(false);
          }}
        />
      );
    });
  };

  const renderEmptyState = () => {
    return (
      <Flex direction="col" items="center" justify="center" className="w-full">
        <Type size="sm" textColor="tertiary">
          No assistants found.
        </Type>
        <Button
          size="sm"
          variant="outlined"
          onClick={() => setOpenCreateAssistant(true)}
        >
          Create New
        </Button>
      </Flex>
    );
  };

  return (
    <Drawer.Root
      direction="bottom"
      modal={true}
      shouldScaleBackground
      open={open}
      onOpenChange={onOpenChange}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[400] bg-zinc-500/70 backdrop-blur-sm dark:bg-zinc-900/70" />
        <Drawer.Content
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className={cn(
            'fixed right-0 bottom-0 left-0 z-[500] mx-auto mt-24 flex max-h-[430px] flex-col items-center outline-none md:bottom-4 md:left-[50%]',
            `w-full md:ml-[-200px] md:w-[400px]`
          )}
        >
          <Command className="relative rounded-lg dark:border dark:border-white/10">
            <CommandInput
              placeholder="Search assistants..."
              className="h-12"
              ref={searchRef}
            />
            <CommandEmpty>{renderEmptyState()}</CommandEmpty>

            <CommandList className="border-zinc-500/20 border-t">
              <CommandGroup>
                <Flex direction="col" className="w-full p-2">
                  {!!customAssistants?.length ? (
                    <AssistantHeader
                      openCreateAssistant={openCreateAssistant}
                      setOpenCreateAssistant={setOpenCreateAssistant}
                    />
                  ) : (
                    <AssistantBanner
                      openCreateAssistant={openCreateAssistant}
                      setOpenCreateAssistant={setOpenCreateAssistant}
                    />
                  )}
                  <Dialog
                    modal={true}
                    open={openCreateAssistant}
                    onOpenChange={setOpenCreateAssistant}
                  >
                    <DialogPortal>
                      <DialogOverlay className="fixed inset-0 z-[600] bg-zinc-500/70 backdrop-blur-sm dark:bg-zinc-900/70" />
                      <DialogContent
                        ariaTitle="Create Assistant"
                        onInteractOutside={(e) => {
                          e.preventDefault();
                        }}
                        className={cn(
                          'z-[605] mx-auto flex max-h-[550px] flex-col items-center p-0 outline-none',
                          `w-full md:w-[540px]`
                        )}
                      >
                        <CreateAssistant
                          assistant={updateAssistant}
                          onUpdateAssistant={(assistant) => {
                            updateAssistantMutation.mutate(
                              {
                                assistantKey: assistant.key,
                                newAssistant: assistant,
                              },
                              {
                                onSettled: () => {
                                  setOpenCreateAssistant(false);
                                  setUpdateAssistant(undefined);
                                },
                              }
                            );
                          }}
                          onCreateAssistant={(assistant) => {
                            createAssistantMutation.mutate(assistant, {
                              onSettled: () => {
                                setOpenCreateAssistant(false);
                              },
                              onError: (error) => {
                                // Log this error
                              },
                            });
                          }}
                          onCancel={() => {
                            setOpenCreateAssistant(false);
                            setUpdateAssistant(undefined);
                          }}
                        />
                      </DialogContent>
                    </DialogPortal>
                  </Dialog>

                  {renderAssistants(customAssistants)}
                </Flex>
              </CommandGroup>
              <CommandGroup>
                <Flex direction="col" className="w-full p-2">
                  <Type weight="medium" size="base" className="px-3 py-2">
                    Models
                  </Type>
                  {renderAssistants(baseAssistants)}
                </Flex>
              </CommandGroup>
            </CommandList>
          </Command>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
