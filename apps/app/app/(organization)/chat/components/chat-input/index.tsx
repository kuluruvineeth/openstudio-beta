import { ChangeLogs } from '@/app/(organization)/chat/components/changelogs';
import { ApiKeyStatus } from '@/app/(organization)/chat/components/chat-input/api-key-status';
import { ChatActions } from '@/app/(organization)/chat/components/chat-input/chat-actions';
import { ChatEditor } from '@/app/(organization)/chat/components/chat-input/chat-editor';
import { ChatFooter } from '@/app/(organization)/chat/components/chat-input/chat-footer';
import { ImageAttachment } from '@/app/(organization)/chat/components/chat-input/image-attachment';
import { ImageDropzoneRoot } from '@/app/(organization)/chat/components/chat-input/image-dropzone-root';
import { ScrollToBottomButton } from '@/app/(organization)/chat/components/chat-input/scroll-to-bottom-button';
import { SelectedContext } from '@/app/(organization)/chat/components/chat-input/selected-context';
import { StarterMessages } from '@/app/(organization)/chat/components/chat-input/starter-messages';
import { CustomAssistantAvatar } from '@/app/(organization)/chat/components/custom-assistant-avatar';
import { examplePrompts } from '@/config';
import { useChatContext, usePreferenceContext, useSessions } from '@/context';
import { slideUpVariant } from '@/helper/animations';
import { useAssistantUtils, useImageAttachment } from '@/hooks';
import { useChatEditor } from '@/hooks/use-editor';
import { useLLMRunner } from '@/hooks/use-llm-runner';
import { TChatMessage } from '@/types';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { FullPageLoader } from '@repo/design-system/components/ui/full-page-loader';
import { Type } from '@repo/design-system/components/ui/text';
import { cn } from '@repo/design-system/lib/utils';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { generateShortUUID } from '@/helper/utils';

export const ChatInput = () => {
  const { store, isReady, refetch } = useChatContext();
  const { removeAssistantFromSessionMutation } = useSessions();
  const [openChangelog, setOpenChangelog] = useState(false);
  const { preferences, isPreferencesReady } = usePreferenceContext();
  const { getAssistantByKey, getAssistantIcon } = useAssistantUtils();
  const { invokeModel } = useLLMRunner();
  const { editor } = useChatEditor();
  const currentMessage = store((state) => state.currentMessage);
  const setCurrentMessage = store((state) => state.setCurrentMessage);
  const session = store((state) => state.session);
  const isInitialized = store((state) => state.isInitialized);
  const setIsInitialized = store((state) => state.setIsInitialized);
  const context = store((state) => state.context);
  const { attachment, clearAttachment, handleImageUpload, dropzonProps } =
    useImageAttachment();

  const isFreshSession = !isInitialized;

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (session?.id) {
      inputRef.current?.focus();
    }
  }, [session?.id]);

  const sendMessage = (input: string) => {
    if (!isReady) return;
    const props = getAssistantByKey(preferences.defaultAssistant);
    if (!props || !session) return;
    setIsInitialized(true);
    editor?.commands.clearContent();
    invokeModel({
      input,
      context,
      image: attachment?.base64,
      sessionId: session.id,
      assistant: props.assistant,
    });
    clearAttachment();
  };

//   const sendMessage = async (input: string) => {
//   if (!isReady || !session) return;
  
//   const assistantKeys = preferences.defaultAssistants || [preferences.defaultAssistant];
//   const assistants = assistantKeys
//     .map(key => getAssistantByKey(key))
//     .filter(props => props?.assistant);

//   if (!assistants.length) return;
  
//   setIsInitialized(true);
//   editor?.commands.clearContent();

//   // Create single message with initial state for all assistants
//   const messageId = generateShortUUID();
//   const message = {
//     id: messageId,
//     parentId: session.id,
//     sessionId: session.id,
//     rawHuman: input,
//     rawAI: null,
//     tools: [],
//     stop: false,
//     stopReason: null,
//     relatedQuestions: [],
//     runConfig: {
//     context,
//     input,
//     image: attachment?.base64,
//     sessionId: session.id,
//     messageId,
//     assistant: assistants[0]?.assistant // Primary assistant
//   },
//     runConfigs: assistants.map(props => ({
//       context,
//       input,
//       image: attachment?.base64,
//       sessionId: session.id,
//       messageId,
//       assistant: props!.assistant
//     })),
//     aiResponses: assistants.map(props => ({
//       assistant: props!.assistant,
//       rawAI: '',
//       tools: [],
//       relatedQuestions: [],
//       stopReason: null,
//       errorMessage: null,
//       isLoading: true,
//       createdAt: new Date()
//     })),
//     image: attachment?.base64 || null,
//     createdAt: new Date(),
//     isLoading: true,
//     errorMessage: null
//   };

