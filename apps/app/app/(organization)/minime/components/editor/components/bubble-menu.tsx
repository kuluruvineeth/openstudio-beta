import { Button } from '@repo/design-system/components/ui/button';
import { Icons } from '@repo/design-system/components/ui/icons';
import { cn } from '@repo/design-system/lib/utils';
import type { Editor } from '@tiptap/core';
import { BubbleMenu as TipTapBubbleMenu } from '@tiptap/react';
import { useState } from 'react';
import LinkSelector from './link-selector';
import NodeSelector from './node-selector';

export interface BubbleMenuItem {
  name: string;
  isActive: boolean;
  command: () => void;
  icon: typeof Icons.heading1;
}

export default function BubbleMenu({ editor }: { editor: Editor }) {
  const items: BubbleMenuItem[] = [
    {
      name: 'bold',
      isActive: editor.isActive('bold'),
      command: () => editor.chain().focus().toggleBold().run(),
      icon: Icons.bold,
    },
    {
      name: 'italic',
      isActive: editor.isActive('italic'),
      command: () => editor.chain().focus().toggleItalic().run(),
      icon: Icons.italic,
    },
    {
      name: 'strike',
      isActive: editor.isActive('strike'),
      command: () => editor.chain().focus().toggleStrike().run(),
      icon: Icons.strike,
    },
    {
      name: 'code',
      isActive: editor.isActive('code'),
      command: () => editor.chain().focus().toggleCode().run(),
      icon: Icons.code,
    },
  ];

  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState<boolean>(false);
  const [isLinkSelectorOpen, setIsLinkSelectorOpen] = useState<boolean>(false);

  return (
    <TipTapBubbleMenu
      className=" z-50 flex flex-row gap-2 rounded-lg border border-gray-2 bg-gray-3 p-1"
      editor={editor}
      tippyOptions={{
        duration: 100,
        onHidden: () => {
          setIsNodeSelectorOpen(false);
          setIsLinkSelectorOpen(false);
        },
      }}
      shouldShow={({ editor }) => {
        if (editor.isActive('image')) {
          return false;
        }
        return editor.view.state.selection.content().size > 0;
      }}
    >
      <NodeSelector
        editor={editor}
        isOpen={isNodeSelectorOpen}
        setIsOpen={() => {
          setIsNodeSelectorOpen(!isNodeSelectorOpen);
        }}
      />
      <LinkSelector
        editor={editor}
        isOpen={isLinkSelectorOpen}
        setIsOpen={() => {
          setIsLinkSelectorOpen(!isLinkSelectorOpen);
        }}
      />
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={item.command}
            className={cn(item.isActive ? 'bg-gray-2 text-secondary' : '')}
            key={i}
          >
            <Icon size={15} />
          </Button>
        );
      })}
    </TipTapBubbleMenu>
  );
}
