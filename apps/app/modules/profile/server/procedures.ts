import { getUserCommentCategories } from '@/actions/categories';
import { aiDiffRules } from '@/modules/tube/automation/diff-rules';
import { aiFindExistingRules } from '@/modules/tube/automation/rule/find-existing-rules';
import { aiPromptToRules } from '@/modules/tube/automation/rule/prompt-to-rules';
import {
  safeCreateRule,
  safeUpdateRule,
} from '@/modules/tube/automation/rule/rule';
import { deleteRule } from '@/modules/tube/automation/rule/rule';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { database } from '@repo/backend/database';
import {
  Profile,
  Users,
  executedRule,
  rule as ruleTable,
} from '@repo/backend/schema';
import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
export const profileRouter = createTRPCRouter({
  getOne: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    const [profile] = await database
      .select()
      .from(Profile)
      .where(eq(Profile.id, userId));

    if (!profile) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return profile;
  }),
  //TODO: Work in progress, placeholder for now
  /**
   * Saves the user's rules prompt and updates the rules accordingly.
   * Flow:
   * 1. Compare new prompt with old prompt (if exists)
   * 2. If prompts differ:
   *    a. For existing prompt: Identify added, edited, and removed rules
   *    b. For new prompt: Process all rules as additions
   * 3. Remove rules marked for deletion
   * 4. Edit existing rules that have changes
   * 5. Add new rules
   * 6. Update user's rules prompt in the database
   * 7. Return counts of created, edited, and removed rules
   */
  update: protectedProcedure
    .input(
      z.object({
        rulesPrompt: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const { rulesPrompt } = input;

      if (!rulesPrompt) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      // get old rulesPrompt
      const user = await database.query.Users.findFirst({
        where: eq(Users.id, userId),
        with: {
          profile: {
            columns: {
              rulesPrompt: true,
              aiProvider: true,
              aiModel: true,
              aiApiKey: true,
              email: true,
            },
          },
          commentCategories: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (
        !user ||
        !user.profile ||
        !user.profile.email
        // !user.profile.aiProvider ||
        // !user.profile.aiModel ||
        // !user.profile.aiApiKey
      ) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const oldPromptFile = user.profile.rulesPrompt;

      if (oldPromptFile === rulesPrompt) {
        return { createdRules: 0, editedRules: 0, removedRules: 0 };
      }

      // biome-ignore lint/style/useConst: <explanation>
      let addedRules: Awaited<ReturnType<typeof aiPromptToRules>> | null = null;
      // biome-ignore lint/style/useConst: <explanation>
      let editRulesCount = 0;
      // biome-ignore lint/style/useConst: <explanation>
      let removedRulesCount = 0;

      // check how the prompts have changed, and make changes to the rules accordingly
      if (oldPromptFile) {
        const diff = await aiDiffRules({
          user: {
            email: user.profile.email,
            aiProvider: user.profile.aiProvider,
            aiModel: user.profile.aiModel,
            aiApiKey: user.profile.aiApiKey,
          },
          oldPromptFile,
          newPromptFile: rulesPrompt,
        });

        if (
          !diff.addedRules.length &&
          !diff.editedRules.length &&
          !diff.removedRules.length
        ) {
          return { createdRules: 0, editedRules: 0, removedRules: 0 };
        }

        if (diff.addedRules.length) {
          addedRules = await aiPromptToRules({
            user: {
              email: user.profile.email,
              aiProvider: user.profile.aiProvider,
              aiModel: user.profile.aiModel,
              aiApiKey: user.profile.aiApiKey,
            },
            promptFile: diff.addedRules.join('\n\n'),
            isEditing: false,
            availableCategories: user.commentCategories.map((c) => c.name),
          });
        }

        const userRules = await database.query.rule.findMany({
          where: and(eq(ruleTable.userId, userId), eq(ruleTable.enabled, true)),
          with: {
            actions: true,
          },
        });

        const existingRules = await aiFindExistingRules({
          user: {
            email: user.profile.email,
            aiProvider: user.profile.aiProvider,
            aiModel: user.profile.aiModel,
            aiApiKey: user.profile.aiApiKey,
          },
          promptRulesToEdit: diff.editedRules,
          promptRulesToRemove: diff.removedRules,
          databaseRules: userRules,
        });

        for (const rule of existingRules.removedRules) {
          if (!rule.rule) {
            continue;
          }

          const executedRuleData = await database.query.executedRule.findFirst({
            where: and(
              eq(executedRule.ruleId, rule.rule.id),
              eq(executedRule.userId, userId)
            ),
          });

          if (executedRuleData) {
            await database
              .update(ruleTable)
              .set({ enabled: false })
              .where(
                and(
                  eq(ruleTable.id, rule.rule.id),
                  eq(ruleTable.userId, userId)
                )
              );
          } else {
            try {
              await deleteRule({
                userId,
                ruleId: rule.rule.id,
                groupId: rule.rule.groupId,
              });
            } catch (error) {
              console.error(error);
            }
          }

          removedRulesCount++;
        }

        //edit rules
        if (existingRules.editedRules.length > 0) {
          const editedRules = await aiPromptToRules({
            user: {
              email: user.profile.email,
              aiProvider: user.profile.aiProvider,
              aiModel: user.profile.aiModel,
              aiApiKey: user.profile.aiApiKey,
            },
            promptFile: existingRules.editedRules
              .map(
                (r) => `Rule ID: ${r.rule?.id}. Prompt: ${r.updatedPromptRule}`
              )
              .join('\n\n'),
            isEditing: true,
            availableCategories: user.commentCategories.map((c) => c.name),
          });

          for (const rule of editedRules) {
            if (!rule.ruleId) {
              continue;
            }

            const categoryIds = await getUserCommentCategories(
              userId,
              rule.condition.categories?.categoryFilters || []
            );

            editRulesCount++;

            //safe update rule
            await safeUpdateRule(rule.ruleId, rule, userId, categoryIds);
          }
        }
      } else {
        addedRules = await aiPromptToRules({
          user: {
            email: user.profile.email,
            aiProvider: user.profile.aiProvider,
            aiModel: user.profile.aiModel,
            aiApiKey: user.profile.aiApiKey,
          },
          promptFile: rulesPrompt,
          isEditing: false,
          availableCategories: user.commentCategories.map((c) => c.name),
        });
      }

      // add new rules
      for (const rule of addedRules || []) {
        //create safe rule
        await safeCreateRule(
          rule,
          userId,
          rule.condition.categories?.categoryFilters || []
        );
      }

      await database
        .update(Profile)
        .set({
          rulesPrompt,
        })
        .where(eq(Profile.id, userId));

      return {
        createdRules: addedRules?.length || 0,
        editedRules: editRulesCount,
        removedRules: removedRulesCount,
      };
    }),
});
