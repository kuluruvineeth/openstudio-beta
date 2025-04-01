import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@repo/design-system/components/ui/resizable';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';

export default function ResumeEditorLoading() {
  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
      <div className="mx-auto h-[calc(100vh-120px)] max-w-[2000px] px-6 pt-4 md:px-8 lg:px-12">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full rounded-lg border-purple-200/40"
        >
          {/* Editor Panel */}
          <ResizablePanel defaultSize={40}>
            <div className="mr-4 flex h-full flex-col">
              {/* Editor Header Skeleton */}
              <div className="sticky top-0 z-20 space-y-4 rounded-t-lg bg-purple-50/80 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-48" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-9 w-20" />
                  ))}
                </div>
              </div>

              {/* Form Fields Skeleton */}
              <div className="mt-4 flex-1 space-y-8 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="space-y-4 rounded-lg bg-purple-50/30 p-4"
                  >
                    <Skeleton className="h-6 w-32" />
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Chatbot Skeleton */}
              <div className="mt-auto mb-4 rounded-lg border border-purple-200/40 bg-purple-50/50 p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </div>
          </ResizablePanel>

          {/* Resize Handle */}
          <ResizableHandle
            withHandle
            className="bg-purple-100/50 hover:bg-purple-200/50"
          />

          {/* Preview Panel */}
          <ResizablePanel defaultSize={60}>
            <div className="h-full pr-4">
              <div className="relative w-full pb-[129.4%]">
                <div className="absolute inset-0 rounded-lg bg-purple-50/30">
                  {/* Resume Preview Skeleton */}
                  <div className="h-full space-y-6 p-8">
                    {/* Header */}
                    <div className="space-y-2">
                      <Skeleton className="mx-auto h-8 w-64" />
                      <div className="flex justify-center gap-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>

                    {/* Sections */}
                    <div className="space-y-8">
                      {/* Experience */}
                      <div className="space-y-4">
                        <Skeleton className="h-6 w-32" />
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between">
                              <Skeleton className="h-4 w-48" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                          </div>
                        ))}
                      </div>

                      {/* Education */}
                      <div className="space-y-4">
                        <Skeleton className="h-6 w-32" />
                        {[...Array(2)].map((_, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between">
                              <Skeleton className="h-4 w-40" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
