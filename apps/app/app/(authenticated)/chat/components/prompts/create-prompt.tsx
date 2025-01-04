import { usePrompts } from '@/app/hooks/use-prompts';
import { ArrowLeft } from '@phosphor-icons/react';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Highlight from '@tiptap/extension-highlight';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Text from '@tiptap/extension-text';
import { EditorContent, useEditor } from '@tiptap/react';
import { useEffect, useRef, useState } from 'react';

export type TCreatePrompt = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CreatePrompt = ({ open, onOpenChange }: TCreatePrompt) => {
  const [promptTitle, setPromptTitle] = useState('');
  const { setPrompt, getPrompts } = usePrompts();
  const promptTitleRef = useRef<HTMLInputElement | null>(null);
  const [rawPrompt, setRawPrompt] = useState('');

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Placeholder.configure({
        placeholder: 'Enter prompt here...',
      }),
      HardBreak,
      Highlight.configure({
        HTMLAttributes: {
          class: 'prompt-highlight',
        },
      }),
    ],
    content: ``,
    autofocus: true,

    onTransaction(props) {
      // const { editor } = props;
      // const text = editor.getText();
      // setRawPrompt(text);
      // const html = editor.getHTML();
      // const newHTML = html.replace(
      //   /{{{{(.*?)}}}}/g,
      //   ` <mark class="prompt-highlight">$1</mark> `
      // );
      // if (newHTML !== html) {
      //   editor.commands.setContent(newHTML, true, {
      //     preserveWhitespace: true,
      //   });
      // }
    },
    parseOptions: {
      preserveWhitespace: true,
    },
  });

  useEffect(() => {
    promptTitleRef?.current?.focus();
  }, [open]);

  const clearPrompt = () => {
    setPromptTitle('');
    editor?.commands.setContent('');
  };

  const savePrompt = async () => {
    const content = editor?.getText();
    if (!content) {
      return;
    }
    await setPrompt({ name: promptTitle, content });
    clearPrompt();

    onOpenChange(false);
  };

  return (
    <div className="relative flex h-full w-full flex-col items-start overflow-hidden">
      <div className="flex w-full flex-row items-center gap-3 border-zinc-500/20 border-b px-2 py-2">
        <Button
          size="iconSm"
          variant="ghost"
          onClick={() => {
            onOpenChange(false);
          }}
        >
          <ArrowLeft size={16} weight="bold" />
        </Button>
        <p className="font-medium text-base">Create New Prompt</p>
      </div>
      <div className="no-scrollbar flex h-full w-full flex-1 flex-col overflow-y-auto p-2 pb-[80px]">
        <Input
          type="text"
          placeholder="Prompt Title"
          variant="ghost"
          value={promptTitle}
          ref={promptTitleRef}
          onChange={(e) => setPromptTitle(e.target.value)}
          className="w-full bg-transparent"
        />
        <EditorContent
          editor={editor}
          autoFocus
          className="no-scrollbar [&>*]:no-scrollbar w-full cursor-text p-3 text-sm outline-none focus:outline-none md:text-base [&>*]:leading-7 [&>*]:outline-none"
        />
        <p className="flex flex-row items-center gap-2 px-3 py-2 text-xs text-zinc-500">
          Use <Badge>{`{{{{ input }}}}`}</Badge> for user input
        </p>
      </div>
      <div className="absolute right-0 bottom-0 left-0 flex w-full flex-row items-center gap-3 border-zinc-500/20 border-t bg-white px-2 py-2 dark:bg-zinc-800">
        <Button
          variant="default"
          onClick={() => {
            savePrompt();
          }}
        >
          Save
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            onOpenChange(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
