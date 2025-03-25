import { chatCompletionTools } from '@repo/ai/llms';
import { z } from 'zod';
import {
  type CreateOrUpdateRuleSchemaWithCategories,
  createRuleSchema,
  getCreateRuleSchemaWithCategories,
} from './create-rule-schema';

const updateRuleSchema = createRuleSchema.extend({
  ruleId: z.string().optional(),
});

export async function aiPromptToRules({
  user,
  promptFile,
  isEditing,
  availableCategories,
}: {
  user: {
    aiProvider: string | null;
    aiModel: string | null;
    aiApiKey: string | null;
    email: string;
  };
  promptFile: string;
  isEditing: boolean;
  availableCategories?: string[];
}) {
  function getSchema() {
    if (availableCategories?.length) {
      const createRuleSchemaWithCategories = getCreateRuleSchemaWithCategories(
        availableCategories as [string, ...string[]]
      );
      const updateRuleSchemaWithCategories =
        createRuleSchemaWithCategories.extend({
          ruleId: z.string().optional(),
        });

      return isEditing
        ? updateRuleSchemaWithCategories
        : createRuleSchemaWithCategories;
    }
    return isEditing ? updateRuleSchema : createRuleSchema;
  }

  const schema = getSchema();

  const parameters = z.object({
    rules: z
      .array(schema)
      .describe('The parsed rules list from the prompt file'),
  });

  const system = getSystemPrompt({
    hasSmartCategories: !!availableCategories?.length,
  });

  const prompt = `Convert the following prompt file into rules:
  
  <prompt>
  ${promptFile}
  </prompt>`;

  const aiResponse = await chatCompletionTools({
    userAi: user,
    prompt,
    system,
    tools: {
      parse_rules: {
        description: 'Parse rules from prompt file',
        parameters,
      },
    },
    userEmail: user.email,
    label: 'Prompt to rules',
  });

  const { rules } = aiResponse.toolCalls[0].args as {
    rules: CreateOrUpdateRuleSchemaWithCategories[];
  };

  return rules;
}

function getSystemPrompt({
  hasSmartCategories,
}: {
  hasSmartCategories: boolean;
}) {
  return `You are an AI assistant that converts YouTube comment moderation rules into a structured format. Parse the given prompt file and convert them into rules.

IMPORTANT: If a user provides a specific phrase or snippet, use that exact text in the rule. Avoid placeholders unless necessary.

You can use multiple conditions in a rule, but aim for simplicity.
In most cases, you should use the "aiInstructions" field, and sometimes other fields in addition.
If a rule can be handled fully with static conditions, do so, but this is rarely possible.

<examples>
  <example>
    <input>
      Mark positive feedback comments as 'Positive'
    </input>
    <output>
      {
        "rules": [{
          "name": "Categorize Positive Comments",
          "condition": {
            "aiInstructions": "Apply this rule to comments with positive feedback"
            ${
              hasSmartCategories
                ? `,
              "categories": {
                "categoryFilterType": "INCLUDE",
                "categoryFilters": ["POSITIVE"]
              },
              "conditionalOperator": "OR"`
                : ''
            }
          },
          "actions": [
            {
              "type": "CATEGORIZE",
              "fields": {
                "category": "POSITIVE"
              }
            }
          ]
        }]
      }
    </output>
  </example>

  <example>
    <input>
      Mark spam comments as 'Spam' and hide them
    </input>
    <output>
      {
        "rules": [{
          "name": "Hide Spam Comments",
          "condition": {
            "aiInstructions": "Apply this rule to spam comments"
          },
          "actions": [
            {
              "type": "MARK_AS_SPAM"
            },
            {
              "type": "REJECT"
            }
          ]
        }]
      }
    </output>
  </example>

  <example>
    <input>
      Mark comments asking questions as 'Question'
    </input>
    <output>
      {
        "rules": [{
          "name": "Label Question Comments",
          "condition": {
            "aiInstructions": "Apply this rule to comments asking questions"
          },
          "actions": [
            {
              "type": "CATEGORIZE",
              "fields": {
                "category": "QUESTION"
              }
            }
          ]
        }]
      }
    </output>
  </example>

  <example>
    <input>
      If someone asks about future video topics, reply with "Thanks for your suggestion! I'll consider it."
    </input>
    <output>
      {
        "rules": [{
          "name": "Reply to Topic Requests",
          "condition": {
            "aiInstructions": "Apply this rule to comments requesting future video topics"
          },
          "actions": [
            {
              "type": "REPLY",
              "fields": {
                "content": "Thanks for your suggestion! I'll consider it."
              }
            }
          ]
        }]
      }
    </output>
  </example>

  <example>
    <input>
      Mark comments with timestamps as 'Timestamp' and pin them
    </input>
    <output>
      {
        "rules": [{
          "name": "Highlight Timestamp Comments",
          "condition": {
            "aiInstructions": "Apply this rule to comments containing timestamps"
          },
          "actions": [
            {
              "type": "CATEGORIZE",
              "fields": {
                "category": "TIMESTAMP"
              }
            }
          ]
        }]
      }
    </output>
  </example>
</examples>
`;
}
