import { useFilters } from '@/app/context/filters/context';
import type { TModelKey } from '@/app/hooks/use-model-list';
import { useRecordVoice } from '@/app/hooks/use-record-voice';
import useScrollToBottom from '@/app/hooks/use-scroll-to-bottom';
import { useTextSelection } from '@/app/hooks/use-text-selection';
import { slideUpVariant } from '@/app/lib/framer-motion';
import { cn } from '@repo/design-system/lib/utils';
import {
  ArrowDown,
  ArrowElbowDownRight,
  ArrowUp,
  Command,
  Stop,
  X,
} from '@phosphor-icons/react';
import { ModelSelect } from '@/app/(authenticated)/chat/components/model-select';
import { PluginSelect } from '@/app/(authenticated)/chat/components/plugin-select';
import { PromptsBotsCombo } from '@/app/(authenticated)/chat/components/prompts-bots-combo';
import { QuickSettings } from '@/app/(authenticated)/chat/components/quick-settings';
import { useChatContext } from '@/app/context/chat/provider';
import { usePreferenceContext } from '@/app/context/preferences/provider';
import { useSessionsContext } from '@/app/context/sessions/provider';
import { useModelList } from '@/app/hooks/use-model-list';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { EditorContent } from '@tiptap/react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export type TAttachment = {
  file?: File;
  base64?: string;
};

