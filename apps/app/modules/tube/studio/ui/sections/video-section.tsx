'use client';
import { InfiniteScroll } from '@/components/infinite-scroll';
import { DEFAULT_LIMIT } from '@/config/constants';
import { snakeCaseToTitle } from '@/lib/utils';
import { VideoThumbnail } from '@/modules/tube/videos/ui/components/video-thumbnail';
import { trpc } from '@/trpc/client';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/design-system/components/ui/table';
import { format } from 'date-fns';
import { Globe2Icon, LockIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { VideoActionButtons } from '../components/video-action-buttons';
export const VideoSection = () => {
  return (
    <Suspense fallback={<VideosSectionSkeleton />}>
      <ErrorBoundary fallback={<div>Error</div>}>
        <VideoSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideosSectionSkeleton = () => {
  return (
    <>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[510px] pl-6">Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-36" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

const VideoSectionSuspense = () => {
  const router = useRouter();
  const [data, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const [loadingState, setLoadingState] = useState<
    Record<
      string,
      {
        trim?: boolean;
        download?: boolean;
        share?: boolean;
        delete?: boolean;
      }
    >
  >({});

  const handleTrim = async (videoId: string) => {
    setLoadingState((prev) => ({
      ...prev,
      [videoId]: { ...prev[videoId], trim: true },
    }));
    try {
      router.push(`/tube/studio/${videoId}/edit`);
    } finally {
      setLoadingState((prev) => ({
        ...prev,
        [videoId]: { ...prev[videoId], trim: false },
      }));
    }
  };

  const handleDownload = async (videoId: string) => {
    setLoadingState((prev) => ({
      ...prev,
      [videoId]: { ...prev[videoId], download: true },
    }));
    try {
      // Implement download logic here
      console.log('Downloading video:', videoId);
    } finally {
      setLoadingState((prev) => ({
        ...prev,
        [videoId]: { ...prev[videoId], download: false },
      }));
    }
  };

  const handleShare = async (videoId: string) => {
    setLoadingState((prev) => ({
      ...prev,
      [videoId]: { ...prev[videoId], share: true },
    }));
    try {
      // Implement share logic here
      console.log('Sharing video:', videoId);
    } finally {
      setLoadingState((prev) => ({
        ...prev,
        [videoId]: { ...prev[videoId], share: false },
      }));
    }
  };

  const handleDelete = async (videoId: string) => {
    setLoadingState((prev) => ({
      ...prev,
      [videoId]: { ...prev[videoId], delete: true },
    }));
    try {
      // Implement delete logic here
      console.log('Deleting video:', videoId);
    } finally {
      setLoadingState((prev) => ({
        ...prev,
        [videoId]: { ...prev[videoId], delete: false },
      }));
    }
  };

  return (
    <div>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6" style={{ width: '510px' }}>
                Video
              </TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]" />{' '}
              {/* Space for action buttons */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.pages
              .flatMap((page) => page.items)
              .map((video) => (
                <Link
                  href={`/tube/studio/${video.id}`}
                  key={video.id}
                  legacyBehavior
                >
                  <TableRow className="group relative transition-colors hover:bg-muted/50">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-4">
                        <div className="relative aspect-video w-36 shrink-0">
                          <VideoThumbnail
                            title={video.title}
                            imageUrl={video.thumbnailUrl ?? ''}
                            previewUrl={video.previewUrl ?? ''}
                            duration={video.duration ?? 0}
                          />
                        </div>
                        <div className="flex flex-col gap-y-1 overflow-hidden">
                          <span className="line-clamp-1 text-sm">
                            {video.title}
                          </span>
                          <span className="line-clamp-1 text-muted-foreground text-xs">
                            {video.description || 'No description'}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {video.visibility === 'private' ? (
                          <LockIcon className="mr-2 size-4" />
                        ) : (
                          <Globe2Icon className="mr-2 size-4" />
                        )}
                        {snakeCaseToTitle(video.visibility)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {snakeCaseToTitle(video.muxStatus || 'error')}
                      </div>
                    </TableCell>
                    <TableCell className="truncate text-sm">
                      {format(new Date(video.createdAt), 'd MMM yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="-translate-y-1/2 absolute top-1/2 right-4 z-20 hidden transition-opacity duration-200 group-hover:block">
                        <VideoActionButtons
                          isTrimming={loadingState[video.id]?.trim}
                          isDownloading={loadingState[video.id]?.download}
                          isSharing={loadingState[video.id]?.share}
                          isDeleting={loadingState[video.id]?.delete}
                          isDisabledTrim={true}
                          isDisabledDownload={true}
                          isDisabledShare={true}
                          isDisabledDelete={true}
                          onTrim={(e) => {
                            e?.preventDefault?.();
                            handleTrim(video.id);
                          }}
                          onDownload={(e) => {
                            e?.preventDefault?.();
                            handleDownload(video.id);
                          }}
                          onShare={(e) => {
                            e?.preventDefault?.();
                            handleShare(video.id);
                          }}
                          onDelete={(e) => {
                            e?.preventDefault?.();
                            handleDelete(video.id);
                          }}
                          shadow
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                </Link>
              ))}
          </TableBody>
        </Table>
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};
