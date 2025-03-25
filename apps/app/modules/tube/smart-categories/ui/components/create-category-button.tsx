'use client';

import {
  createCommentCategoryAction,
  createCommenterCategoryAction,
} from '@/actions/categories';
import {
  type CreateCategoryBody,
  createCategoryBody,
} from '@/actions/categories/validation';
import { useModal } from '@/hooks/use-modal';
import { isActionError } from '@/lib/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import type {
  commentCategoryTable,
  commenterCategoryTable,
} from '@repo/backend/schema';
import { Input } from '@repo/design-system/components/input';
import { toastError, toastSuccess } from '@repo/design-system/components/toast';
import {
  Button,
  type ButtonProps,
} from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/design-system/components/ui/dialog';
import { MessageText } from '@repo/design-system/components/ui/typography';
import { PlusIcon } from 'lucide-react';
import { useCallback } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

type ExampleCategory = {
  name: string;
  description: string;
};

const COMMENTER_CATEGORIES: ExampleCategory[] = [
  {
    name: 'Frequent Commenter',
    description:
      'Users who regularly comment on videos, contributing to discussions and engagement.',
  },
  {
    name: 'New Commenter',
    description:
      'Users who have recently started commenting, indicating fresh engagement.',
  },
  {
    name: 'Influencer',
    description: 'Users with a significant following who engage with content.',
  },
  {
    name: 'Verified User',
    description:
      'Commenters with a verified badge, often official accounts or influencers.',
  },
  {
    name: 'Spam Account',
    description:
      'Users who frequently post promotional or irrelevant comments.',
  },
  {
    name: 'Toxic User',
    description: 'Users identified for posting offensive or harmful comments.',
  },
];

const COMMENT_CATEGORIES: ExampleCategory[] = [
  {
    name: 'Appreciation',
    description: 'Comments expressing gratitude, praise, or positive feedback.',
  },
  {
    name: 'Question',
    description: 'Comments that ask for clarification or more information.',
  },
  {
    name: 'Criticism',
    description: 'Constructive or negative feedback on the content.',
  },
  {
    name: 'Humorous',
    description: 'Comments intended to be funny or entertaining.',
  },
  {
    name: 'Support Request',
    description: 'Users asking for help or assistance with a topic.',
  },
  {
    name: 'Spam',
    description: 'Irrelevant or promotional content.',
  },
  {
    name: 'Offensive',
    description:
      'Comments containing harmful, hateful, or inappropriate content.',
  },
];

export function CreateCategoryButton({
  buttonProps,
  type,
}: {
  buttonProps?: ButtonProps;
  type: 'commenter' | 'comment';
}) {
  const { isModalOpen, openModal, closeModal, setIsModalOpen } = useModal();

  return (
    <div>
      <Button onClick={openModal} variant="outline" {...buttonProps}>
        {buttonProps?.children ?? (
          <>
            <PlusIcon className="mr-2 size-4" />
            Add
          </>
        )}
      </Button>

      <CreateCategoryDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        closeModal={closeModal}
        type={type}
      />
    </div>
  );
}

export function CreateCategoryDialog({
  category,
  isOpen,
  onOpenChange,
  closeModal,
  type,
}: {
  category?: Pick<
    | typeof commenterCategoryTable.$inferSelect
    | typeof commentCategoryTable.$inferSelect,
    'name' | 'description'
  > & { id?: string };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  closeModal: () => void;
  type: 'commenter' | 'comment';
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>

        <CreateCategoryForm
          category={category}
          closeModal={closeModal}
          type={type}
        />
      </DialogContent>
    </Dialog>
  );
}

function CreateCategoryForm({
  category,
  closeModal,
  type,
}: {
  category?: Pick<
    | typeof commenterCategoryTable.$inferSelect
    | typeof commentCategoryTable.$inferSelect,
    'name' | 'description'
  > & { id?: string };
  closeModal: () => void;
  type: 'commenter' | 'comment';
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateCategoryBody>({
    resolver: zodResolver(createCategoryBody),
    defaultValues: {
      id: category?.id,
      name: category?.name,
      description: category?.description,
    },
  });

  const handleExampleClick = useCallback(
    (category: ExampleCategory) => {
      setValue('name', category.name);
      setValue('description', category.description);
    },
    [setValue]
  );

  const onSubmit: SubmitHandler<CreateCategoryBody> = useCallback(
    async (data) => {
      const action =
        type === 'commenter'
          ? createCommenterCategoryAction
          : createCommentCategoryAction;
      const result = await action(data);

      if (isActionError(result)) {
        toastError({
          description: `There was an error creating the category. ${result.error}`,
        });
      } else {
        toastSuccess({
          description: category ? 'Category updated!' : 'Category created!',
        });
        closeModal();
      }
    },
    [closeModal, type, category]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        type="text"
        name="name"
        label="Name"
        registerProps={register('name', { required: true })}
        error={errors.name}
      />
      <Input
        type="text"
        autosizeTextarea
        rows={2}
        name="description"
        label="Description (Optional)"
        explainText="Additional information used by the AI to categorize senders"
        registerProps={register('description')}
        error={errors.description}
      />

      <div className="rounded border border-border bg-muted/50 p-3">
        <div className="font-medium text-xs">Examples</div>
        <div className="mt-1 flex flex-wrap gap-2">
          {type === 'commenter'
            ? COMMENTER_CATEGORIES.map((category) => (
                <Button
                  key={category.name}
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => handleExampleClick(category)}
                >
                  <PlusIcon className="mr-1 size-2" />
                  {category.name}
                </Button>
              ))
            : COMMENT_CATEGORIES.map((category) => (
                <Button
                  key={category.name}
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => handleExampleClick(category)}
                >
                  <PlusIcon className="mr-1 size-2" />
                  {category.name}
                </Button>
              ))}
        </div>
      </div>

      {category && (
        <MessageText>
          Note: editing a category name/description only impacts future
          categorization. Existing email addresses in this category will not be
          affected.
        </MessageText>
      )}

      <Button type="submit" loading={isSubmitting}>
        {category ? 'Update' : 'Create'}
      </Button>
    </form>
  );
}
