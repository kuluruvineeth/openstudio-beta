import { ButtonGroup } from '@repo/design-system/components/ui/button-group';
import { LoadingMiniSpinner } from '@repo/design-system/components/ui/loading-mini-spinner';
import { cn } from '@repo/design-system/lib/utils';
import {
  DownloadIcon,
  ScissorsIcon,
  Share2Icon,
  Trash2Icon,
} from 'lucide-react';
import { useMemo } from 'react';
import type React from 'react';
type ActionHandler = (e?: React.MouseEvent) => void;

interface VideoActionButtonsProps {
  isTrimming?: boolean;
  isDownloading?: boolean;
  isSharing?: boolean;
  isDeleting?: boolean;
  isDisabledTrim?: boolean;
  isDisabledDownload?: boolean;
  isDisabledShare?: boolean;
  isDisabledDelete?: boolean;
  onTrim: ActionHandler;
  onDownload: ActionHandler;
  onShare: ActionHandler;
  onDelete: ActionHandler;
  shadow?: boolean;
}

export function VideoActionButtons({
  isTrimming = false,
  isDownloading = false,
  isSharing = false,
  isDeleting = false,
  isDisabledTrim = false,
  isDisabledDownload = false,
  isDisabledShare = false,
  isDisabledDelete = false,
  onTrim,
  onDownload,
  onShare,
  onDelete,
  shadow = false,
}: VideoActionButtonsProps) {
  const buttons = useMemo(
    () => [
      {
        tooltip: 'Edit Video',
        onClick: onTrim,
        icon: isTrimming ? (
          <LoadingMiniSpinner />
        ) : (
          <ScissorsIcon
            className={cn(
              'h-4 w-4 text-blue-500',
              isDisabledTrim && 'cursor-not-allowed opacity-50'
            )}
            aria-hidden="true"
          />
        ),
      },
      {
        tooltip: 'Download',
        onClick: onDownload,
        icon: isDownloading ? (
          <LoadingMiniSpinner />
        ) : (
          <DownloadIcon
            className={cn(
              'h-4 w-4 text-green-500',
              isDisabledDownload && 'cursor-not-allowed opacity-50'
            )}
            aria-hidden="true"
          />
        ),
      },
      {
        tooltip: 'Share',
        onClick: onShare,
        icon: isSharing ? (
          <LoadingMiniSpinner />
        ) : (
          <Share2Icon
            className={cn(
              'h-4 w-4',
              isDisabledShare && 'cursor-not-allowed opacity-50'
            )}
            aria-hidden="true"
            style={{ color: '#f97316' }}
          />
        ),
      },
      {
        tooltip: 'Delete',
        onClick: onDelete,
        icon: isDeleting ? (
          <LoadingMiniSpinner />
        ) : (
          <Trash2Icon
            className={cn(
              'h-4 w-4 text-red-500',
              isDisabledDelete && 'cursor-not-allowed opacity-50'
            )}
            aria-hidden="true"
          />
        ),
      },
    ],
    [
      isTrimming,
      isDownloading,
      isSharing,
      isDeleting,
      isDisabledTrim,
      isDisabledDownload,
      isDisabledShare,
      isDisabledDelete,
      onTrim,
      onDownload,
      onShare,
      onDelete,
    ]
  );

  return <ButtonGroup buttons={buttons} shadow={shadow} />;
}
