'use client';
import type { Collection } from '@/helper/utils';
import Button from '@repo/design-system/components/minime/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@repo/design-system/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { Icons } from '@repo/design-system/components/ui/icons';
import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';

import { toast } from '@repo/design-system/components/ui/use-toast';
import AddEditBookmarkModal, { type Bookmark } from './add-edit-bookmark-modal';

interface Props {
  bookmark: Bookmark;
  collections?: Collection[];
}

async function deleteBookmark(bookmarkId: string) {
  const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
    method: 'DELETE',
  });

  if (!response?.ok) {
    toast({
      title: 'Something went wrong.',
      description: 'Your post was not deleted. Please try again.',
    });
  }

  return true;
}

export default function BookmarkOperations({ bookmark, collections }: Props) {
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const router = useRouter();

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger aria-label="Bookmark Operations" asChild>
          <Button
            size="icon"
            variant="ghost"
            className="size-4.4 data-[state=open]:bg-gray-2 data-[state=open]:text-secondary"
          >
            <Icons.more size={15} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <AddEditBookmarkModal
            bookmark={bookmark}
            collections={collections}
            edit
          />
          <Button
            size="sm"
            variant="destructive"
            className="justify-start gap-2 border-0"
            onClick={() => setShowDeleteAlert(true)}
          >
            <Icons.trash size={15} /> Delete
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this bookmark?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              title="Cancel"
              variant="ghost"
              size="sm"
              disabled={isDeleteLoading}
              onClick={() => setShowDeleteAlert(false)}
            />

            <Button
              variant="destructive"
              size="sm"
              onClick={async (e: FormEvent) => {
                e.preventDefault();
                setIsDeleteLoading(true);
                const deleted = await deleteBookmark(bookmark.id);
                if (deleted) {
                  setIsDeleteLoading(false);
                  setShowDeleteAlert(false);
                  router.refresh();
                }
                setIsDeleteLoading(false);
              }}
              disabled={isDeleteLoading}
            >
              {isDeleteLoading ? (
                <>
                  <Icons.spinner size={15} className="animate-spin" />{' '}
                  Deleting...
                </>
              ) : (
                <>
                  <Icons.trash size={15} /> Delete
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
