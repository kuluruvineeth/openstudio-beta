import { cn } from '@repo/design-system/lib/utils';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useState } from 'react';
import { YouTubeDescription } from './youtube-description';

interface VideoDescriptionProps {
  compactViews: string;
  expandedViews: string;
  compactDate: string;
  expandedDate: string;
  description?: string | null;
}

export const VideoDescription = ({
  compactViews,
  expandedViews,
  compactDate,
  expandedDate,
  description,
}: VideoDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      onClick={() => setIsExpanded((current) => !current)}
      className="cursor-pointer rounded-xl bg-secondary/50 p-3 transition hover:bg-secondary/70"
    >
      <div className="mb-2 flex gap-2 text-sm">
        <span className="font-medium">
          {isExpanded ? expandedViews : compactViews} views
        </span>
        <span className="font-medium">
          {isExpanded ? expandedDate : compactDate}
        </span>
      </div>
      <div className="relative">
        <p
          className={cn(
            'whitespace-pre-wrap text-sm',
            !isExpanded && 'line-clamp-2'
          )}
        >
          <YouTubeDescription>
            {description || 'No description'}
          </YouTubeDescription>
        </p>
        <div className="mt-4 flex items-center gap-1 font-medium text-sm">
          {isExpanded ? (
            <>
              Show less <ChevronUpIcon className="size-4" />
            </>
          ) : (
            <>
              Show more <ChevronDownIcon className="size-4" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
