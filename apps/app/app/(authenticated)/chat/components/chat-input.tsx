import { AudioWaveSpinner } from '@/app/(authenticated)/chat/components/audio-wave';
import { ModelSelect } from '@/app/(authenticated)/chat/components/model-select';
import { PluginSelect } from '@/app/(authenticated)/chat/components/plugin-select';
import { QuickSettings } from '@/app/(authenticated)/chat/components/quick-settings';
import { useChatContext } from '@/app/context/chat/context';
import { useFilters } from '@/app/context/filters/context';
import { usePrompts } from '@/app/context/prompts/context';
import { useSettings } from '@/app/context/settings/context';
import { type TModelKey, useModelList } from '@/app/hooks/use-model-list';
import { usePreferences } from '@/app/hooks/use-preferences';
import { useRecordVoice } from '@/app/hooks/use-record-voice';
import useScrollToBottom from '@/app/hooks/use-scroll-to-bottom';
import { useTextSelection } from '@/app/hooks/use-text-selection';
import { slideUpVariant } from '@/app/lib/framer-motion';
import { removeExtraSpaces } from '@/app/lib/helper';
import { PromptType, RoleType, prompts } from '@/app/lib/prompts';
import {
  ArrowElbowDownRight,
  ArrowUp,
  ClockClockwise,
  Command,
  Microphone,
  Paperclip,
  Plus,
  Quotes,
  Stop,
  StopCircle,
  X,
} from '@phosphor-icons/react';
import { ArrowDown } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Command as CMDKCommand,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/design-system/components/ui/command';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@repo/design-system/components/ui/popover';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { useToast } from '@repo/design-system/components/ui/use-toast';
import { cn } from '@repo/design-system/lib/utils';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Highlight from '@tiptap/extension-highlight';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Text from '@tiptap/extension-text';
import { EditorContent, Extension, useEditor } from '@tiptap/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import Resizer from 'react-image-file-resizer';

export type TAttachment = {
  file?: File;
  base64?: string;
};