export const ChatInput = () => {
  const { sessionId } = useParams();
  const { open: openFilters } = useFilters();
  const { showButton, scrollToBottom } = useScrollToBottom();
  const {
    renderListeningIndicator,
    renderRecordingControls,
    recording,
    text,
    transcribing,
  } = useRecordVoice();
  const { currentSession } = useSessionsContext();
  const {
    editor,
    handleRunModel,
    openPromptsBotCombo,
    setOpenPromptsBotCombo,
    sendMessage,
    isGenerating,
    stopGeneration,
  } = useChatContext();
  const [contextValue, setContextValue] = useState<string>("");

  const { preferences } = usePreferenceContext();
  const { models } = useModelList();

  const { showPopup, selectedText, handleClearSelection } = useTextSelection();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [selectedModel, setSelectedModel] = useState<TModelKey>(
    preferences.defaultModel
  );

  useEffect(() => {
    setSelectedModel(preferences.defaultModel);
  }, [models, preferences]);

  console.log("selectedModelinput", preferences.defaultModel);

  useEffect(() => {
    if (editor?.isActive) {
      editor.commands.focus("end");
    }
  }, [editor?.isActive]);

  // useEffect(() => {
  //   if (currentSession?.bot?.deafultBaseModel) {
  //     setSelectedModel(currentSession.bot.deafultBaseModel);
  //   }
  // }, [currentSession]);

  useEffect(() => {
    if (sessionId) {
      inputRef.current?.focus();
    }
  }, [sessionId]);

  const isFreshSession =
    !currentSession?.messages?.length && !currentSession?.bot;

  useEffect(() => {
    if (text) {
      editor?.commands.clearContent();
      editor?.commands.setContent(text);
      handleRunModel({
        input: text,
        sessionId: sessionId!.toString(),
      });

      editor?.commands.clearContent();
    }
  }, [text]);

  const renderScrollToBottom = () => {
    if (showButton && !showPopup && !recording && !transcribing) {
      return (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <Button
            onClick={scrollToBottom}
            size="iconSm"
            variant="outline"
            rounded="full"
          >
            <ArrowDown size={16} weight="bold" />
          </Button>
        </motion.span>
      );
    }
  };

  const renderStopGeneration = () => {
    if (isGenerating) {
      return (
        <motion.span
          className="mb-2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <Button
            rounded="full"
            className="dark:bg-zinc-800 dark:border dark:text-white dark:border-white/10"
            onClick={() => {
              stopGeneration();
            }}
          >
            <Stop size={16} weight="fill" />
            Stop generation
          </Button>
        </motion.span>
      );
    }
  };

  // const renderReplyButton = () => {
  //   if (showPopup && !recording && !transcribing) {
  //     return (
  //       <motion.span
  //         initial={{ scale: 0, opacity: 0 }}
  //         animate={{ scale: 1, opacity: 1 }}
  //         exit={{ scale: 0, opacity: 0 }}
  //       >
  //         <Button
  //           onClick={() => {
  //             setContextValue(selectedText);
  //             handleClearSelection();
  //             inputRef.current?.focus();
  //           }}
  //           variant="secondary"
  //           size="sm"
  //         >
  //           <Quotes size={20} weight="bold" /> Reply
  //         </Button>
  //       </motion.span>
  //     );
  //   }
  // };

  const renderSelectedContext = () => {
    if (contextValue) {
      return (
        <div className="flex flex-row items-center bg-black/30 text-zinc-300 rounded-xl h-10 w-[700px] justify-start gap-2 pl-3 pr-1">
          <ArrowElbowDownRight size={16} weight="fill" />
          <p className="w-full overflow-hidden truncate ml-2 text-sm md:text-base ">
            {contextValue}
          </p>
          <Button
            size={"iconSm"}
            variant="ghost"
            onClick={() => {
              setContextValue("");
            }}
            className="flex-shrink-0 ml-4"
          >
            <X size={16} weight="bold" />
          </Button>
        </div>
      );
    }
  };

  return (
    <div
      className={cn(
        "w-full flex flex-col items-center justify-end md:justify-center absolute bottom-0 px-2 md:px-4 pb-4 pt-16  right-0 gap-1",
        "bg-gradient-to-t transition-all ease-in-out duration-1000 from-white dark:from-zinc-800 to-transparent from-70% left-0"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        {renderScrollToBottom()}
        {/* {renderReplyButton()} */}
        {renderStopGeneration()}
        {renderListeningIndicator()}
      </div>
      <div className="flex flex-col gap-1 w-full md:w-[700px] lg:w-[720px]">
        {renderSelectedContext()}
        {editor && (
          <PromptsBotsCombo
            open={openPromptsBotCombo}
            onBack={() => {
              editor?.commands.clearContent();
              editor?.commands.focus("end");
            }}
            onPromptSelect={(prompt) => {
              editor?.commands.setContent(prompt.content);
              editor?.commands.insertContent("");
              editor?.commands.focus("end");
              setOpenPromptsBotCombo(false);
            }}
            onOpenChange={setOpenPromptsBotCombo}
            onBotSelect={(bot) => {
              editor?.commands?.clearContent();
              editor?.commands.focus("end");
            }}
          >
            <motion.div
              variants={slideUpVariant}
              initial={"initial"}
              animate={editor.isEditable ? "animate" : "initial"}
              className="flex flex-col items-start gap-0 bg-zinc-50 dark:bg-white/5 w-full dark:border-white/5 rounded-2xl overflow-hidden"
            >
              <div className="flex flex-row items-end pl-2 md:pl-3 pr-2 py-2 w-full gap-0">
                <EditorContent
                  editor={editor}
                  autoFocus
                  onKeyDown={(e) => {
                    console.log("keydown", e.key);
                    if (e.key === "Enter" && !e.shiftKey) {
                      sendMessage();
                    }
                  }}
                  className="w-full min-h-8 text-sm md:text-base max-h-[120px] overflow-y-auto outline-none focus:outline-none p-1 [&>*]:outline-none no-scrollbar [&>*]:no-scrollbar [&>*]:leading-6 wysiwyg cursor-text"
                />

                {!isGenerating && renderRecordingControls()}
              </div>
              <div className="flex flex-row items-center w-full justify-start gap-0 pt-1 pb-2 px-2">
                <ModelSelect
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                />
                <PluginSelect selectedModel={selectedModel} />
                <QuickSettings />
                <div className="flex-1"></div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openFilters}
                  className="px-1.5"
                >
                  <Badge className="flex">
                    <Command size={16} weight="bold" /> K
                  </Badge>
                </Button>
                {!isGenerating && (
                  <Button
                    size="iconSm"
                    rounded="full"
                    variant={!!editor?.getText() ? "default" : "secondary"}
                    disabled={!editor?.getText()}
                    className={cn(
                      !!editor?.getText() &&
                        "bg-zinc-800 dark:bg-emerald-500/20 text-white dark:text-emerald-400"
                    )}
                    onClick={() => {
                      sendMessage();
                    }}
                  >
                    <ArrowUp size={18} weight="bold" />
                  </Button>
                )}
              </div>
            </motion.div>
          </PromptsBotsCombo>
        )}
      </div>
    </div>
  );
};