//   setCurrentMessage(message as TChatMessage);
//     // Add a small delay to let state update
//   await new Promise(resolve => setTimeout(resolve, 0));
//   console.log("Store state after set:", store.getState().currentMessage); 
//   // Start all streams
//   assistants.forEach(props => 
//     invokeModel({
//       messageId,
//       input,
//       context,
//       image: attachment?.base64,
//       sessionId: session.id,
//       assistant: props!.assistant
//     })
//   );

//   clearAttachment();
// };




  const chatInputBackgroundContainer = cn(
    'absolute right-0 bottom-0 left-0 flex w-full flex-col items-center justify-end gap-2 px-4 pb-1 md:px-4',
    'transition-all duration-1000 ease-in-out',
    isFreshSession && 'top-0 justify-center '
  );

  const chatContainer = cn(
    'z-10 flex w-full flex-1 flex-col items-center gap-1 md:w-[640px] lg:w-[700px]'
  );

  const renderChatBottom = () => {
    return (
      <>
        {isFreshSession && (
          <StarterMessages
            messages={
              session?.customAssistant?.startMessage?.map((m) => ({
                name: m,
                content: m,
              })) || examplePrompts
            }
          />
        )}
        <Flex items="center" justify="center" gap="sm" className="mb-2">
          <ScrollToBottomButton />
        </Flex>
        <SelectedContext />
        <Flex
          direction="col"
          className="w-full rounded-lg border border-zinc-500/15 bg-white shadow-sm dark:bg-zinc-700"
        >
          <motion.div
            variants={slideUpVariant}
            initial="initial"
            animate={editor?.isEditable ? 'animate' : 'initial'}
            className="flex w-full flex-shrink-0 overflow-hidden rounded-xl"
          >
            <ImageDropzoneRoot dropzoneProps={dropzonProps}>
              <Flex direction="col" className="w-full">
                <ImageAttachment
                  attachment={attachment}
                  clearAttachment={clearAttachment}
                />
                <Flex className="flex w-full flex-row items-end gap-0 py-2 pr-2 pl-2 md:pl-3">
                  <ChatEditor sendMessage={sendMessage} editor={editor} />
                </Flex>
                <ChatActions
                  sendMessage={sendMessage}
                  handleImageUpload={handleImageUpload}
                />
              </Flex>
            </ImageDropzoneRoot>
          </motion.div>
        </Flex>
        {<ChatFooter />}
      </>
    );
  };

  if (!isReady || !isPreferencesReady)
    return (
      <div className={chatInputBackgroundContainer}>
        <FullPageLoader label="Initializing chat" />
      </div>
    );

  return (
    <div className={chatInputBackgroundContainer}>
      <div
        className={cn(
          'absolute right-0 bottom-0 left-0 h-[120px] bg-gradient-to-t from-40% from-zinc-25 to-transparent dark:bg-zinc-800/50 dark:from-zinc-800',
          isFreshSession &&
            'top-0 flex h-full flex-col items-center justify-center'
        )}
      />

      <div className={chatContainer}>
        {isFreshSession && (
          <Flex
            items="center"
            justify="center"
            direction="col"
            gap="md"
            className="mb-2 flex-1"
          >
            <Badge
              onClick={() => setOpenChangelog(true)}
              className="cursor-pointer gap-1"
              variant="tertiary"
            >
              <Flame size={14} /> What&apos;s new
            </Badge>

            <ChangeLogs open={openChangelog} setOpen={setOpenChangelog} />

            {session?.customAssistant ? (
              <CustomAssistantAvatar
                url={session?.customAssistant?.iconURL}
                alt={session?.customAssistant?.name}
                size="lg"
              />
            ) : (
              getAssistantIcon(preferences.defaultAssistant, 'lg', true)
            )}
            <Flex direction="col" gap="xs" justify="center" items="center">
              <Type
                size="lg"
                textColor={session?.customAssistant ? 'primary' : 'secondary'}
              >
                {session?.customAssistant
                  ? session?.customAssistant?.name
                  : 'How can I help you?'}
              </Type>
              {session?.customAssistant && (
                <Type size="sm" textColor="secondary">
                  {session?.customAssistant?.description}
                </Type>
              )}
              {session?.customAssistant && (
                <Type
                  size="sm"
                  textColor="secondary"
                  className="max-w-[400px] text-center"
                >
                  {session?.customAssistant?.description}
                </Type>
              )}
              {session?.customAssistant && (
                <Button
                  variant="bordered"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    removeAssistantFromSessionMutation.mutate(session?.id, {
                      onSuccess: () => {
                        refetch();
                      },
                    });
                  }}
                >
                  Remove
                </Button>
              )}
            </Flex>
            <ApiKeyStatus />
          </Flex>
        )}
        {renderChatBottom()}
      </div>
    </div>
  );
};