export const ChatInput = () => {
  const { sessionId } = useParams();
  const { open: openFilters } = useFilters();
  const { showButton, scrollToBottom } = useScrollToBottom();
  const { toast } = useToast();
  const { startRecording, stopRecording, recording, text, transcribing } =
    useRecordVoice();
  const { runModel, currentSession, stopGeneration, refetchSessions } =
    useChatContext();
  const [contextValue, setContextValue] = useState<string>('');
  const { getPreferences, getApiKey } = usePreferences();
  const { getModelByKey } = useModelList();
  const { open: openSettings } = useSettings();
  const { showPopup, selectedText, handleClearSelection } = useTextSelection();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [open, setOpen] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<TModelKey>('gpt-4-turbo');
  const { open: openPrompts } = usePrompts();

  const [attachment, setAttachment] = useState<TAttachment>();

  const ShiftEnter = Extension.create({
    addKeyboardShortcuts() {
      return {
        'Shift-Enter': (_) => {
          return _.editor.commands.enter();
        },
      };
    },
  });

  const EnterRunModel = Extension.create({
    addKeyboardShortcuts() {
      return {
        Enter: (_) => {
          if (_.editor.getText()?.length > 0) {
            handleRunModel(_.editor.getText(), () => {
              _.editor.commands.clearContent();
              _.editor.commands.focus('end');
            });
          }
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Placeholder.configure({
        placeholder: 'Type / or Enter prompt here...',
      }),
      EnterRunModel,
      ShiftEnter,
      Highlight.configure({
        HTMLAttributes: {
          class: 'prompt-highlight',
        },
      }),
      HardBreak,
    ],
    content: ``,
    autofocus: true,
    onTransaction(props) {
      const { editor } = props;
      const text = editor.getText();
      const html = editor.getHTML();
      if (text === '/') {
        setOpen(true);
      } else {
        console.log(text);
        const newHTML = html.replace(
          /{{{{(.*?)}}}}/g,
          ` <mark class="prompt-highlight">$1</mark> `
        );

        if (newHTML !== html) {
          editor.commands.setContent(newHTML, true, {
            preserveWhitespace: true,
          });
        }
        setOpen(false);
      }
    },
    parseOptions: {
      preserveWhitespace: true,
    },
  });

  useEffect(() => {
    if (editor?.isActive) {
      editor.commands.focus('end');
    }
  }, [editor?.isActive]);

  const resizeFile = (file: File) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1000,
        1000,
        'JPEG',
        100,
        0,
        (uri) => {
          console.log(typeof uri);
          resolve(uri);
        },
        'file'
      );
    });

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    const reader = new FileReader();

    const fileTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (file && !fileTypes.includes(file?.type)) {
      toast({
        title: 'Invalid format',
        description: 'Please select a valid image (JPEG, PNG, GIF).',
        variant: 'destructive',
      });
      return;
    }

    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const base64String = reader?.result?.split(',')[1];
      setAttachment((prev) => ({
        ...prev,
        base64: `data:${file?.type};base64,${base64String}`,
      }));
    };

    if (file) {
      setAttachment((prev) => ({
        ...prev,
        file,
      }));
      const resizedFile = await resizeFile(file);

      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = () => {
    document.getElementById('fileInput')?.click();
  };

  const handleRunModel = (query?: string, clear?: () => void) => {
    if (!query) {
      return;
    }
    getPreferences().then(async (preference) => {
      const selectedModel = getModelByKey(preference.defaultModel);
      if (
        selectedModel?.key &&
        !['gpt-4-turbo', 'gpt-4o'].includes(selectedModel?.key) &&
        attachment?.base64
      ) {
        toast({
          title: 'Ahh!',
          description: 'This model does not support image input.',
          variant: 'destructive',
        });
        return;
      }

      if (!selectedModel?.baseModel) {
        throw new Error('Model not found');
      }

      const apiKey = await getApiKey(selectedModel?.baseModel);

      if (!apiKey) {
        toast({
          title: 'Ahh!',
          description: 'API key is missing. Please check your settings.',
          variant: 'destructive',
        });
        openSettings(selectedModel?.baseModel);
        return;
      }

      setAttachment(undefined);
      setContextValue('');
      clear?.();
      await runModel({
        sessionId: sessionId!.toString(),
        props: {
          role: RoleType.assistant,
          type: PromptType.ask,
          image: attachment?.base64,
          query: removeExtraSpaces(query),
          context: removeExtraSpaces(contextValue),
        },
      });
      await refetchSessions();
    });
  };

  useEffect(() => {
    if (sessionId) {
      inputRef.current?.focus();
    }
  }, [sessionId]);

  const isNewSession = !currentSession?.messages?.length;

  useEffect(() => {
    if (text) {
      editor?.commands.clearContent();
      editor?.commands.setContent(text);
      runModel({
        props: {
          role: RoleType.assistant,
          type: PromptType.ask,
          query: text,
        },
        sessionId: sessionId!.toString(),
      });
      editor?.commands.clearContent();
    }
  }, [text]);

  const startVoiceRecording = async () => {
    const apiKey = await getApiKey('openai');
    if (!apiKey) {
      toast({
        title: 'API key missing',
        description:
          'Recordings require OpenAI API key. Please check settings.',
        variant: 'destructive',
      });
      openSettings('openai');
      return;
    }
    startRecording();
  };

  const renderRecordingControls = () => {
    if (recording) {
      return (
        <>
          <Button
            variant="ghost"
            size="iconSm"
            onClick={() => {
              stopRecording();
            }}
          >
            <StopCircle size={20} weight="fill" className="text-red-300" />
          </Button>
        </>
      );
    }

    return (
      <Tooltip content="Record">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 min-w-8"
          onClick={startVoiceRecording}
        >
          <Microphone size={20} weight="bold" />
        </Button>
      </Tooltip>
    );
  };

  const renderListeningIndicator = () => {
    if (transcribing) {
      return (
        <div className="flex h-10 flex-row items-center gap-2 rounded-full bg-zinc-800 px-4 py-1 text-sm text-white md:text-base dark:bg-zinc-900">
          <AudioWaveSpinner /> <p>Transcribing ...</p>
        </div>
      );
    }
    if (recording) {
      return (
        <div className="flex h-10 flex-row items-center gap-2 rounded-full bg-zinc-800 px-2 py-1 pr-4 text-sm text-white md:text-base dark:bg-zinc-900">
          <AudioWaveSpinner />
          <p>Listening ...</p>
        </div>
      );
    }
  };

  const renderScrollToBottom = () => {
    if (showButton && !showPopup && !recording && !transcribing) {
      return (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <Button onClick={scrollToBottom} variant="secondary" size="iconSm">
            <ArrowDown size={20} weight="bold" />
          </Button>
        </motion.span>
      );
    }
  };

  const renderReplyButton = () => {
    if (showPopup && !recording && !transcribing) {
      return (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <Button
            onClick={() => {
              setContextValue(selectedText);
              handleClearSelection();
              inputRef.current?.focus();
            }}
            variant="secondary"
            size="sm"
          >
            <Quotes size={20} weight="bold" /> Reply
          </Button>
        </motion.span>
      );
    }
  };

  const renderStopButton = () => {
    return (
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
      >
        <Button
          onClick={() => {
            stopGeneration();
          }}
          variant="secondary"
          size="sm"
        >
          <Stop size={20} weight="bold" /> Stop
        </Button>
      </motion.span>
    );
  };

  const renderAttachedImage = () => {
    if (attachment?.base64 && attachment?.file) {
      return (
        <div className="flex h-10 w-full flex-row items-center justify-start gap-2 rounded-xl bg-black/30 pr-1 pl-3 text-zinc-300 md:w-[700px]">
          <ArrowElbowDownRight size={20} weight="bold" />
          <p className="relative ml-2 flex w-full flex-row items-center gap-2 text-sm md:text-base">
            <Image
              src={attachment.base64}
              alt="uploaded image"
              className="tanslate-y-[50%] absolute h-[60px] min-w-[60px] rotate-6 rounded-xl border border-white/5 object-cover shadow-md"
              width={0}
              height={0}
            />
            <span className="ml-[70px]">{attachment?.file?.name}</span>
          </p>
          <Button
            size={'iconSm'}
            variant="ghost"
            onClick={() => {
              setContextValue('');
            }}
            className="ml-4 flex-shrink-0"
          >
            <X size={16} weight="bold" />
          </Button>
        </div>
      );
    }
  };

  const renderSelectedContext = () => {
    if (contextValue) {
      return (
        <div className="flex h-10 w-[700px] flex-row items-center justify-start gap-2 rounded-xl bg-black/30 pr-1 pl-3 text-zinc-300">
          <ArrowElbowDownRight size={16} weight="fill" />
          <p className="ml-2 w-full overflow-hidden truncate text-sm md:text-base ">
            {contextValue}
          </p>
          <Button
            size={'iconSm'}
            variant="ghost"
            onClick={() => {
              setContextValue('');
            }}
            className="ml-4 flex-shrink-0"
          >
            <X size={16} weight="bold" />
          </Button>
        </div>
      );
    }
  };

  const renderFileUpload = () => {
    return (
      <>
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={handleImageUpload}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFileSelect}
          className="px-1.5"
        >
          <Paperclip size={16} weight="bold" /> Attach
        </Button>
      </>
    );
  };

  const clearInput = () => {
    editor?.commands.clearContent();
  };

  const focusToInput = () => {
    editor?.commands.focus('end');
  };

  return (
    <div
      className={cn(
        'absolute right-0 bottom-8 left-0 flex w-full flex-col items-center justify-end gap-1 bg-gradient-to-t from-70% from-white to-transparent px-2 pt-16 pb-4 transition-all duration-1000 ease-in-out md:bottom-0 md:justify-center md:px-4 dark:from-zinc-800',
        isNewSession && !currentSession?.bot && 'top-0 '
      )}
    >
      <div className="flex flex-row items-center gap-2">
        {renderScrollToBottom()}
        {renderReplyButton()}
        {renderListeningIndicator()}
      </div>
      {/* <div className="flex flex-col  justify-center items-center">
        <ChatExamples
          show={isNewSession}
          onExampleClick={(prompt) => {
            handleRunModel(prompt, () => {
              clearInput();
              focusToInput();
            });
          }}
        />
      </div> */}
      <div className="flex w-full flex-col gap-1 md:w-[700px]">
        {renderSelectedContext()}
        {renderAttachedImage()}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverAnchor className="w-full">
            <motion.div
              variants={slideUpVariant}
              initial={'initial'}
              animate={editor?.isActive ? 'animate' : 'initial'}
              className="flex w-full flex-col items-start gap-0 overflow-hidden rounded-2xl bg-zinc-50 dark:border-white/5 dark:bg-white/5"
            >
              <div className="flex w-full flex-row items-end gap-0 py-2 pr-2 pl-2 md:pl-3">
                {/* {renderNewSession()} */}
                <EditorContent
                  editor={editor}
                  autoFocus
                  className="no-scrollbar [&>*]:no-scrollbar wysiwyg max-h-[120px] min-h-8 w-full cursor-text overflow-y-auto p-1 text-sm outline-none focus:outline-none md:text-base [&>*]:leading-6 [&>*]:outline-none"
                />

                {renderRecordingControls()}

                <Button
                  size="icon"
                  variant={!!editor?.getText() ? 'secondary' : 'ghost'}
                  disabled={!editor?.getText()}
                  className="ml-1 h-8 min-w-8"
                  onClick={() =>
                    handleRunModel(editor?.getText(), () => {
                      clearInput();
                      focusToInput();
                    })
                  }
                >
                  <ArrowUp size={20} weight="bold" />
                </Button>
              </div>
              <div className="flex w-full flex-row items-center justify-start gap-0 px-2 pt-1 pb-2">
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
                  <ClockClockwise size={16} weight="bold" /> History
                  <Badge className="hidden md:flex">
                    <Command size={16} weight="bold" /> K
                  </Badge>
                </Button>
              </div>
            </motion.div>
          </PopoverAnchor>
          <PopoverContent
            side="top"
            sideOffset={4}
            className="min-w-[96vw] overflow-hidden rounded-2xl p-0 md:min-w-[700px]"
          >
            <CMDKCommand>
              <CommandInput
                placeholder="Search..."
                className="h-10"
                value={commandInput}
                onValueChange={setCommandInput}
                onKeyDown={(e) => {
                  if (
                    (e.key === 'Delete' || e.key === 'Backspace') &&
                    !commandInput
                  ) {
                    setOpen(false);
                    clearInput();
                    focusToInput();
                  }
                }}
              />
              <CommandEmpty>No Prompts found.</CommandEmpty>
              <CommandList className="max-h-[160px] p-2">
                <CommandItem
                  onSelect={() => {
                    openPrompts();
                  }}
                >
                  <Plus size={14} weight="bold" className="flex-shrink-0" />{' '}
                  Create New Prompt
                </CommandItem>
                {prompts?.map((prompt, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => {
                      editor?.commands.setContent(prompt.content);
                      editor?.commands.insertContent('');
                      console.log(editor?.getText());
                      editor?.commands.focus('end');
                      setOpen(false);
                    }}
                  >
                    {prompt.name}
                  </CommandItem>
                ))}
              </CommandList>
            </CMDKCommand>
          </PopoverContent>
        </Popover>

        {isNewSession && !currentSession?.bot && (
          <div className="fixed right-0 bottom-0 left-0 flex w-full flex-row justify-center p-3 text-xs">
            <p className="text-xs text-zinc-500/50">
              P.S. Your data is stored locally on local storage, not in the
              cloud.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
