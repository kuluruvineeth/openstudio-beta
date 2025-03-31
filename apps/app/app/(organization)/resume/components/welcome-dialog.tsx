'use client';

import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/design-system/components/ui/dialog';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

interface WelcomeDialogProps {
  isOpen: boolean;
}

export function WelcomeDialog({ isOpen: initialIsOpen }: WelcomeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [viewedWelcomeDialog, setViewedWelcomeDialog] = useLocalStorage(
    'viewedResumeWelcomeDialog',
    false
  );

  const handleClose = () => {
    setViewedWelcomeDialog(true);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!viewedWelcomeDialog) {
      setIsOpen(initialIsOpen);
    }
  }, [initialIsOpen, viewedWelcomeDialog]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text font-semibold text-2xl text-transparent">
            Welcome to Open Studio Resume! 🎉
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <h3 className="font-medium text-foreground">
            Here&apos;s how to get started:
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-cyan-100">
                <span className="bg-gradient-to-br from-teal-600 to-cyan-600 bg-clip-text font-semibold text-sm text-transparent">
                  1
                </span>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-muted-foreground">
                  Fill out your profile with your work experience, education,
                  and skills
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-indigo-100">
                <span className="bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text font-semibold text-sm text-transparent">
                  2
                </span>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-muted-foreground">
                  Create base resumes for different types of roles you&apos;re
                  interested in
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-rose-100">
                <span className="bg-gradient-to-br from-pink-600 to-rose-600 bg-clip-text font-semibold text-sm text-transparent">
                  3
                </span>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-muted-foreground">
                  Use your base resumes to create tailored versions for specific
                  job applications
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <Link href="/resume/profile" onClick={handleClose}>
              <Button className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
                Start by Filling Your Profile
              </Button>
            </Link>
            <Button variant="outline" className="w-full" onClick={handleClose}>
              I&apos;ll do this later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
