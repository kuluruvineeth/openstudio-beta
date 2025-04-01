import { Button } from '@repo/design-system/components/ui/button';
import { Card } from '@repo/design-system/components/ui/card';
import { ChevronRight, Plus } from 'lucide-react';

import type { Profile } from '@/types';
import type { Resume } from '@/types';
import { cn } from '@repo/design-system/lib/utils';
import Link from 'next/link';
import { CreateResumeDialog } from '../dialogs/create-resume-dialog';
import { ResumeList } from './resume-list';

interface ResumeManagementCardProps {
  type: 'base' | 'tailored';
  resumes: Resume[];
  baseResumes?: Resume[];
  profile: Profile;
  icon: React.ReactNode;
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  gradientFrom: string;
  gradientTo: string;
  accentColor: {
    bg: string;
    border: string;
    hover: string;
    text: string;
  };
}

export function ResumeManagementCard({
  type,
  resumes,
  baseResumes,
  profile,
  icon,
  title,
  description,
  emptyTitle,
  emptyDescription,
  gradientFrom,
  gradientTo,
  accentColor,
}: ResumeManagementCardProps) {
  const isDisabled =
    type === 'tailored' && (!baseResumes || baseResumes.length === 0);
  const buttonText =
    type === 'base' ? 'New Base Resume' : 'New Tailored Resume';

  return (
    <Card
      className={cn(
        'group relative overflow-hidden',
        'border-2',
        `border-${accentColor.border}/40`,
        'shadow-xl backdrop-blur-xl hover:shadow-2xl',
        'transition-all duration-500',
        'rounded-xl'
      )}
    >
      {/* Multi-layered animated gradient background */}
      <div className="absolute inset-0 overflow-hidden rounded-[0.65rem]">
        {/* Primary gradient layer */}
        <div
          className={cn(
            'absolute inset-0 opacity-10 blur-3xl transition-opacity duration-500',
            `bg-gradient-to-br from-${gradientFrom}to-${gradientTo}`,
            'group-hover:opacity-20'
          )}
        />

        {/* Secondary floating orbs */}
        <div
          className={cn(
            '-inset-[100%] absolute opacity-30',
            'bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08)_0%,transparent_50%)]',
            'animate-[spin_8s_linear_infinite]'
          )}
        />
        <div
          className={cn(
            '-inset-[100%] absolute opacity-20',
            `bg-[radial-gradient(circle_at_70%_30%,${gradientFrom}15_0%,transparent_50%)]`,
            'animate-[spin_9s_linear_infinite]'
          )}
        />
      </div>

      {/* Header Section */}
      <div
        className={cn(
          'relative',
          'border-b',
          `border-${accentColor.border}/20`
        )}
      >
        {/* Background Pattern */}
        <div
          className={cn(
            'absolute inset-0',
            `bg-gradient-to-r from-${gradientFrom}/5 to-${gradientTo}/5`
          )}
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />
        </div>

        {/* Header Content */}
        <div className="relative flex items-start justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'rounded-xl border p-2.5 transition-all duration-300',
                `bg-gradient-to-br from-${gradientFrom}/5 via-${gradientTo}/10 to-${gradientFrom}/5`,
                `border-${accentColor.border}/30`,
                'group-hover:rotate-3 group-hover:scale-105',
                `shadow-lg shadow-${gradientFrom}/5`
              )}
            >
              <div
                className={cn(
                  `text-${accentColor.text}`,
                  'transition-transform duration-300 group-hover:scale-110',
                  'h-4 w-4'
                )}
              >
                {icon}
              </div>
            </div>
            <div>
              <h2
                className={cn(
                  'bg-clip-text font-semibold text-base text-transparent',
                  `bg-gradient-to-r from-${gradientFrom}to-${gradientTo}`,
                  'tracking-tight'
                )}
              >
                {title}
              </h2>
              <p className="mt-1 font-medium text-muted-foreground/80 text-xs">
                {description} •{' '}
                <span className="font-semibold">{resumes.length} active</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreateResumeDialog
              type={type}
              baseResumes={type === 'tailored' ? baseResumes : undefined}
              profile={profile}
            >
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'relative overflow-hidden transition-all duration-300',
                  'bg-gradient-to-br from-white/70 to-white/50',
                  `border-${accentColor.border}/40`,
                  `hover:border-${accentColor.hover}`,
                  'shadow-lg hover:shadow-xl',
                  'hover:-translate-y-0.5 transform',
                  'h-8 text-xs',
                  isDisabled && 'cursor-not-allowed opacity-50'
                )}
                disabled={isDisabled}
              >
                <Plus
                  className={cn(
                    'mr-1.5 h-3.5 w-3.5 transition-transform duration-300',
                    `text-${accentColor.text}`,
                    'group-hover:rotate-90'
                  )}
                />
                <span className="font-medium">{buttonText}</span>
              </Button>
            </CreateResumeDialog>
            <Link
              href={'/resume/resumes'}
              className={cn(
                'flex items-center gap-1 font-medium text-xs transition-colors duration-300',
                `text-${accentColor.text}/80 hover:text-${accentColor.text}`,
                'group/link'
              )}
            >
              View all
              <ChevronRight
                className={cn(
                  'h-3.5 w-3.5 transition-transform duration-300',
                  'group-hover/link:translate-x-0.5'
                )}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative flex flex-col">
        <div
          className={cn(
            'scrollbar-thin relative flex-1 overflow-y-auto',
            'scrollbar-thumb-white/20 scrollbar-track-transparent',
            'bg-gradient-to-b from-white/30 to-white/20 px-3 py-4'
          )}
        >
          <ResumeList
            resumes={resumes}
            title={title}
            type={type}
            accentColor={accentColor}
            className={cn(
              'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
              'auto-rows-[minmax(120px,1fr)]',
              'gap-3 pb-2'
            )}
            itemClassName={cn(
              'aspect-[8.5/11] w-full',
              'rounded-lg border',
              `border-${accentColor.border}/30`,
              'transition-all duration-300',
              'hover:border-opacity-50',
              'hover:-translate-y-0.5 hover:shadow-lg'
            )}
            emptyMessage={
              <div className="col-span-full flex min-h-[240px] items-center justify-center">
                <div className="mx-auto max-w-md px-4 text-center">
                  <div
                    className={cn(
                      'mx-auto mb-4',
                      'h-12 w-12 rounded-xl',
                      'flex items-center justify-center',
                      'transform transition-transform duration-500 hover:rotate-3 hover:scale-110',
                      `bg-gradient-to-br from-${gradientFrom}/10 via-white/10 to-${gradientTo}/10`,
                      `border border-${accentColor.border}/30`,
                      'shadow-xl'
                    )}
                  >
                    <div
                      className={cn(
                        `text-${accentColor.text}`,
                        'h-6 w-6 transition-transform duration-300 hover:scale-110'
                      )}
                    >
                      {icon}
                    </div>
                  </div>
                  <h3
                    className={cn(
                      'mb-2 font-semibold text-base',
                      'bg-clip-text text-transparent',
                      `bg-gradient-to-r from-${gradientFrom}to-${gradientTo}`
                    )}
                  >
                    {emptyTitle}
                  </h3>
                  <p className="mb-4 text-muted-foreground/80 text-xs leading-relaxed">
                    {emptyDescription}
                  </p>
                  <CreateResumeDialog
                    type={type}
                    baseResumes={type === 'tailored' ? baseResumes : undefined}
                    profile={profile}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        'relative overflow-hidden transition-all duration-300',
                        'bg-gradient-to-br from-white/70 to-white/50',
                        `border-${accentColor.border}/40`,
                        `hover:border-${accentColor.hover}`,
                        'shadow-lg hover:shadow-xl',
                        'hover:-translate-y-0.5 transform',
                        isDisabled && 'cursor-not-allowed opacity-50'
                      )}
                      disabled={isDisabled}
                    >
                      <Plus
                        className={cn(
                          'mr-1.5 h-4 w-4 transition-transform duration-300',
                          `text-${accentColor.text}`,
                          'group-hover:rotate-90'
                        )}
                      />
                      <span className="font-medium">{buttonText}</span>
                    </Button>
                  </CreateResumeDialog>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </Card>
  );
}
