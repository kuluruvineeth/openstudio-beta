import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/design-system/components/ui/button';
import { Icons } from '@repo/design-system/components/ui/icons';
import { Input } from '@repo/design-system/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/design-system/components/ui/popover';
import { cn } from '@repo/design-system/lib/utils';
import type { Editor } from '@tiptap/core';
import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface LinkSelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const linkSchema = z.object({
  link: z.string().url(),
});

type FormData = z.infer<typeof linkSchema>;

export default function LinkSelector({
  editor,
  isOpen,
  setIsOpen,
}: LinkSelectorProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(linkSchema),
    defaultValues: { link: editor.getAttributes('link').href },
  });

  const onSubmit = (data: FormData) => {
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: data.link })
      .run();
    setIsOpen(false);
  };
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        className={cn(
          'flex size-4.5 items-center justify-center rounded-md p-1 text-sm data-[state=open]:bg-gray-2',
          editor.getAttributes('link').href ? 'bg-gray-2' : ''
        )}
        onClick={() => setIsOpen(true)}
      >
        <Icons.link size={15} />
      </PopoverTrigger>
      <PopoverContent align="start" className="mt-1">
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full gap-1">
          <Input
            type="url"
            placeholder="url"
            className={cn('h-4.5', errors?.link ? 'border-danger' : '')}
            {...register('link')}
          />
          {editor.getAttributes('link').href ? (
            <Button
              type="button"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                reset();
              }}
              size="icon"
              className="min-w-4.5x"
              variant="destructive"
            >
              <Icons.trash size={15} />
            </Button>
          ) : (
            <Button
              type="submit"
              className="min-w-4.5"
              variant="ghost"
              size="icon"
            >
              <Icons.check size={18} />
            </Button>
          )}
        </form>
      </PopoverContent>
    </Popover>
  );
}
