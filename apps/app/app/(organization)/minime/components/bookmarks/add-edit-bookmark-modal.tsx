'use client';
import type { Bookmark as BookmarkType, Collection } from '@/helper/utils';
import { bookmarkFormSchema } from '@/lib/validations/bookmark';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@repo/design-system/components/minime/button';
import Input from '@repo/design-system/components/minime/input';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/design-system/components/ui/dialog';
import { Icons } from '@repo/design-system/components/ui/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/components/ui/select';
import { toast } from '@repo/design-system/components/ui/use-toast';
import { URLRegex } from '@repo/design-system/lib/utils';
import { cn } from '@repo/design-system/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type * as z from 'zod';

type FormData = z.infer<typeof bookmarkFormSchema>;

export type Bookmark = Pick<BookmarkType, 'id' | 'title' | 'url'> & {
  collection?: Collection;
};

export default function AddEditBookmarkModal({
  collections,
  bookmark,
  edit,
  open = false,
}: {
  collections?: Collection[];
  bookmark?: Bookmark;
  edit?: boolean;
  open?: boolean;
}) {
  const [showAddEditBookmarkModal, setShowAddEditBookmarkModal] =
    useState<boolean>(open);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!showAddEditBookmarkModal && open) {
      router.push('/minime/bookmarks');
    }
  }, [showAddEditBookmarkModal, open]);

  const { title, endpoint, method, successMessage } = useMemo(() => {
    if (edit && bookmark) {
      return {
        title: 'Edit bookmark',
        endpoint: `/api/bookmarks/${bookmark.id}`,
        method: 'PATCH',
        successMessage: 'Bookmark has been saved.',
      };
    }
    return {
      title: 'Add bookmark',
      endpoint: '/api/bookmarks',
      method: 'POST',
      successMessage: 'Bookmark has been added.',
    };
  }, [edit, bookmark]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(bookmarkFormSchema),
    defaultValues: {
      title: bookmark?.title,
      domain: bookmark?.url,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    const res = await fetch(endpoint, {
      method,
      body: JSON.stringify({
        title: data.title,
        url: URLRegex.test(data.domain)
          ? data.domain
          : `https://${data.domain}`,
        collection: data?.collection === 'all' ? null : data.collection,
      }),
    });

    setIsLoading(false);
    const body = await res.text();
    if (!res?.ok) {
      return toast({
        title: 'Something went wrong.',
        description: body,
      });
    }
    setShowAddEditBookmarkModal(false);
    reset();
    router.refresh();

    return toast({
      title: successMessage,
    });
  };

  return (
    <Dialog
      open={showAddEditBookmarkModal}
      onOpenChange={setShowAddEditBookmarkModal}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className={cn('justify-start gap-2')}
          aria-label={title}
        >
          {edit ? (
            <>
              <Icons.edit size={15} />
              Edit
            </>
          ) : (
            <>{title}</>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form
          id="add-edit-bookmark-form"
          className="flex flex-col gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            type="text"
            placeholder="Title"
            autoComplete="off"
            {...register('title')}
            disabled={isLoading}
          />
          {errors?.title && (
            <b className="text-danger text-xs">{errors.title.message}</b>
          )}
          <Input
            placeholder="Domain or URL"
            disabled={isLoading}
            {...register('domain')}
          />
          {errors?.domain && (
            <b className="text-danger text-xs">{errors.domain.message}</b>
          )}

          <Controller
            control={control}
            name="collection"
            render={({ field: { onChange } }) => (
              <Select
                onValueChange={onChange}
                defaultValue={bookmark?.collection?.id}
              >
                <SelectTrigger className="w-full text-gray-1">
                  <SelectValue placeholder="Select collection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {collections?.map((collection) => (
                    <SelectItem value={collection.id} key={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </form>
        <DialogFooter>
          <Button
            form="add-edit-bookmark-form"
            type="submit"
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Icons.spinner size={18} className="animate-spin" /> Saving
              </>
            ) : (
              <>Save</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
