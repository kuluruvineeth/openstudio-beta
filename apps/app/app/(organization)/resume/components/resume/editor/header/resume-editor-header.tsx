'use client';

import type { Resume } from '@/types';
import { Logo } from '@repo/design-system/components/logo';
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
import { cn } from '@repo/design-system/lib/utils';
import { useRouter } from 'next/navigation';

interface ResumeEditorHeaderProps {
  resume: Resume;
  hasUnsavedChanges: boolean;
}

export function ResumeEditorHeader({
  resume,
  hasUnsavedChanges,
}: ResumeEditorHeaderProps) {
  const router = useRouter();
  const capitalizeWords = (str: string) => {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleBackClick = () => {
    if (!hasUnsavedChanges) {
      router.push('/');
    }
  };

  // Dynamic color classes based on resume type
  const colors = resume.isBaseResume
    ? {
        gradient: 'from-purple-600 via-purple-500 to-indigo-600',
        border: 'border-purple-200/50',
        background: 'from-purple-50/95 via-white/95 to-purple-50/95',
        shadow: 'shadow-purple-500/10',
        text: 'text-purple-600',
        hover: 'hover:text-purple-600',
        textOpacity: 'text-purple-600/60',
        gradientOverlay: '#f3e8ff30',
      }
    : {
        gradient: 'from-pink-600 via-pink-500 to-rose-600',
        border: 'border-pink-200/50',
        background: 'from-pink-50/95 via-white/95 to-pink-50/95',
        shadow: 'shadow-pink-500/10',
        text: 'text-pink-600',
        hover: 'hover:text-pink-600',
        textOpacity: 'text-pink-600/60',
        gradientOverlay: '#fce7f330',
      };

  return (
    <div
      className={cn(
        'fixed right-0 left-0 z-40 h-20 border-b shadow-lg backdrop-blur-xl',
        colors.border,
        `bg-gradient-to-r ${colors.background}`,
        colors.shadow
      )}
    >
      {/* Gradient Overlays */}
      <div
        className={cn(
          'absolute inset-0',
          `bg-[linear-gradient(to_right,${colors.gradientOverlay}_0%,#ffffff40_50%,${colors.gradientOverlay}_100%)]`,
          'pointer-events-none'
        )}
      />
      <div
        className={cn(
          'absolute inset-0',
          `bg-[radial-gradient(circle_800px_at_50%_-40%,${colors.gradientOverlay}_0%,transparent_100%)]`,
          'pointer-events-none'
        )}
      />
      <div
        className={cn(
          'absolute inset-0',
          `bg-[radial-gradient(circle_600px_at_100%_100%,${colors.gradientOverlay}_0%,transparent_100%)]`,
          'pointer-events-none'
        )}
      />

      {/* Content Container */}
      <div className="relative mx-auto flex h-full max-w-[2000px] items-center justify-between px-6">
        {/* Left Section - Logo, Title  */}
        <div className="flex items-center gap-6">
          {hasUnsavedChanges ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div>
                  <Logo className="cursor-pointer text-xl" />
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
                  <AlertDialogDescription>
                    You have unsaved changes. Are you sure you want to leave?
                    Your changes will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => router.push('/')}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Leave
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            // biome-ignore lint/nursery/noStaticElementInteractions: <explanation>
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div onClick={handleBackClick}>
              <Logo className="cursor-pointer text-xl" />
            </div>
          )}
          <div className="hidden h-8 w-px bg-purple-200/50 sm:block" />
          <div className="flex flex-col justify-center gap-1">
            {/* Resume Title Section */}
            <div className="flex flex-col ">
              <h1 className="font-semibold text-xl">
                <span
                  className={cn(
                    'bg-gradient-to-r bg-clip-text text-transparent',
                    colors.gradient
                  )}
                >
                  {resume.isBaseResume
                    ? capitalizeWords(resume.targetRole)
                    : resume.name}
                </span>
              </h1>
              <div className={cn('flex text-sm', colors.textOpacity)}>
                {resume.isBaseResume ? (
                  <div className="flex items-center">
                    <span className="font-medium text-xs">Base Resume</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs">Tailored Resume</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
