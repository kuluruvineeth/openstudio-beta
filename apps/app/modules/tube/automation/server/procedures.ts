import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { database } from '@repo/backend/database';
import { rule, youtubeIntegration } from '@repo/backend/schema';
import { TRPCError } from '@trpc/server';
import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';

export const automationRouter = createTRPCRouter({
  getRules: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const rules = await database.query.rule.findMany({
      where: eq(rule.userId, userId),
      with: {
        actions: true, // Include all columns from actions table
        group: true, // Include all columns from group table
        commentCategories: {
          with: {
            commentCategory: true, // Include all columns from commentCategory table
          },
        },
      },
      orderBy: asc(rule.createdAt),
    });

    return rules;
  }),
  setRuleAutomated: protectedProcedure
    .input(
      z.object({
        ruleId: z.string(),
        automate: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const { ruleId, automate } = input;

      await database
        .update(rule)
        .set({
          automate,
        })
        .where(eq(rule.id, ruleId));
    }),
  setRuleOnThreads: protectedProcedure
    .input(
      z.object({
        ruleId: z.string(),
        runOnThreads: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const { ruleId, runOnThreads } = input;

      await database
        .update(rule)
        .set({
          runOnThreads,
        })
        .where(eq(rule.id, ruleId));
    }),
  getYoutubeIntegration: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const youtubeIntegrationData =
      await database.query.youtubeIntegration.findFirst({
        where: eq(
          youtubeIntegration.organizationId,
          ctx.user.user_metadata.organization_id
        ),
      });

    // if no youtube integration, return null
    if (!youtubeIntegrationData) {
      return null;
    }

    return youtubeIntegrationData;
  }),
});
