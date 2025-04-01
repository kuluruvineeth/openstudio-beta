import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@repo/design-system/components/ui/resizable';
import { cn } from '@repo/design-system/lib/utils';
import { type ReactNode, useEffect, useRef, useState } from 'react';

interface ResizablePanelsProps {
  isBaseResume: boolean;
  editorPanel: ReactNode;
  previewPanel: (width: number) => ReactNode;
}

export function ResizablePanels({
  isBaseResume,
  editorPanel,
  previewPanel,
}: ResizablePanelsProps) {
  const [previewSize, setPreviewSize] = useState(60);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPercentageRef = useRef(60); // Store last percentage

  // Add function to calculate pixel width
  const updatePixelWidth = () => {
    const containerWidth = containerRef.current?.clientWidth || 0;
    const pixelWidth = Math.floor(
      (containerWidth * lastPercentageRef.current) / 100
    );
    setPreviewSize(pixelWidth);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Handle window resize
    const handleResize = () => updatePixelWidth();
    window.addEventListener('resize', handleResize);

    // Initial calculation
    updatePixelWidth();

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className="relative h-full">
      <ResizablePanelGroup
        direction="horizontal"
        className={cn(
          'relative h-full rounded-lg ',
          isBaseResume ? 'border-purple-200/40' : 'border-pink-300/50'
        )}
      >
        {/* Editor Panel */}
        <ResizablePanel defaultSize={40} minSize={30} maxSize={70}>
          {editorPanel}
        </ResizablePanel>

        {/* Resize Handle */}
        <ResizableHandle
          withHandle
          className={cn(
            isBaseResume
              ? 'bg-purple-100/50 hover:bg-purple-200/50'
              : 'bg-pink-200/50 shadow-pink-200/20 shadow-sm hover:bg-pink-300/50'
          )}
        />

        {/* Preview Panel */}
        <ResizablePanel
          defaultSize={60}
          minSize={30}
          maxSize={70}
          onResize={(size) => {
            lastPercentageRef.current = size; // Store current percentage
            updatePixelWidth();
          }}
          className={cn(
            'overflow-y-scroll shadow-[0_0_30px_-5px_rgba(0,0,0,0.3)]',
            isBaseResume ? 'shadow-purple-200/50' : 'shadow-pink-200/50'
          )}
        >
          {previewPanel(previewSize)}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
