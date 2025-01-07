import { useSessions } from '@/context';
import { useModelList } from '@/hooks/use-model-list';
import type { TChatSession } from '@/types';
import { Delete01Icon, Edit02Icon } from '@hugeicons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Input } from '@repo/design-system/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/design-system/components/ui/popover';
import { Type } from '@repo/design-system/components/ui/text';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { cn } from '@repo/design-system/lib/utils';
import moment from 'moment';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export const HistoryItem = ({
  session,
  dismiss,
}: {
  session: TChatSession;
  dismiss: () => void;
}) => {
  const { sessionId } = useParams();
  const { updateSessionMutation, removeSessionMutation, createSession } =
    useSessions();
  const { getModelByKey, getAssistantByKey } = useModelList();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(session.title);
  const router = useRouter();
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const historyInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      historyInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleDelete = () => {
    removeSessionMutation.mutate(session.id, {
      onSuccess: () => {
        createSession({
          redirect: true,
        });
      },
    });
  };

  return (
    <div
      key={session.id}
      className={cn(
        'group flex w-full cursor-pointer flex-row items-start gap-2 rounded-xl py-2 pr-2 pl-3 hover:bg-black/10 hover:dark:bg-black/30',
        sessionId?.toString() === session.id || isEditing
          ? 'bg-black/10 dark:bg-black/30'
          : ''
      )}
      onClick={() => {
        if (!isEditing) {
          router.push(`/chat/${session.id}`);
          dismiss();
        }
      }}
    >
      {isEditing ? (
        <Input
          variant="ghost"
          className="h-6 text-sm"
          ref={historyInputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setIsEditing(false);
              updateSessionMutation.mutate({
                sessionId: session.id,
                session: {
                  title: title?.trim() || session?.title || 'Untitled',
                },
              });
            }
          }}
          onBlur={() => {
            setIsEditing(false);
            updateSessionMutation.mutate({
              sessionId: session.id,
              session: { title: title?.trim() || session?.title || 'Untitled' },
            });
          }}
        />
      ) : (
        <>
          <Flex direction="col" items="start" className="w-full" gap="none">
            <Type
              className="line-clamp-1"
              size="sm"
              textColor="primary"
              weight="medium"
            >
              {session.title}
            </Type>
            <Type className="line-clamp-1" size="xs" textColor="tertiary">
              {moment(session.updatedAt).fromNow()}
            </Type>
          </Flex>
        </>
      )}
      {(!isEditing || openDeleteConfirm) && (
        <Flex
          className={cn('hidden group-hover:flex', openDeleteConfirm && 'flex')}
        >
          <Button
            variant="ghost"
            size="iconXS"
            onClick={(e) => {
              setIsEditing(true);
              e.stopPropagation();
            }}
          >
            <Edit02Icon size={14} variant="stroke" strokeWidth="2" />
          </Button>
          <Tooltip content="Delete">
            <Popover
              open={openDeleteConfirm}
              onOpenChange={setOpenDeleteConfirm}
            >
              <PopoverTrigger asChild>
                <Button
                  variant={openDeleteConfirm ? 'secondary' : 'ghost'}
                  size="iconXS"
                  onClick={(e) => {
                    setOpenDeleteConfirm(true);
                    e.stopPropagation();
                  }}
                >
                  <Delete01Icon size={14} variant="stroke" strokeWidth="2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="z-[1000]" side="bottom">
                <p className="pb-2 font-medium text-sm md:text-base">
                  Are you sure you want to delete this message?
                </p>
                <div className="flex flex-row gap-1">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      removeSessionMutation.mutate(session.id, {
                        onSuccess: () => {
                          createSession({
                            redirect: true,
                          });
                        },
                      });
                      e.stopPropagation();
                    }}
                  >
                    Delete Message
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      setOpenDeleteConfirm(false);
                      e.stopPropagation();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </Tooltip>
        </Flex>
      )}
    </div>
  );
};
