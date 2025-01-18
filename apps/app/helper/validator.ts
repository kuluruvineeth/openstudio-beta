import { schema } from '@repo/database/schema';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const assistantSchema: z.ZodTypeAny = createSelectSchema(
  schema.assistants
);

export const promptSchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string(),
});

export const preferencesSchema: z.ZodTypeAny = createSelectSchema(
  schema.preferences,
  {
    defaultPlugins: z.array(z.string()),
    memories: z.array(z.string()),
  }
);

export const runConfigSchema = z.object({
  context: z.string().optional(),
  input: z.string().optional(),
  image: z.string().optional(),
  sessionId: z.string(),
  messageId: z.string().optional(),
  assistant: assistantSchema,
});

export type RunConfigProps = z.infer<typeof runConfigSchema>;

export const toolsSchema = z.array(
  z.object({
    toolName: z.string(),
    isLoading: z.boolean().default(false),
    executionArgs: z.any().optional(),
    executionResult: z.any().optional(),
    renderData: z.any().optional(),
  })
);

export const chatMessageSchema: z.ZodTypeAny = createSelectSchema(
  schema.chatMessages,
  {
    runConfig: runConfigSchema,
    tools: toolsSchema,
    relatedQuestions: z.array(z.string()).nullable(),
  }
);

export const apiKeysSchema: z.ZodTypeAny = createSelectSchema(schema.apiKeys);

export type ApiKeysProps = z.infer<typeof apiKeysSchema>;

export const chatSessionSchema: z.ZodTypeAny = createSelectSchema(
  schema.chatSessions
);

export const customAssistantSchema: z.ZodTypeAny = createSelectSchema(
  schema.customAssistants,
  {
    startMessage: z.array(z.string()).nullable(),
  }
);

export const dataValidator = z.object({
  preferences: preferencesSchema.optional(),
  apiKeys: z.array(apiKeysSchema).optional(),
  prompts: z.array(promptSchema).optional(),
  chatMessages: z.array(chatMessageSchema).optional(),
  chatSessions: z.array(chatSessionSchema).optional(),
  customAssistants: z.array(customAssistantSchema).optional(),
});
