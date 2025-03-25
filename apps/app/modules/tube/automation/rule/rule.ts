import { getUserCommentCategories } from '@/actions/categories';
import { type RiskAction, getActionRiskLevel } from '@/lib/utils/risk';
import { database } from '@repo/backend/database';
import {
  action,
  group,
  ruleCommentCategoryTable,
  rule as ruleTable,
} from '@repo/backend/schema';
import { eq } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import type { CreateOrUpdateRuleSchemaWithCategories } from './create-rule-schema';

// biome-ignore lint/suspicious/useAwait: <explanation>
export async function createRule({
  result,
  userId,
  categoryIds,
}: {
  result: CreateOrUpdateRuleSchemaWithCategories;
  userId: string;
  categoryIds?: string[] | null;
}) {
  const mappedActions = mapActionFields(result.actions);

  // Create the rule
  const [newRule] = await database
    .insert(ruleTable)
    .values({
      userId,
      name: result.name,
      automate: shouldAutomate(
        result,
        mappedActions.map((a) => ({
          type: a.type,
          content: a.content ?? null,
          url: a.url ?? null,
        }))
      ),
      runOnThreads: true,
      conditionalOperator: result.condition.conditionalOperator,
      instructions: result.condition.aiInstructions,
      from: result.condition.static?.from,
      videoId: result.condition.static?.videoId,
      commentText: result.condition.static?.commentText,
    })
    .returning();

  if (mappedActions.length > 0) {
    await database.insert(action).values(
      mappedActions.map((actionData) => ({
        ...actionData,
        ruleId: newRule.id,
      }))
    );
  }

  // Add rule-category relations if needed
  if (categoryIds && categoryIds.length > 0) {
    await database.insert(ruleCommentCategoryTable).values(
      categoryIds.map((categoryId) => ({
        ruleId: newRule.id,
        commentCategoryId: categoryId,
      }))
    );
  }

  const createdRule = await database.query.rule.findFirst({
    where: eq(ruleTable.id, newRule.id),
    with: {
      actions: true,
      commentCategories: {
        with: {
          commentCategory: true,
        },
      },
      group: true,
    },
  });

  return createdRule;
}

function mapActionFields(
  actions: CreateOrUpdateRuleSchemaWithCategories['actions']
) {
  return actions.map((action) => ({
    type: action.type,
    content: action.fields?.content,
    url: action.fields?.webhookUrl,
  }));
}

export async function safeCreateRule(
  result: CreateOrUpdateRuleSchemaWithCategories,
  userId: string,
  categoryNames?: string[] | null
) {
  const categoryIds = await getUserCommentCategories(
    userId,
    categoryNames || []
  );

  try {
    const rule = await createRule({
      result,
      userId,
      categoryIds,
    });
    return rule;
  } catch (error) {
    console.error('Error creating rule.', error);
    return { error: 'Error creating rule.' };
  }
}

// biome-ignore lint/suspicious/useAwait: <explanation>
export async function deleteRule({
  userId,
  ruleId,
  groupId,
}: {
  userId: string;
  ruleId: string;
  groupId?: string | null;
}) {
  return Promise.all([
    database
      .delete(ruleTable)
      .where(and(eq(ruleTable.id, ruleId), eq(ruleTable.userId, userId))),
    groupId ? database.delete(group).where(eq(group.id, groupId)) : null,
  ]);
}

function shouldAutomate(
  rule: CreateOrUpdateRuleSchemaWithCategories,
  actions: RiskAction[]
) {
  // Don't automate replying or deleting comments
  if (rule.actions.find((a) => a.type === 'REPLY' || a.type === 'DELETE')) {
    return false;
  }

  const riskLevels = actions.map(
    (action) => getActionRiskLevel(action, false, {}).level
  );

  // Only automate if all actions are low risk
  // User can manually enable in other cases
  return riskLevels.every((level) => level === 'low');
}

async function updateRule(
  ruleId: string,
  result: CreateOrUpdateRuleSchemaWithCategories,
  userId: string,
  categoryIds?: string[] | null
) {
  // Update the rule
  const [updatedRule] = await database
    .update(ruleTable)
    .set({
      name: result.name,
      userId,
      conditionalOperator: result.condition.conditionalOperator,
      instructions: result.condition.aiInstructions,
      from: result.condition.static?.from,
      videoId: result.condition.static?.videoId,
      commentText: result.condition.static?.commentText,
    })
    .where(eq(ruleTable.id, ruleId))
    .returning();

  // Replace actions: delete existing and insert new ones
  await database.delete(action).where(eq(action.ruleId, ruleId));
  const mappedActions = mapActionFields(result.actions);
  if (mappedActions.length > 0) {
    await database.insert(action).values(
      mappedActions.map((actionData) => ({
        ...actionData,
        ruleId: ruleId,
      }))
    );
  }

  // Update categoryFilters (commentCategories): delete existing and insert new ones
  if (categoryIds !== undefined) {
    await database
      .delete(ruleCommentCategoryTable)
      .where(eq(ruleCommentCategoryTable.ruleId, ruleId));
    if (categoryIds && categoryIds.length > 0) {
      await database.insert(ruleCommentCategoryTable).values(
        categoryIds.map((categoryId) => ({
          ruleId: ruleId,
          commentCategoryId: categoryId,
        }))
      );
    }
  }

  // Fetch the updated rule with relations (optional, if you need the full object)
  const finalRule = await database.query.rule.findFirst({
    where: eq(ruleTable.id, ruleId),
    with: {
      actions: true,
      commentCategories: {
        with: {
          commentCategory: true,
        },
      },
      group: true,
    },
  });

  return finalRule;
}

export async function safeUpdateRule(
  ruleId: string,
  result: CreateOrUpdateRuleSchemaWithCategories,
  userId: string,
  categoryNames?: string[] | null
) {
  try {
    const rule = await updateRule(ruleId, result, userId, categoryNames);
    if (!rule) {
      return { error: 'Rule not found.' };
    }
    return { id: rule.id };
  } catch (error) {
    console.error('Error updating rule.', error);
    return { error: 'Error updating rule.' };
  }
}
