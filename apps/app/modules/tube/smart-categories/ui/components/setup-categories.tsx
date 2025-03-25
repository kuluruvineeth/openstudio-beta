'use client';

import {
  deleteCommentCategoryAction,
  deleteCommenterCategoryAction,
  upsertDefaultCategoriesAction,
} from '@/actions/categories';
import {
  defaultCommentCategory,
  defaultCommenterCategory,
} from '@/lib/utils/categories';
import type { commenterCategoryTable } from '@repo/backend/schema';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { TypographyH4 } from '@repo/design-system/components/ui/typography';
import { cn } from '@repo/design-system/lib/utils';
import uniqBy from 'lodash/uniqBy';
import { PenIcon, PlusIcon, TagsIcon, TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import {
  CreateCategoryButton,
  CreateCategoryDialog,
} from './create-category-button';
type CardCategory = Pick<
  typeof commenterCategoryTable.$inferSelect,
  'name' | 'description'
> & {
  id?: string;
  enabled?: boolean;
  isDefault?: boolean;
};

const defaultCommenterCategories = Object.values(defaultCommenterCategory).map(
  (c) => ({
    name: c.name,
    description: c.description,
    enabled: c.enabled,
    isDefault: true,
  })
);

const defaultCommentCategories = Object.values(defaultCommentCategory).map(
  (c) => ({
    name: c.name,
    description: c.description,
    enabled: c.enabled,
    isDefault: true,
  })
);

export function SetUpCategories({
  existingCommenterCategories,
  existingCommentCategories,
}: {
  existingCommenterCategories: CardCategory[];
  existingCommentCategories: CardCategory[];
}) {
  const combineCategories = (
    defaultCategories: CardCategory[],
    existingCategories: CardCategory[]
  ) =>
    uniqBy(
      [
        ...defaultCategories.map((c) => {
          const existing = existingCategories.find((e) => e.name === c.name);
          if (existing) {
            return { ...existing, enabled: true, isDefault: false };
          }
          return {
            ...c,
            id: undefined,
            enabled: c.enabled && !existingCategories.length,
          };
        }),
        ...existingCategories,
      ],
      (c) => c.name
    );

  const commenterCategories = combineCategories(
    defaultCommenterCategories,
    existingCommenterCategories
  );
  const commentCategories = combineCategories(
    defaultCommentCategories,
    existingCommentCategories
  );

  const [commenterCategoryState, setCommenterCategoryState] = useState(
    new Map(
      commenterCategories.map((c) => [c.name, !c.isDefault || !!c.enabled])
    )
  );

  const [commentCategoryState, setCommentCategoryState] = useState(
    new Map(commentCategories.map((c) => [c.name, !c.isDefault || !!c.enabled]))
  );

  const [selectedCommenterCategory, setSelectedCommenterCategory] =
    useQueryState('selectedCommenterCategory');
  const [selectedCommentCategory, setSelectedCommentCategory] = useQueryState(
    'selectedCommentCategory'
  );

  // Update categories when existingCategories changes
  // This is a bit messy that we need to do this
  useEffect(() => {
    setCommenterCategoryState((prevCategories) => {
      const newCategories = new Map(prevCategories);

      // Enable any new categories from existingCategories that aren't in the current map
      for (const category of existingCommenterCategories) {
        if (!prevCategories.has(category.name)) {
          newCategories.set(category.name, true);
        }
      }

      // Disable any categories that aren't in existingCategories
      if (existingCommenterCategories.length) {
        for (const category of prevCategories.keys()) {
          if (!existingCommenterCategories.some((c) => c.name === category)) {
            newCategories.set(category, false);
          }
        }
      }

      return newCategories;
    });
  }, [existingCommenterCategories]);

  useEffect(() => {
    setCommentCategoryState((prevCategories) => {
      const newCategories = new Map(prevCategories);

      // Enable any new categories from existingCategories that aren't in the current map
      for (const category of existingCommentCategories) {
        if (!prevCategories.has(category.name)) {
          newCategories.set(category.name, true);
        }
      }

      // Disable any categories that aren't in existingCategories
      if (existingCommentCategories.length) {
        for (const category of prevCategories.keys()) {
          if (!existingCommentCategories.some((c) => c.name === category)) {
            newCategories.set(category, false);
          }
        }
      }
      return newCategories;
    });
  }, [existingCommentCategories]);

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="no-scrollbar mb-8 flex-1 overflow-auto px-4 pb-8">
        <CategorySection
          title="Set up commenter categories"
          description="Automatically categorize commenters for better moderation and engagement."
          categories={commenterCategories}
          categoryState={commenterCategoryState}
          setCategoryState={setCommenterCategoryState}
          existingCategories={existingCommenterCategories}
          type="commenter"
          selectedCategory={selectedCommenterCategory}
          setSelectedCategory={setSelectedCommenterCategory}
        />
        <CategorySection
          title="Set up comment categories"
          description="Automatically categorize comments for AI-driven automation and filtering."
          categories={commentCategories}
          categoryState={commentCategoryState}
          setCategoryState={setCommentCategoryState}
          existingCategories={existingCommentCategories}
          type="comment"
          selectedCategory={selectedCommentCategory}
          setSelectedCategory={setSelectedCommentCategory}
        />
      </div>
    </div>
  );
}

