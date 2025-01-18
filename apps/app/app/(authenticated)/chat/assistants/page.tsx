'use client';

import { CreateAssistant } from '@/app/(authenticated)/chat/components/assistants/create-assistant';
import { CustomAssistantAvatar } from '@/app/(authenticated)/chat/components/custom-assistant-avatar';
import { ModelIcon } from '@/app/(authenticated)/chat/components/model-icon';
import { useSessions } from '@/context/sessions';
import { useAssistantUtils } from '@/hooks';
import type { TCustomAssistant } from '@repo/database/types';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { PopOverConfirmProvider } from '@repo/design-system/components/ui/use-confirmation-popover';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Plus, PlusIcon, TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AssistantPage = () => {
  const { push } = useRouter();
  const { setActiveSessionId } = useSessions();
  const { assistantsQuery, removeAssistantMutation } = useAssistantUtils();
  const { addAssistantToSessionMutation } = useSessions();
  const { data, error } = useQuery({
    queryKey: ['remote-assistants'],
    queryFn: () => fetch('/api/assistants').then((res) => res.json()),
  });

  useEffect(() => {
    setActiveSessionId('');
  }, []);

  const [openCreateAssistant, setOpenCreateAssistant] = useState(false);
  const remoteAssistants = data?.assistants || [];
  const localAssistants = assistantsQuery.data || [];

  const renderAssistant = (assistant: TCustomAssistant, canDelete: boolean) => {
    return (
      <div
        key={assistant.key}
        className="group relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border px-4 pt-6 pb-4 hover:bg-zinc-50"
      >
        {assistant.iconURL ? (
          <CustomAssistantAvatar
            url={assistant.iconURL}
            alt={assistant.name}
            size="lg"
          />
        ) : (
          <ModelIcon type="assistants" size="lg" />
        )}
        <Flex direction="col" items="center" className="w-full">
          <Type weight="medium">{assistant.name}</Type>
          <Type
            textColor="secondary"
            className="line-clamp-2 w-full text-center"
          >
            {assistant.description}
          </Type>
        </Flex>
        <Flex direction="col" items="center">
          <Button
            size="sm"
            variant="bordered"
            className="mt-2"
            onClick={() =>
              addAssistantToSessionMutation.mutate(
                {
                  ...assistant,
                },
                {
                  onSuccess: () => {
                    push(`/chat`);
                  },
                }
              )
            }
          >
            <Plus size={16} />
            Add to chat
          </Button>
          {canDelete && (
            <span className="absolute top-1.5 right-1.5">
              <PopOverConfirmProvider
                title="Are you sure you want to delete this assistant?"
                onConfirm={() => {
                  removeAssistantMutation.mutate(assistant.key, {
                    onSuccess: () => {},
                  });
                }}
                confimBtnText="Delete"
                confimBtnVariant="destructive"
              >
                <Button
                  size="iconXS"
                  variant="ghost"
                  className="opacity-50 group-hover:opacity-100"
                >
                  <TrashIcon size={14} />
                </Button>
              </PopOverConfirmProvider>
            </span>
          )}
        </Flex>
      </div>
    );
  };

  return (
    <>
      <Flex
        className="w-full border-zinc-500/15 border-b bg-zinc-25 px-2 py-2.5"
        items="center"
        gap="sm"
      >
        <Button
          size="iconXS"
          variant="ghost"
          onClick={() => {
            push('/chat');
          }}
        >
          <ChevronLeft size={16} />
        </Button>
        <Type size="base" weight="medium">
          {' '}
          AI Assistants
        </Type>
      </Flex>
      <Flex direction="col" className="w-full">
        <Flex
          direction="row"
          items="center"
          justify="between"
          className="w-full px-6 py-3"
        >
          <Type size="base" weight="medium">
            Your Assistants
          </Type>
          <Button
            size="sm"
            variant="bordered"
            onClick={() => {
              setOpenCreateAssistant(true);
            }}
          >
            <PlusIcon size={16} />
            Create assistant
          </Button>
        </Flex>

        <div className="grid w-full grid-cols-2 gap-3 px-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {localAssistants?.map((assistant: TCustomAssistant) =>
            renderAssistant(assistant, true)
          )}
          {localAssistants.length === 0 && (
            <div className="col-span-4 flex items-center justify-center rounded-lg bg-zinc-50/50 p-2">
              <Type textColor="tertiary">No assistants yet</Type>
            </div>
          )}
        </div>
      </Flex>

      {!!remoteAssistants?.length && (
        <Flex direction="col" className="mt-4 w-full">
          <Type size="base" weight="medium" className="px-6 py-3">
            Explore More
          </Type>

          <div className="grid w-full grid-cols-2 gap-3 px-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {remoteAssistants.map((assistant: TCustomAssistant) =>
              renderAssistant(assistant, false)
            )}
          </div>
        </Flex>
      )}
      <CreateAssistant
        open={openCreateAssistant}
        onOpenChange={setOpenCreateAssistant}
      />
    </>
  );
};

export default AssistantPage;
