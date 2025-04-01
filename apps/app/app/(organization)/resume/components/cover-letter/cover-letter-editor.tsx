'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Separator } from '@repo/design-system/components/ui/separator';
import { cn } from '@repo/design-system/lib/utils';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold as BoldIcon,
  Heading1,
  Heading2,
  Italic as ItalicIcon,
  Strikethrough as StrikeIcon,
  Underline as UnderlineIcon,
} from 'lucide-react';
import { useEffect } from 'react';

interface CoverLetterEditorProps {
  initialData: Record<string, unknown>;
  onChange?: (data: Record<string, unknown>) => void;
  containerWidth: number;
  isPrintVersion?: boolean;
}

function CoverLetterEditor({
  initialData,
  onChange,
  containerWidth,
  isPrintVersion = false,
}: CoverLetterEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
    ],
    content:
      (initialData?.content as string) ||
      '<p>Start writing your cover letter...</p>',
    editorProps: {
      attributes: {
        class:
          'prose prose-xxs focus:outline-none h-full overflow-none max-w-none text-black ',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.({
        content: editor.getHTML(),
        lastUpdated: new Date().toISOString(),
      });
    },
  });

  // Update effect to handle content changes
  useEffect(() => {
    if (editor && initialData?.content) {
      const currentContent = editor.getHTML();
      const newContent = initialData.content as string;
      if (newContent !== currentContent) {
        editor.commands.setContent(newContent);
      }
    }
  }, [initialData?.content, editor]);

  // Cleanup editor on unmount
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  return (
    <div className="relative mx-auto mb-12 w-full max-w-[816px] overflow-hidden bg-white shadow-lg">
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="flex overflow-hidden rounded-lg border border-gray-300 bg-white shadow-xl"
        >
          {/* Text Style */}
          <div className="flex items-center">
            <Button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                'h-8 px-3 transition-colors hover:bg-gray-100',
                editor.isActive('bold') && 'bg-gray-100 text-gray-900'
              )}
              variant="ghost"
              size="sm"
            >
              <BoldIcon className="h-4 w-4" />
            </Button>

            <Button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn(
                'h-8 px-3 transition-colors hover:bg-gray-100',
                editor.isActive('italic') && 'bg-gray-100 text-gray-900'
              )}
              variant="ghost"
              size="sm"
            >
              <ItalicIcon className="h-4 w-4" />
            </Button>

            <Button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={cn(
                'h-8 px-3 transition-colors hover:bg-gray-100',
                editor.isActive('underline') && 'bg-gray-100 text-gray-900'
              )}
              variant="ghost"
              size="sm"
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>

            <Button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={cn(
                'h-8 px-3 transition-colors hover:bg-gray-100',
                editor.isActive('strike') && 'bg-gray-100 text-gray-900'
              )}
              variant="ghost"
              size="sm"
            >
              <StrikeIcon className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="mx-1 h-8" />

          {/* Text Alignment */}
          <div className="flex items-center">
            <Button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={cn(
                'h-8 px-3 transition-colors hover:bg-gray-100',
                editor.isActive({ textAlign: 'left' }) &&
                  'bg-gray-100 text-gray-900'
              )}
              variant="ghost"
              size="sm"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>

            <Button
              onClick={() =>
                editor.chain().focus().setTextAlign('center').run()
              }
              className={cn(
                'h-8 px-3 transition-colors hover:bg-gray-100',
                editor.isActive({ textAlign: 'center' }) &&
                  'bg-gray-100 text-gray-900'
              )}
              variant="ghost"
              size="sm"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>

            <Button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={cn(
                'h-8 px-3 transition-colors hover:bg-gray-100',
                editor.isActive({ textAlign: 'right' }) &&
                  'bg-gray-100 text-gray-900'
              )}
              variant="ghost"
              size="sm"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="mx-1 h-8" />

          {/* Headings */}
          <div className="flex items-center">
            <Button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={cn(
                'h-8 px-3 transition-colors hover:bg-gray-100',
                editor.isActive('heading', { level: 1 }) &&
                  'bg-gray-100 text-gray-900'
              )}
              variant="ghost"
              size="sm"
            >
              <Heading1 className="h-4 w-4" />
            </Button>

            <Button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={cn(
                'h-8 px-3 transition-colors hover:bg-gray-100',
                editor.isActive('heading', { level: 2 }) &&
                  'bg-gray-100 text-gray-900'
              )}
              variant="ghost"
              size="sm"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
          </div>
        </BubbleMenu>
      )}
      <div
        className={cn(
          'print:!pb-0 relative pb-[129.41%]',
          isPrintVersion && '!pb-0 !relative !shadow-none'
        )}
      >
        <div
          className={cn(
            'print:!relative absolute inset-0 h-full origin-top-left',
            isPrintVersion && '!relative !transform-none !w-full !h-auto'
          )}
          style={
            isPrintVersion
              ? {}
              : {
                  transform: `scale(${containerWidth / 816})`,
                  width: `${100 / (containerWidth / 816)}%`,
                  height: `${100 / (containerWidth / 816)}%`,
                }
          }
        >
          <div
            className={cn(
              'absolute inset-0 mx-16 my-12 overflow-hidden',
              isPrintVersion && '!my-0 !mx-8'
            )}
          >
            <EditorContent
              editor={editor}
              className={cn(
                'prose prose-xxs flex h-full max-w-none flex-col focus:outline-none',
                isPrintVersion && '!prose-sm !text-[12pt]'
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoverLetterEditor;