function CategorySection({
  title,
  description,
  categories,
  categoryState,
  setCategoryState,
  className,
  type,
  existingCategories,
  selectedCategory,
  setSelectedCategory,
}: {
  title: string;
  description: string;
  categories: CardCategory[];
  categoryState: Map<string, boolean>;
  setCategoryState: (state: Map<string, boolean>) => void;
  className?: string;
  type: 'commenter' | 'comment';
  existingCategories: CardCategory[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  return (
    <>
      <Card className={cn('!m-4', className)} style={{ margin: '1rem' }}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="max-w-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <TypographyH4>Choose categories</TypographyH4>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                category={category}
                isEnabled={categoryState.get(category.name) ?? false}
                onAdd={() =>
                  setCategoryState(
                    new Map(categoryState.entries()).set(category.name, true)
                  )
                }
                onRemove={async () => {
                  if (category.id) {
                    const action =
                      type === 'commenter'
                        ? deleteCommenterCategoryAction
                        : deleteCommentCategoryAction;
                    await action(category.id);
                  } else {
                    setCategoryState(
                      new Map(categoryState.entries()).set(category.name, false)
                    );
                  }
                }}
                onEdit={() => setSelectedCategory(category.name)}
              />
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <CreateCategoryButton
              buttonProps={{
                children: (
                  <>
                    <PenIcon className="mr-2 size-4" />
                    Add your own
                  </>
                ),
              }}
              type={type}
            />
            <Button
              loading={isCreating}
              onClick={async () => {
                setIsCreating(true);
                const upsertCategories = Array.from(
                  categoryState.entries()
                ).map(([name, enabled]) => ({
                  id: categories.find((c) => c.name === name)?.id,
                  name,
                  enabled,
                }));
                await upsertDefaultCategoriesAction(upsertCategories, type);
                setIsCreating(false);
                // router.push('/tube/smart-categorization');
              }}
            >
              <TagsIcon className="mr-2 h-4 w-4" />
              {existingCategories.length > 0 ? 'Save' : 'Create categories'}
            </Button>
          </div>
        </CardContent>
      </Card>
      <CreateCategoryDialog
        isOpen={selectedCategory !== null}
        onOpenChange={(open) =>
          setSelectedCategory(open ? selectedCategory : null)
        }
        closeModal={() => setSelectedCategory(null)}
        category={
          selectedCategory
            ? categories.find((c) => c.name === selectedCategory)
            : undefined
        }
        type={type}
      />
    </>
  );
}

function CategoryCard({
  category,
  isEnabled,
  onAdd,
  onRemove,
  onEdit,
}: {
  category: CardCategory;
  isEnabled: boolean;
  onAdd: () => void;
  onRemove: () => void;
  onEdit: () => void;
}) {
  return (
    <Card
      className={cn(
        'flex items-start justify-between gap-2 p-4',
        !isEnabled && 'bg-muted/50'
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="break-words pr-1 text-xs">{category.name}</div>
      </div>
      <div className="flex flex-shrink-0 pt-0.5">
        {isEnabled ? (
          <div className="flex gap-1">
            <Button size="icon-sm" variant="ghost" onClick={onEdit}>
              <PenIcon className="size-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button size="icon-sm" variant="ghost" onClick={onRemove}>
              <TrashIcon className="size-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        ) : (
          <Button size="icon-sm" variant="outline" onClick={onAdd}>
            <PlusIcon className="size-4" />
            <span className="sr-only">Add</span>
          </Button>
        )}
      </div>
    </Card>
  );
}
