import type { Resume } from '@/types';
import { cn } from '@repo/design-system/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';

interface ResumeListProps {
  resumes: Resume[];
  title: string;
  type: 'base' | 'tailored';
  accentColor: {
    bg: string;
    border: string;
    hover: string;
    text: string;
  };
  emptyMessage: React.ReactNode;
  className?: string;
  itemClassName?: string;
}

export function ResumeList({
  resumes,
  type,
  accentColor,
  emptyMessage,
  className,
  itemClassName,
}: ResumeListProps) {
  if (!resumes || resumes.length === 0) {
    return emptyMessage;
  }

  return (
    <div className={cn('grid grid-cols-1 gap-4', className)}>
      {resumes.map((resume) => (
        <Link
          key={resume.id}
          href={`/resume/resumes/${resume.id}`}
          className={cn(
            'group relative overflow-hidden rounded-lg border transition-all duration-300',
            'bg-white/50 hover:bg-white/60',
            `border-${accentColor.border}`,
            `hover:border-${accentColor.hover}`,
            'shadow-sm hover:shadow-md',
            'hover:-translate-y-0.5 transform',
            itemClassName
          )}
        >
          <div className="absolute inset-0 p-1.5">
            {/* Resume Header */}
            <div className="mb-1 border-gray-200/70 border-b pb-1">
              <div className="font-medium text-[12px] text-gray-800">
                {type === 'base' ? resume.targetRole : resume.name}
              </div>
              <div className="mb-1 flex items-center gap-0.5 truncate text-[10px] text-muted-foreground">
                <span className={`text-${accentColor.text} font-bold`}>
                  {type === 'base' ? 'Base Resume' : 'Tailored Resume'}
                </span>
              </div>
              <div className="h-1 w-12 rounded-full bg-gray-200/70" />
            </div>

            {/* Resume Content */}
            <div className="space-y-1">
              {/* Experience Section */}
              <div>
                <div className="mb-0.5 h-1 w-8 rounded-full bg-gray-300/70" />
                <div className="space-y-0.5">
                  <div className="h-0.5 w-full rounded-full bg-gray-200/70" />
                  <div className="h-0.5 w-3/4 rounded-full bg-gray-200/70" />
                  <div className="h-0.5 w-5/6 rounded-full bg-gray-200/70" />
                </div>
              </div>

              {/* Education Section */}
              <div>
                <div className="mb-0.5 h-1 w-8 rounded-full bg-gray-300/70" />
                <div className="space-y-0.5">
                  <div className="h-0.5 w-full rounded-full bg-gray-200/70" />
                  <div className="h-0.5 w-2/3 rounded-full bg-gray-200/70" />
                </div>
              </div>

              {/* Skills Section */}
              <div>
                <div className="mb-0.5 h-1 w-8 rounded-full bg-gray-300/70" />
                <div className="flex flex-wrap gap-0.5">
                  <div className="h-1 w-6 rounded-full bg-gray-200/70" />
                  <div className="h-1 w-8 rounded-full bg-gray-200/70" />
                  <div className="h-1 w-4 rounded-full bg-gray-200/70" />
                  <div className="h-1 w-6 rounded-full bg-gray-200/70" />
                </div>
              </div>
            </div>

            {/* Date at bottom left */}
            <div className="absolute bottom-0 left-0 p-0.5">
              <p className="text-[10px] text-muted-foreground">
                Updated {format(new Date(resume.updatedAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
