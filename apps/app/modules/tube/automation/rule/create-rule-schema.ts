import { z } from 'zod';

const conditionSchema = z
  .object({
    conditionalOperator: z
      .enum(['AND', 'OR'])
      .optional()
      .describe(
        'The conditional operator to use. AND means all conditions must be true for the rule to match. OR means any condition can be true for the rule to match. This does not impact sub-conditions.'
      ),
    aiInstructions: z
      .string()
      .optional()
      .describe(
        "Instructions for the AI to determine when to apply this rule. For example: 'Apply this rule to comments containing hate speech' or 'Use this rule for spam comments'. Be specific about the comment content or characteristics that should trigger this rule."
      ),
    static: z
      .object({
        from: z
          .string()
          .optional()
          .describe('The author or channel ID of the comment'),
        commentText: z
          .string()
          .optional()
          .describe('The comment text to match'),
        videoId: z.string().optional().describe('The video ID to match'),
      })
      .optional()
      .describe(
        'The static conditions to match. If multiple static conditions are specified, the rule will match if ALL of the conditions match (AND operation).'
      ),
  })
  .describe('The conditions to match');

export const createRuleSchema = z.object({
  name: z
    .string()
    .describe("The name of the rule. No need to include 'Rule' in the name."),
  condition: conditionSchema,
  actions: z
    .array(
      z.object({
        type: z
          .enum([
            'REPLY',
            'DELETE',
            'PUBLISH',
            'REJECT',
            'REVIEW',
            'MARK_AS_SPAM',
            'NOTIFY',
            'CALL_WEBHOOK',
            'CATEGORIZE',
            'TRANSLATE',
          ])
          .describe('The type of the action'),
        fields: z
          .object({
            label: z
              .string()
              .nullish()
              .transform((v) => v ?? null)
              .describe('The label to apply to the comment'),
            content: z
              .string()
              .nullish()
              .transform((v) => v ?? null)
              .describe('The content for an automated reply'),
            webhookUrl: z
              .string()
              .nullish()
              .transform((v) => v ?? null)
              .describe('The webhook URL to call'),
          })
          .optional()
          .describe(
            "The fields to use for the action. Static text can be combined with dynamic values using double braces {{}}. For example: 'Hi {{author}}' or 'Thanks for your comment on {{videoTitle}}'. Dynamic values will be replaced with actual comment data when the rule is executed."
          ),
      })
    )
    .describe('The actions to take'),
});

export const getCreateRuleSchemaWithCategories = (
  availableCategories: [string, ...string[]]
) => {
  return createRuleSchema.extend({
    condition: conditionSchema.extend({
      categories: z
        .object({
          categoryFilterType: z
            .enum(['INCLUDE', 'EXCLUDE'])
            .optional()
            .describe(
              'Whether senders in `categoryFilters` should be included or excluded'
            ),
          categoryFilters: z
            .array(z.string())
            .optional()
            .describe(
              `The categories to match. If multiple categories are specified, the rule will match if ANY of the categories match (OR operation). Available categories: ${availableCategories
                .map((c) => `"${c}"`)
                .join(', ')}`
            ),
        })
        .optional()
        .describe('The categories to match or skip'),
    }),
  });
};

type CreateRuleSchema = z.infer<typeof createRuleSchema>;
export type CreateRuleSchemaWithCategories = CreateRuleSchema & {
  condition: CreateRuleSchema['condition'] & {
    categories?: {
      categoryFilterType: 'INCLUDE' | 'EXCLUDE';
      categoryFilters: string[];
    };
  };
};
export type CreateOrUpdateRuleSchemaWithCategories =
  CreateRuleSchemaWithCategories & {
    ruleId?: string;
  };
