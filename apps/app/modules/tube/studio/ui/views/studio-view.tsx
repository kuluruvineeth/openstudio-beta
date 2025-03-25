import { VideoSection } from '@/modules/tube/studio/ui/sections/video-section';

export const StudioView = () => {
  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="flex flex-col items-start justify-start">
          <h1 className="font-bold text-2xl">Channel Content</h1>
          <p className="text-muted-foreground text-xs">
            Manage your channel content and videos
          </p>
        </div>
        <VideoSection />
      </div>
    </div>
  );
};
