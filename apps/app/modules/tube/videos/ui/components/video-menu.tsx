import {
  ListPlusIcon,
  MoreVerticalIcon,
  ShareIcon,
  Trash2Icon,
} from 'lucide-react';

import { Button } from '@repo/design-system/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface VideoMenuProps {
  videoId: string;
  variant?: 'ghost' | 'secondary';
  onRemove?: () => void;
}

// TODO: implement whats left
export const VideoMenu = ({
  videoId,
  variant = 'ghost',
  onRemove,
}: VideoMenuProps) => {
  const onShare = () => {
    // TODO: Change if deploying outside of VERCEL
    const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/tube/videos/${videoId}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Link copied to the clipboard');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon" className="rounded-full">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={onShare}>
          <ShareIcon className="mr-2 size-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>
          <ListPlusIcon className="mr-2 size-4" />
          Add to playlist
        </DropdownMenuItem>
        {onRemove && (
          <DropdownMenuItem onClick={() => {}}>
            <Trash2Icon className="mr-2 size-4" />
            Remove
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
