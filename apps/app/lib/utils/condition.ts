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

export function isAIRule<T extends RuleConditions>(
  rule: T
): rule is T & { instructions: string } {
  return !!rule.instructions;
}

export function isStaticRule(rule: RuleConditions) {
  return !!rule.from || !!rule.videoId || !!rule.commentText;
}

export function isGroupRule<T extends RuleConditions>(
  rule: T
): rule is T & { groupId: string } {
  return !!rule.groupId;
}

export function isCategoryRule(rule: RuleConditions) {
  return !!rule.categoryFilters?.length;
}
