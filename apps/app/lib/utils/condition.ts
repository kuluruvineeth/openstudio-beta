import type { rule } from '@repo/backend/schema';
import type { group } from '@repo/backend/schema';
import type { commentCategoryTable } from '@repo/backend/schema';
import type { InferSelectModel } from 'drizzle-orm';

export type RuleConditions = Partial<
  Pick<
    InferSelectModel<typeof rule>,
    | 'groupId'
    | 'instructions'
    | 'from'
    | 'videoId'
    | 'commentText'
    | 'conditionalOperator'
  > & {
    group?: Pick<InferSelectModel<typeof group>, 'name'> | null;
    categoryFilters?: Pick<
      InferSelectModel<typeof commentCategoryTable>,
      'id' | 'name'
    >[];
  }
>;
