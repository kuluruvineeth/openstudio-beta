'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@repo/design-system/components/ui/context-menu';
import { Copy, Download } from 'lucide-react';

interface CoverLetterContextMenuProps {
  children: React.ReactNode;
  onDownloadPDF: () => Promise<void>;
  onCopyToClipboard: () => Promise<void>;
}

export function CoverLetterContextMenu({
  children,
  onDownloadPDF,
  onCopyToClipboard,
}: CoverLetterContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="h-full w-full">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem
          onClick={onDownloadPDF}
          className="flex cursor-pointer items-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span>Download as PDF</span>
        </ContextMenuItem>
        <ContextMenuItem
          onClick={onCopyToClipboard}
          className="flex cursor-pointer items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          <span>Copy to Clipboard</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
