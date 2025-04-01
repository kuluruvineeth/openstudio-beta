import { cn } from '@repo/design-system/lib/utils';
import type { ReactNode } from 'react';
import { ResizablePanels } from './ResizablePanels';

interface EditorLayoutProps {
  isBaseResume: boolean;
  editorPanel: ReactNode;
  previewPanel: (width: number) => ReactNode;
}

export function EditorLayout({
  isBaseResume,
  editorPanel,
  previewPanel,
}: EditorLayoutProps) {
  return (
    <main
      className={cn(
        'flex h-full'
        // isBaseResume
        //   ? "bg-gradient-to-br from-rose-50/50 via-sky-50/50 to-violet-50/50"
        //   : "bg-gradient-to-br from-pink-100/80 via-rose-50/80 to-pink-100/80"
      )}
    >
      {/* <BackgroundEffects isBaseResume={isBaseResume} /> */}

      <div className="relative mx-auto h-full w-full px-6 py-4 shadow-xl md:px-8 lg:px-12 ">
        <ResizablePanels
          isBaseResume={isBaseResume}
          editorPanel={editorPanel}
          previewPanel={previewPanel}
        />
      </div>
    </main>
  );
}
