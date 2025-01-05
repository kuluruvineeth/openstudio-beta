import { BotAvatar } from '@/app/(authenticated)/chat/components/bot-avatar';
import { RegenerateWithModelSelect } from '@/app/(authenticated)/chat/components/regenerate-model-select';
import { useChatContext } from '@/app/context/chat/provider';
import { useSessionsContext } from '@/app/context/sessions/provider';
import { useSettings } from '@/app/context/settings/context';
import type { TChatMessage } from '@/app/hooks/use-chat-session';
import { useClipboard } from '@/app/hooks/use-clipboard';
import { useMarkdown } from '@/app/hooks/use-mdx';
import { type TModelKey, useModelList } from '@/app/hooks/use-model-list';
import { useTextSelection } from '@/app/hooks/use-text-selection';
import { useTools } from '@/app/hooks/use-tools';
import type { TToolKey } from '@/app/hooks/use-tools';
import { Check, Copy, Quotes, TrashSimple } from '@phosphor-icons/react';
import {
  Alert,
  AlertDescription,
} from '@repo/design-system/components/ui/alert';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import Spinner from '@repo/design-system/components/ui/loading-spinner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/design-system/components/ui/popover';
import { Type } from '@repo/design-system/components/ui/text';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { useRef, useState } from 'react';
import * as Selection from 'selection-popover';

export type TAIMessageBubble = {
  chatMessage: TChatMessage;
  isLast: boolean;
};

export const AIMessageBubble = ({ chatMessage, isLast }: TAIMessageBubble) => {
  const {
    id,
    rawAI,
    isLoading,
    model,
    stop,
    stopReason,
    isToolRunning,
    toolName,
  } = chatMessage;

  const { getToolInfoByKey } = useTools();

  const toolUsed = toolName
    ? getToolInfoByKey(toolName as TToolKey)
    : undefined;
  const messageRef = useRef<HTMLDivElement>(null);
  const { showCopied, copy } = useClipboard();
  const { getModelByKey } = useModelList();
  const { renderMarkdown, links } = useMarkdown();
  const { open: openSettings } = useSettings();

  const { handleRunModel, setContextValue, editor } = useChatContext();
  const { currentSession, removeMessage } = useSessionsContext();
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const { selectedText } = useTextSelection();

  const modelForMessage = getModelByKey(model);

  const handleCopyContent = () => {
    messageRef?.current && rawAI && copy(rawAI);
  };

  const renderStopReason = () => {
    if (stopReason === 'error') {
      return (
        <Alert variant="destructive">
          <AlertDescription>
            Something went wrong. please make sure your api is working properly{' '}
            <Button
              variant="link"
              size="link"
              onClick={() => {
                openSettings();
              }}
            >
              Check API Key
            </Button>
          </AlertDescription>
        </Alert>
      );
    }
    if (stopReason === 'cancel') {
      return (
        <Type size="sm" textColor="tertiary" className="italic">
          Chat session ended
        </Type>
      );
    }
    if (stopReason === 'apikey') {
      return (
        <Alert variant="destructive">
          <AlertDescription>
            Invalid API Key{' '}
            <Button
              variant="link"
              size="link"
              onClick={() => {
                openSettings();
              }}
            >
              Check API Key
            </Button>
          </AlertDescription>
        </Alert>
      );
    }
    if (stopReason === 'recursion') {
      return (
        <Alert variant="destructive">
          {' '}
          <AlertDescription>Recursion detected</AlertDescription>
        </Alert>
      );
    }
  };

  return (
    <div className="mt-6 flex w-full flex-row">
      <div className="p-2 md:px-3 md:py-2">
        {currentSession?.bot ? (
          <BotAvatar
            size="small"
            name={currentSession?.bot?.name}
            avatar={currentSession?.bot?.avatar}
          />
        ) : (
          modelForMessage?.icon('sm')
        )}
      </div>
      <Flex
        ref={messageRef}
        direction="col"
        gap="md"
        items="start"
        className="w-full flex-1 overflow-hidden p-2"
      >
        {toolUsed && (
          <Type
            size="xs"
            className="flex flex-row items-center gap-2"
            textColor="tertiary"
          >
            {toolUsed.smallIcon()}
            {isToolRunning ? (
              <span>{toolUsed.loadingMessage}</span>
            ) : (
              <span>{toolUsed.resultMessage}</span>
            )}
          </Type>
        )}

        {rawAI && (
          <Selection.Root>
            <Selection.Trigger asChild>
              <article className="prose dark:prose-invert prose-zinc w-full prose-h3:font-medium prose-heading:font-medium prose-strong:font-medium prose-h3:text-lg prose-headings:text-lg">
                {renderMarkdown(rawAI, !!isLoading, id)}
              </article>
            </Selection.Trigger>
            <Selection.Portal
              container={document?.getElementById('chat-container')}
            >
              <Selection.Content sticky="always" sideOffset={10}>
                {selectedText && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setContextValue(selectedText);
                      editor?.commands.clearContent();
                      editor?.commands.focus('end');
                    }}
                  >
                    <Quotes size="16" weight="bold" /> Reply
                  </Button>
                )}
              </Selection.Content>
            </Selection.Portal>
          </Selection.Root>
        )}
        {stop && stopReason && renderStopReason()}

        <Flex
          justify="between"
          items="center"
          className="w-full pt-3 opacity-70 transition-opacity hover:opacity-100"
        >
          {isLoading && !isToolRunning && <Spinner />}
          {!isLoading && !isToolRunning && (
            <div className="flex flex-row gap-1">
              <Tooltip content="Copy">
                <Button
                  variant="ghost"
                  size="iconSm"
                  rounded="lg"
                  onClick={handleCopyContent}
                >
                  {showCopied ? (
                    <Check size={16} weight="bold" />
                  ) : (
                    <Copy size={16} weight="bold" />
                  )}
                </Button>
              </Tooltip>
              {chatMessage && isLast && (
                <RegenerateWithModelSelect
                  onRegenerate={(model: TModelKey) => {
                    handleRunModel({
                      input: chatMessage.rawHuman,
                      messageId: chatMessage.id,
                      model: model,
                      sessionId: chatMessage.sessionId,
                    });
                  }}
                />
              )}
              <Tooltip content="Delete">
                <Popover
                  open={openDeleteConfirm}
                  onOpenChange={setOpenDeleteConfirm}
                >
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="iconSm" rounded="lg">
                      <TrashSimple size={16} weight="bold" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <p className="pb-2 font-medium text-sm md:text-base">
                      Are you sure you want to delete this message?
                    </p>
                    <div className="flex flex-row gap-1">
                      <Button
                        variant="destructive"
                        onClick={() => {
                          removeMessage(id);
                        }}
                      >
                        Delete Message
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setOpenDeleteConfirm(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </Tooltip>
            </div>
          )}
          {!isLoading && !isToolRunning && (
            <div className="flex flex-row items-center gap-2 text-xs text-zinc-500">
              {modelForMessage?.name}
            </div>
          )}
        </Flex>
      </Flex>
    </div>
  );
};
