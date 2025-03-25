'use server';

import {
  defaultCommentCategory,
  defaultCommenterCategory,
} from '@/lib/utils/categories';
import { currentUser } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import {
  commentCategoryTable,
  commenterCategoryTable,
} from '@repo/backend/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { type CreateCategoryBody, createCategoryBody } from './validation';

export const getUserCommenterCategories = async (userId: string) => {
  const categoriesData = await database
    .select()
    .from(commenterCategoryTable)
    .where(eq(commenterCategoryTable.userId, userId));
  return categoriesData;
};

export const getUserCommentCategories = async (
  userId: string,
  names: string[]
) => {
  // biome-ignore lint/style/useBlockStatements: <explanation>
  if (!names.length) return [];

  const categories = await database
    .select({ id: commentCategoryTable.id })
    .from(commentCategoryTable)
    .where(
      and(
        eq(commentCategoryTable.userId, userId),
        inArray(commentCategoryTable.name, names)
      )
    );

  if (categories.length !== names.length) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.warn('Not all categories were found', {
      requested: names.length,
      found: categories.length,
      names,
    });
  }

  return categories.map((c) => c.id);
};

export const createCommenterCategoryAction = async (
  data: CreateCategoryBody
) => {
  const user = await currentUser();
  if (!user) {
    throw new Error('User not found');
  }

  const {
    success,
    data: parsedData,
    error,
  } = createCategoryBody.safeParse(data);

  if (!success) {
    return { error: error.message };
  }

  await upsertCommenterCategory(user.id, parsedData);
  revalidatePath('/tube/smart-categorization/setup');
};

export const createCommentCategoryAction = async (data: CreateCategoryBody) => {
  const user = await currentUser();
  if (!user) {
    throw new Error('User not found');
  }

  const {
    success,
    data: parsedData,
    error,
  } = createCategoryBody.safeParse(data);

  if (!success) {
    return { error: error.message };
  }

  await upsertCommentCategory(user.id, parsedData);
  revalidatePath('/tube/smart-categorization/setup');
};

async function upsertCommenterCategory(
  userId: string,
  newCategory: CreateCategoryBody
) {
  if (newCategory.id) {
    const { id, ...dataWithoutId } = newCategory;

    const [category] = await database
      .update(commenterCategoryTable)
      .set({ ...dataWithoutId })
      .where(
        and(
          eq(commenterCategoryTable.id, id),
          eq(commenterCategoryTable.userId, userId)
        )
      )
      .returning();

    return { id: category.id };
    // biome-ignore lint/style/noUselessElse: <explanation>
  } else {
    const [category] = await database
      .insert(commenterCategoryTable)
      .values({
        name: newCategory.name,
        description: newCategory.description,
        userId,
      })
      .returning();

    return { id: category.id };
  }
}

async function upsertCommentCategory(
  userId: string,
  newCategory: CreateCategoryBody
) {
  if (newCategory.id) {
    const { id, ...dataWithoutId } = newCategory;
    const [category] = await database
      .update(commentCategoryTable)
      .set({ ...dataWithoutId })
      .where(eq(commentCategoryTable.id, id))
      .returning();
    return { id: category.id };
    // biome-ignore lint/style/noUselessElse: <explanation>
  } else {
    const [category] = await database
      .insert(commentCategoryTable)
      .values({
        name: newCategory.name,
        description: newCategory.description,
        userId,
      })
      .returning();
    return { id: category.id };
  }
}

async function deleteCommenterCategory(userId: string, categoryId: string) {
  await database
    .delete(commenterCategoryTable)
    .where(
      and(
        eq(commenterCategoryTable.id, categoryId),
        eq(commenterCategoryTable.userId, userId)
      )
    );
}

async function deleteCommentCategory(userId: string, categoryId: string) {
  await database
    .delete(commentCategoryTable)
    .where(
      and(
        eq(commentCategoryTable.id, categoryId),
        eq(commentCategoryTable.userId, userId)
      )
    );
}

export const deleteCommenterCategoryAction = async (categoryId: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }
  await deleteCommenterCategory(user.id, categoryId);
  revalidatePath('/tube/smart-categorization/setup');
};

export const deleteCommentCategoryAction = async (categoryId: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }
  await deleteCommentCategory(user.id, categoryId);
  revalidatePath('/tube/smart-categorization/setup');
};

export const upsertDefaultCategoriesAction = async (
  categories: { id?: string; name: string; enabled: boolean }[],
  type: 'commenter' | 'comment'
) => {
  const user = await currentUser();
  if (!user) {
    return { error: 'Not Authenticated' };
  }

  for (const { id, name, enabled } of categories) {
    const defaultCategory =
      type === 'commenter' ? defaultCommenterCategory : defaultCommentCategory;
    const description = Object.values(defaultCategory).find(
      (c) => c.name === name
    )?.description;

    if (enabled) {
      const action =
        type === 'commenter' ? upsertCommenterCategory : upsertCommentCategory;
      await action(user.id, {
        id,
        name,
        description,
      });
    } else {
      const action =
        type === 'commenter' ? deleteCommenterCategory : deleteCommentCategory;
      if (id) {
        await action(user.id, id);
      }
    }
  }
};
