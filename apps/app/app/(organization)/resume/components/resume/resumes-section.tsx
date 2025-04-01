'use client';

import { copyResume, deleteResume } from '@/actions/resume';
import { CreateResumeDialog } from '@/app/(organization)/resume/components/resume/management/dialogs/create-resume-dialog';
import {
  ResumeSortControls,
  type SortDirection,
  type SortOption,
} from '@/app/(organization)/resume/components/resume/management/resume-sort-controls';
import { MiniResumePreview } from '@/app/(organization)/resume/components/resume/shared/mini-resume-preview';
import type { Profile, Resume } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/design-system/components/ui/alert-dialog';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@repo/design-system/components/ui/carousel';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@repo/design-system/components/ui/pagination';
import { cn } from '@repo/design-system/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  FileText,
  Sparkles,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface ResumesSectionProps {
  type: 'base' | 'tailored';
  resumes: Resume[];
  profile: Profile;
  sortParam: string;
  directionParam: string;
  currentSort: SortOption;
  currentDirection: SortDirection;
  baseResumes?: Resume[]; // Only needed for tailored type
  canCreateMore?: boolean;
}

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
}

export function ResumesSection({
  type,
  resumes,
  profile,
  sortParam,
  directionParam,
  currentSort,
  currentDirection,
  baseResumes = [],
  canCreateMore,
}: ResumesSectionProps) {
  const config = {
    base: {
      gradient: 'from-purple-600 to-indigo-600',
      border: 'border-purple-300',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      icon: FileText,
      accent: {
        bg: 'purple-100',
        hover: 'purple-100/50',
      },
    },
    tailored: {
      gradient: 'from-pink-600 to-rose-600',
      border: 'border-pink-300',
      bg: 'bg-pink-50',
      text: 'text-pink-600',
      icon: Sparkles,
      accent: {
        bg: 'pink-100',
        hover: 'pink-100/50',
      },
    },
  }[type];

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 7,
  });

  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const endIndex = startIndex + pagination.itemsPerPage;
  const paginatedResumes = resumes.slice(startIndex, endIndex);

  function handlePageChange(page: number) {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  }

  // Create Resume Card Component
  const CreateResumeCard = () => (
    <CreateResumeDialog
      type={type}
      profile={profile}
      {...(type === 'tailored' && { baseResumes })}
    >
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button
        className={cn(
          'aspect-[8.5/11] rounded-lg',
          'relative overflow-hidden',
          'border-2 border-dashed transition-all duration-500',
          'group/new-resume flex flex-col items-center justify-center gap-4',
          type === 'base'
            ? 'border-purple-300/70 hover:border-purple-400'
            : 'border-pink-300/70 hover:border-pink-400',
          type === 'base'
            ? 'bg-gradient-to-br from-purple-50/80 via-purple-50/40 to-purple-100/60'
            : 'bg-gradient-to-br from-pink-50/80 via-pink-50/40 to-pink-100/60',
          'hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-100/50',
          'after:absolute after:inset-0 after:bg-gradient-to-br',
          type === 'base'
            ? 'after:from-purple-600/[0.03] after:to-indigo-600/[0.03]'
            : 'after:from-pink-600/[0.03] after:to-rose-600/[0.03]',
          'mr-8 w-full after:opacity-0 after:transition-opacity after:duration-500 hover:after:opacity-100 sm:mr-0 sm:w-auto'
        )}
      >
        <div
          className={cn(
            'relative z-10 flex flex-col items-center',
            'transform transition-all duration-500',
            'group-hover/new-resume:scale-105'
          )}
        >
          <div
            className={cn(
              'h-12 w-12 rounded-xl',
              'flex items-center justify-center',
              'transform transition-all duration-500',
              'shadow-sm group-hover/new-resume:shadow-md',
              type === 'base'
                ? 'bg-gradient-to-br from-purple-100 to-purple-50'
                : 'bg-gradient-to-br from-pink-100 to-pink-50',
              'group-hover/new-resume:scale-110'
            )}
          >
            <config.icon
              className={cn(
                'h-5 w-5 transition-all duration-500',
                type === 'base' ? 'text-purple-600' : 'text-pink-600',
                'group-hover/new-resume:scale-110'
              )}
            />
          </div>

          <span
            className={cn(
              'mt-4 font-medium text-sm',
              'transition-all duration-500',
              type === 'base' ? 'text-purple-600' : 'text-pink-600',
              'group-hover/new-resume:font-semibold'
            )}
          >
            Create {type === 'base' ? 'Base' : 'Tailored'} Resume
          </span>

          <span
            className={cn(
              'mt-2 text-xs',
              'opacity-0 transition-all duration-500',
              type === 'base' ? 'text-purple-500' : 'text-pink-500',
              'group-hover/new-resume:opacity-70'
            )}
          >
            Click to start
          </span>
        </div>
      </button>
    </CreateResumeDialog>
  );

  // Limit Reached Card Component
  const LimitReachedCard = () => (
    <Link
      href="/subscription"
      className={cn(
        'group/limit block',
        'cursor-pointer',
        'transition-all duration-500',
        'hover:-translate-y-1'
      )}
    >
      <div
        className={cn(
          'aspect-[8.5/11] rounded-lg',
          'relative overflow-hidden',
          'border-2 border-dashed',
          'flex flex-col items-center justify-center gap-4',
          'border-amber-600/80',
          'bg-gradient-to-br from-amber-50/80 via-amber-50/40 to-amber-100/60',
          'transition-all duration-500',
          'hover:shadow-amber-200/20 hover:shadow-xl',
          'hover:border-amber-600/90',
          'after:absolute after:inset-0 after:bg-gradient-to-br',
          'after:from-amber-600/[0.03] after:to-orange-600/[0.03]',
          'after:opacity-40 after:transition-opacity after:duration-500',
          'hover:after:opacity-60'
        )}
      >
        <div
          className={cn(
            'relative z-10 flex flex-col items-center',
            'transform transition-all duration-500',
            'group-hover/limit:scale-105'
          )}
        >
          <div
            className={cn(
              'h-12 w-12 rounded-xl',
              'flex items-center justify-center',
              'bg-gradient-to-br from-amber-100 to-amber-50',
              'text-amber-600',
              'shadow-md',
              'transition-all duration-500',
              'group-hover/limit:shadow-lg',
              'group-hover/limit:bg-gradient-to-br',
              'group-hover/limit:from-amber-200',
              'group-hover/limit:to-amber-100',
              'group-hover/limit:-translate-y-1'
            )}
          >
            <config.icon
              className={cn(
                'h-5 w-5',
                'transition-all duration-500',
                'group-hover/limit:scale-110'
              )}
            />
          </div>
          <span
            className={cn(
              'mt-4 font-medium text-sm',
              'text-amber-600',
              'transition-all duration-500',
              'group-hover/limit:text-amber-700'
            )}
          >
            {type === 'base' ? 'Base' : 'Tailored'} Limit Reached
          </span>
          <span
            className={cn(
              'mt-2 text-xs',
              'text-amber-600/70',
              'underline underline-offset-4',
              'transition-all duration-300',
              'group-hover/limit:text-amber-700/90'
            )}
          >
            Upgrade to create more
          </span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="relative ">
      <div className="flex w-full flex-col gap-4">
        <div className="relative flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <h2
            className={`bg-gradient-to-r font-semibold text-2xl tracking-tight sm:text-3xl ${config.gradient} bg-clip-text text-transparent`}
          >
            {type === 'base' ? 'Base' : 'Tailored'} Resumes
          </h2>
          <div className="mb-4 flex items-center gap-2">
            <ResumeSortControls
              sortParam={sortParam}
              directionParam={directionParam}
              currentSort={currentSort}
              currentDirection={currentDirection}
            />
          </div>
        </div>

        {/* Desktop Pagination (hidden on mobile) */}
        {resumes.length > pagination.itemsPerPage && (
          <div className="-mt-4 hidden w-full items-start justify-start md:flex">
            <Pagination className="flex justify-end">
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </PaginationItem>

                {Array.from({
                  length: Math.ceil(resumes.length / pagination.itemsPerPage),
                }).map((_, index) => {
                  const pageNumber = index + 1;
                  const totalPages = Math.ceil(
                    resumes.length / pagination.itemsPerPage
                  );

                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= pagination.currentPage - 1 &&
                      pageNumber <= pagination.currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={index}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePageChange(pageNumber)}
                          className={cn(
                            'h-8 w-8 p-0',
                            'text-muted-foreground hover:text-foreground',
                            pagination.currentPage === pageNumber &&
                              'font-medium text-foreground'
                          )}
                        >
                          {pageNumber}
                        </Button>
                      </PaginationItem>
                    );
                  }

                  if (
                    (pageNumber === 2 && pagination.currentPage > 3) ||
                    (pageNumber === totalPages - 1 &&
                      pagination.currentPage < totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={index}>
                        <span className="px-2 text-muted-foreground">...</span>
                      </PaginationItem>
                    );
                  }

                  return null;
                })}

                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={
                      pagination.currentPage ===
                      Math.ceil(resumes.length / pagination.itemsPerPage)
                    }
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <div className="relative pb-6">
        {/* Mobile View */}
        <div className="w-full space-y-6 md:hidden">
          {/* Mobile Create Resume Button Row */}
          {canCreateMore ? (
            <div className="flex w-full px-2">
              <CreateResumeCard />
            </div>
          ) : (
            <div className="w-full px-4">
              <LimitReachedCard />
            </div>
          )}

          {/* Mobile Resumes Carousel */}
          {paginatedResumes.length > 0 && (
            <div className="w-full">
              <Carousel className="w-full">
                <CarouselContent>
                  {paginatedResumes.map((resume) => (
                    <CarouselItem key={resume.id} className="basis-[85%] pl-4">
                      <div className="group relative">
                        <AlertDialog>
                          <div className="relative">
                            <Link href={`/resume/resumes/${resume.id}`}>
                              <MiniResumePreview
                                name={resume.name}
                                type={type}
                                targetRole={resume.targetRole}
                                createdAt={resume.createdAt}
                                className="hover:-translate-y-1 transition-transform duration-300"
                              />
                            </Link>
                            <div className="absolute bottom-2 left-2 flex gap-2">
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className={cn(
                                    'h-8 w-8 rounded-lg',
                                    'bg-rose-50/80 hover:bg-rose-100/80',
                                    'text-rose-600 hover:text-rose-700',
                                    'border border-rose-200/60',
                                    'shadow-sm',
                                    'transition-all duration-300',
                                    'hover:scale-105 hover:shadow-md',
                                    'hover:-translate-y-0.5'
                                  )}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <form
                                action={async () => {
                                  await copyResume(resume.id);
                                }}
                              >
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  type="submit"
                                  className={cn(
                                    'h-8 w-8 rounded-lg',
                                    'bg-teal-50/80 hover:bg-teal-100/80',
                                    'text-teal-600 hover:text-teal-700',
                                    'border border-teal-200/60',
                                    'shadow-sm',
                                    'transition-all duration-300',
                                    'hover:scale-105 hover:shadow-md',
                                    'hover:-translate-y-0.5'
                                  )}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </form>
                            </div>
                          </div>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Resume</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;
                                {resume.name}&quot;? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <form
                                action={async () => {
                                  await deleteResume(resume.id);
                                }}
                              >
                                <AlertDialogAction
                                  type="submit"
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </form>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden sm:block">
                  <CarouselPrevious className="-left-12 absolute top-1/2" />
                  <CarouselNext className="-right-12 absolute top-1/2" />
                </div>
              </Carousel>
            </div>
          )}
        </div>

        {/* Desktop Grid View */}
        <div className="hidden grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid md:grid-cols-3 lg:grid-cols-4">
          {canCreateMore ? <CreateResumeCard /> : <LimitReachedCard />}

          {paginatedResumes.map((resume) => (
            <div key={resume.id} className="group relative">
              <AlertDialog>
                <div className="relative">
                  <Link href={`/resume/resumes/${resume.id}`}>
                    <MiniResumePreview
                      name={resume.name}
                      type={type}
                      targetRole={resume.targetRole}
                      createdAt={resume.createdAt}
                      className="hover:-translate-y-1 transition-transform duration-300"
                    />
                  </Link>
                  <div className="absolute bottom-2 left-2 flex gap-2">
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={cn(
                          'h-8 w-8 rounded-lg',
                          'bg-rose-50/80 hover:bg-rose-100/80',
                          'text-rose-600 hover:text-rose-700',
                          'border border-rose-200/60',
                          'shadow-sm',
                          'transition-all duration-300',
                          'hover:scale-105 hover:shadow-md',
                          'hover:-translate-y-0.5'
                        )}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <form
                      action={async () => {
                        await copyResume(resume.id);
                      }}
                    >
                      <Button
                        size="icon"
                        variant="ghost"
                        type="submit"
                        className={cn(
                          'h-8 w-8 rounded-lg',
                          'bg-teal-50/80 hover:bg-teal-100/80',
                          'text-teal-600 hover:text-teal-700',
                          'border border-teal-200/60',
                          'shadow-sm',
                          'transition-all duration-300',
                          'hover:scale-105 hover:shadow-md',
                          'hover:-translate-y-0.5'
                        )}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </div>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Resume</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete &quot;{resume.name}&quot;?
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <form
                      action={async () => {
                        await deleteResume(resume.id);
                      }}
                    >
                      <AlertDialogAction
                        type="submit"
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </form>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
          {resumes.length === 0 && resumes.length + 1 < 4 && (
            <div className="col-span-2 md:col-span-1" />
          )}
        </div>
      </div>
    </div>
  );
}
