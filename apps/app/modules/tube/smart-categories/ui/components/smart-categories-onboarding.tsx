'use client';

import { useOnboarding } from '@/components/onboarding-modal';
import { Button } from '@repo/design-system/components/ui/button';
import { CardBasic } from '@repo/design-system/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@repo/design-system/components/ui/dialog';
import {
  ArchiveIcon,
  MessageCircleIcon,
  UsersIcon,
  ZapIcon,
} from 'lucide-react';

export function SmartCategoriesOnboarding() {
  const { isOpen, setIsOpen, onClose } = useOnboarding('SmartCategories');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to Smart Comment Management</DialogTitle>
          <DialogDescription>
            Automatically categorize both commenters and their comments for
            better moderation, engagement, and automation.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 sm:gap-4">
          <CardBasic className="flex items-center">
            <UsersIcon className="mr-3 h-5 w-5" />
            Auto-categorize commenters (Fans, Critics, Spammers, etc.)
          </CardBasic>
          <CardBasic className="flex items-center">
            <MessageCircleIcon className="mr-3 h-5 w-5" />
            Auto-categorize comments (Questions, Appreciation, Spam, etc.)
          </CardBasic>
          <CardBasic className="flex items-center">
            <ArchiveIcon className="mr-3 h-5 w-5" />
            Bulk manage comments by category
          </CardBasic>
          <CardBasic className="flex items-center">
            <ZapIcon className="mr-3 h-5 w-5" />
            Use categories to optimize AI-powered automation
          </CardBasic>
        </div>
        <div>
          <Button className="w-full" onClick={onClose}>
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
