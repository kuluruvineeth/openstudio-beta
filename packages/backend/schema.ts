import { init } from '@paralleldrive/cuid2';
import { type InferSelectModel, sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  boolean,
  decimal,
  foreignKey,
  index,
  integer,
  json,
  jsonb,
  pgEnum,
  pgSchema,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import {
  type TCustomAssistant,
  type TLLMRunConfig,
  type ToolExecutionState,
  type ToolKey,
  providers,
} from './types';

const authSchema = pgSchema('auth');

export const Users = authSchema.table('users', {
  id: uuid('id').primaryKey(),
});

// Added Additional table to store user profile data than to extend raw user meta data in supabase auth.users table
export const Profile = pgTable('profile', {
  id: uuid('id')
    .primaryKey()
    .references(() => Users.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 256 }),
  rulesPrompt: text('rules_prompt'),
  aiProvider: text('ai_provider'),
  aiModel: text('ai_model'),
  aiApiKey: text('ai_api_key'),
});

// Enums
export const actionType = pgEnum('action_type', [
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
]);

export const logicalOperatorEnum = pgEnum('logical_operator', ['AND', 'OR']);

export const categoryFilterTypeEnum = pgEnum('category_filter_type', [
  'INCLUDE',
  'EXCLUDE',
]);

export const executedRuleStatusEnum = pgEnum('executed_rule_status', [
  'APPLIED',
  'APPLYING',
  'REJECTED',
  'PENDING',
  'SKIPPED',
  'ERROR',
]);

export const groupItemTypeEnum = pgEnum('group_item_type', [
  'COMMENTER',
  'COMMENT_TEXT',
  'VIDEO_ID',
]);

// Rule table
export const rule = pgTable(
  'rule',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    name: text('name').notNull(),
    enabled: boolean('enabled').default(true).notNull(),
    automate: boolean('automate').default(false).notNull(), // User must approve if false
    runOnThreads: boolean('run_on_threads').default(false).notNull(), // Runs on comment threads if true
    userId: uuid('user_id')
      .notNull()
      .references(() => Users.id, { onDelete: 'cascade' }),

    // Reply tracking fields for YouTube comments
    trackReplies: boolean('track_replies'),
    draftReplies: boolean('draft_replies'),
    draftRepliesInstructions: text('draft_replies_instructions'),

    // Conditions
    conditionalOperator: logicalOperatorEnum('conditional_operator')
      .default('AND')
      .notNull(),
    instructions: text('instructions'), // AI conditions

    // Group condition
    groupId: uuid('group_id')
      .unique()
      .references(() => group.id, { onDelete: 'cascade' }),

    // Static conditions for YouTube comments
    from: text('from'), // Commenter ID or channel ID
    videoId: text('video_id'), // Specific YouTube video ID
    commentText: text('comment_text'), // Comment body filter
  },
  (t) => [uniqueIndex('rule_user_id_name_idx').on(t.userId, t.name)]
);

// Action table
export const action = pgTable('action', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  type: actionType('type').notNull(),
  ruleId: uuid('rule_id')
    .notNull()
    .references(() => rule.id, { onDelete: 'cascade' }),

  // Optional static fields for YouTube actions
  label: text('label'), // e.g., category label
  content: text('content'), // Reply content
  url: text('url'), // Webhook URL if applicable
});

// ExecutedRule table
export const executedRule = pgTable(
  'executed_rule',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    threadId: text('thread_id'), // YouTube comment thread ID
    commentId: text('comment_id').notNull(), // YouTube comment ID
    status: executedRuleStatusEnum('status').notNull(),
    automated: boolean('automated').notNull(),
    reason: text('reason'),

    ruleId: uuid('rule_id').references(() => rule.id),
    userId: uuid('user_id')
      .notNull()
      .references(() => Users.id, { onDelete: 'cascade' }),
  },
  (t) => [
    uniqueIndex('executed_rule_user_id_thread_id_comment_id_idx').on(
      t.userId,
      t.threadId,
      t.commentId
    ),
    index('executed_rule_user_id_status_created_at_idx').on(
      t.userId,
      t.status,
      t.createdAt
    ),
  ]
);

// ExecutedAction table
export const executedAction = pgTable('executed_action', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  type: actionType('type').notNull(),
  executedRuleId: uuid('executed_rule_id')
    .notNull()
    .references(() => executedRule.id, { onDelete: 'cascade' }),

  // Optional fields for executed actions
  label: text('label'),
  content: text('content'),
  url: text('url'),
});

// Group table for YouTube comment categorization
export const group = pgTable(
  'group',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    name: text('name').notNull(),
    prompt: text('prompt'), // Optional, might be deprecated
    userId: uuid('user_id')
      .notNull()
      .references(() => Users.id, { onDelete: 'cascade' }),
  },
  (t) => [uniqueIndex('group_user_id_name_idx').on(t.userId, t.name)]
);

// GroupItem table for specific YouTube comment conditions
export const groupItem = pgTable(
  'group_item',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    groupId: uuid('group_id').references(() => group.id, {
      onDelete: 'cascade',
    }),
    type: groupItemTypeEnum('type').notNull(),
    value: text('value').notNull(), // e.g., commenter ID, comment text pattern, video ID
  },
  (t) => [
    uniqueIndex('group_item_group_id_type_value_idx').on(
      t.groupId,
      t.type,
      t.value
    ),
  ]
);

// Enum for ThreadTrackerType as specified
export const threadTrackerTypeEnum = pgEnum('thread_tracker_type', [
  'AWAITING', // We're waiting for their reply
  'NEEDS_REPLY', // We need to reply to this
  'NEEDS_ACTION', // We need to do something else
]);

// ThreadTracker table
export const threadTracker = pgTable(
  'thread_tracker',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    sentAt: timestamp('sent_at'), // When the action (e.g., reply) was sent
    threadId: text('thread_id'), // YouTube comment thread ID
    commentId: text('comment_id').notNull(), // YouTube comment ID
    resolved: boolean('resolved').default(false).notNull(),
    type: threadTrackerTypeEnum('type').notNull(),

    ruleId: uuid('rule_id').references(() => rule.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => Users.id, { onDelete: 'cascade' }),
  },
  (t) => [
    uniqueIndex('thread_tracker_user_id_thread_id_comment_id_idx').on(
      t.userId,
      t.threadId,
      t.commentId
    ),
    index('thread_tracker_user_id_resolved_idx').on(t.userId, t.resolved),
    index('thread_tracker_user_id_resolved_sent_at_type_idx').on(
      t.userId,
      t.resolved,
      t.sentAt,
      t.type
    ),
    index('thread_tracker_user_id_type_resolved_sent_at_idx').on(
      t.userId,
      t.type,
      t.resolved,
      t.sentAt
    ),
  ]
);

// Relations

export const threadTrackerRelations = relations(threadTracker, ({ one }) => ({
  rule: one(rule, {
    fields: [threadTracker.ruleId],
    references: [rule.id],
  }),
  user: one(Users, {
    fields: [threadTracker.userId],
    references: [Users.id],
  }),
}));

export const actionRelations = relations(action, ({ one }) => ({
  rule: one(rule, {
    fields: [action.ruleId],
    references: [rule.id],
  }),
}));

export const executedRuleRelations = relations(
  executedRule,
  ({ one, many }) => ({
    rule: one(rule, {
      fields: [executedRule.ruleId],
      references: [rule.id],
    }),
    user: one(Users, {
      fields: [executedRule.userId],
      references: [Users.id],
    }),
    actionItems: many(executedAction),
  })
);

export const executedActionRelations = relations(executedAction, ({ one }) => ({
  executedRule: one(executedRule, {
    fields: [executedAction.executedRuleId],
    references: [executedRule.id],
  }),
}));

export const groupRelations = relations(group, ({ one, many }) => ({
  user: one(Users, {
    fields: [group.userId],
    references: [Users.id],
  }),
  items: many(groupItem),
  rule: one(rule, {
    fields: [group.id],
    references: [rule.groupId],
  }),
}));

export const groupItemRelations = relations(groupItem, ({ one }) => ({
  group: one(group, {
    fields: [groupItem.groupId],
    references: [group.id],
  }),
}));

export const youtubeCommentDataSyncFrequencyEnum = pgEnum(
  'youtube_comment_data_sync_frequency',
  [
    'manual',
    'hourly',
    '6hours',
    '12hours',
    'daily',
    'weekly',
    'monthly',
    'quaterly',
    'half_yearly',
    'yearly',
  ]
);

export const organization = pgTable('organization', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 191 }).notNull(),
  logoUrl: varchar('logoUrl', { length: 191 }),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 6 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 6 })
    .defaultNow()
    .notNull(),
  productDescription: text('productDescription'),
  slug: varchar('slug', { length: 191 }).notNull(),
  youtubeChannelId: text('youtube_channel_id'),
  youtubeCommentDataSyncFrequency: youtubeCommentDataSyncFrequencyEnum(
    'youtube_comment_data_sync_frequency'
  ).default('manual'),
});

export const premiumTierEnum = pgEnum('premium_tier', [
  'PRO_MONTHLY',
  'PRO_ANNUALLY',
  'LIFETIME',
]);

export const premium = pgTable(
  'premium',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: varchar('userId').references(() => Users.id, {
      onDelete: 'cascade',
    }),
    organizationId: varchar('organizationId').references(
      () => organization.id,
      { onDelete: 'cascade' }
    ),
    tier: premiumTierEnum('tier').notNull(),
    createdAt: timestamp('createdAt', { mode: 'date', precision: 6 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', { mode: 'date', precision: 6 })
      .defaultNow()
      .notNull(),
    lemon_squeezy_renews_at: timestamp('lemon_squeezy_renews_at', {
      mode: 'date',
      precision: 6,
    }),
    lemon_squeezy_customer_id: integer('lemon_squeezy_customer_id'),
    lemon_squeezy_subscription_id: integer('lemon_squeezy_subscription_id'),
    lemon_squeezy_subscription_item_id: integer(
      'lemon_squeezy_subscription_item_id'
    ),
    lemon_squeezy_order_id: integer('lemon_squeezy_order_id'),
    lemon_squeezy_product_id: integer('lemon_squeezy_product_id'),
    lemon_squeezy_variant_id: integer('lemon_squeezy_variant_id'),
  },
  (table) => ({
    organizationIdIdx: index('premium_organization_id_idx').on(
      table.organizationId
    ),
  })
);

export const assistantTypeEnum = pgEnum('assistant_type', [
  'base',
  'custom',
] as const);
export const dalleImageQualityEnum = pgEnum('dalle_image_quality', [
  'standard',
  'hd',
] as const);
export const dalleImageSizeEnum = pgEnum('dalle_image_size', [
  '1024x1024',
  '1792x1024',
  '1024x1792',
] as const);
export const webSearchEngineEnum = pgEnum('web_search_engine', [
  'google',
  'duckduckgo',
] as const);
export const stopReasonEnum = pgEnum('stop_reason', [
  'error',
  'cancel',
  'apikey',
  'recursion',
  'finish',
  'unauthorized',
] as const);

export const providerEnum = pgEnum('provider', providers);

export const prompts = pgTable(
  'prompts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    content: text('content').notNull(),
    organizationId: varchar('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    userId: varchar('user_id')
      .notNull()
      .references(() => Users.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      organizationIdIdx: index('prompts_organization_id_idx').on(
        table.organizationId
      ),
      userIdIdx: index('prompts_user_id_idx').on(table.userId),
    };
  }
);

// TODO: later deprecate this table
export const chatSessions = pgTable(
  'chat_sessions',
  {
    id: text('id').primaryKey(),
    title: text('title'),
    isExample: boolean('is_example').default(false),
    customAssistant: json('custom_assistant').$type<TCustomAssistant>(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    organizationId: varchar('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => Users.id, { onDelete: 'cascade' }), // References Supabase auth.users table
  },
  (table) => {
    return {
      organizationIdIdx: index('chat_sessions_organization_id_idx').on(
        table.organizationId
      ),
      userIdIdx: index('chat_sessions_user_id_idx').on(table.userId),
    };
  }
);

// TODO: later deprecate this table
export const chatMessages = pgTable('chat_messages', {
  id: text('id').primaryKey(),
  sessionId: varchar('session_id')
    .notNull()
    .references(() => chatSessions.id),
  parentId: varchar('parent_id'),
  image: text('image'),
  rawHuman: text('raw_human'),
  rawAI: text('raw_ai'),
  isLoading: boolean('is_loading').default(false),
  stop: boolean('stop').default(false),
  stopReason: stopReasonEnum('stop_reason'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow(),
  runConfig: json('run_config').$type<TLLMRunConfig>().notNull(),
  tools: json('tools').$type<ToolExecutionState[]>(),
  relatedQuestions: json('related_questions').$type<string[]>(),
});

export const chat = pgTable('chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  title: text('title').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => Users.id, { onDelete: 'cascade' }),
  organizationId: varchar('organizationId')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable('message', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chat.id),
  createdAt: timestamp('createdAt').notNull(),
  content: json('content').notNull(),
  role: varchar('role').notNull(),
  runConfig: json('runConfig').notNull(),
});

export type Message = InferSelectModel<typeof message>;

export const vote = pgTable(
  'vote',
  {
    chatId: uuid('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('messageId')
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean('isUpvoted').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  }
);

export type Vote = InferSelectModel<typeof vote>;

export const assistants = pgTable('assistants', {
  name: text('name').notNull(),
  description: text('description'),
  systemPrompt: text('system_prompt').notNull(),
  iconURL: text('icon_url'),
  provider: providerEnum('provider').notNull(),
  baseModel: text('base_model').notNull(),
  key: text('key').unique().primaryKey(),
  type: assistantTypeEnum('type').notNull(),
});

export const customAssistants = pgTable('custom_assistants', {
  name: text('name').notNull(),
  description: text('description'),
  systemPrompt: text('system_prompt').notNull(),
  iconURL: text('icon_url'),
  key: text('key').unique().primaryKey(),
  startMessage: json('start_message').$type<string[]>(),
  organizationId: varchar('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
});

export const preferences = pgTable('preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: varchar('organization_id')
    .notNull()
    .unique()
    .references(() => organization.id, { onDelete: 'cascade' }),
  defaultAssistant: text('default_assistant').notNull(),
  systemPrompt: text('system_prompt').notNull(),
  messageLimit: integer('message_limit').notNull(),
  temperature: decimal('temperature').notNull(),
  memories: json('memories').$type<string[]>().notNull(),
  suggestRelatedQuestions: boolean('suggest_related_questions').notNull(),
  generateTitle: boolean('generate_title').notNull(),
  defaultPlugins: json('default_plugins').$type<ToolKey[]>().notNull(),
  whisperSpeechToTextEnabled: boolean(
    'whisper_speech_to_text_enabled'
  ).notNull(),
  dalleImageQuality: dalleImageQualityEnum('dalle_image_quality').notNull(),
  dalleImageSize: dalleImageSizeEnum('dalle_image_size').notNull(),
  maxTokens: integer('max_tokens').notNull(),
  defaultWebSearchEngine: webSearchEngineEnum(
    'default_web_search_engine'
  ).notNull(),
  ollamaBaseUrl: text('ollama_base_url').notNull(),
  topP: decimal('top_p').notNull(),
  topK: decimal('top_k').notNull(),
  googleSearchEngineId: text('google_search_engine_id'),
  googleSearchApiKey: text('google_search_api_key'),
});

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  provider: text('provider').notNull(),
  key: text('key').notNull(),
  organizationId: varchar('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const changelogs = pgTable('changelogs', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  images: text('images').array().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const feedbackTypeEnum = pgEnum('feedback_type', [
  'positive',
  'neutral',
  'negative',
]);

export const feedbacks = pgTable('feedbacks', {
  id: uuid('id').primaryKey().defaultRandom(),
  feedback: text('feedback').notNull(),
  feedbackType: feedbackTypeEnum('feedback_type')
    .$type<(typeof feedbackTypeEnum.enumValues)[number]>()
    .notNull(),
  email: varchar('email', { length: 320 }),
  organizationId: varchar('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  userId: varchar('user_id').references(() => Users.id),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const subscribers = pgTable(
  'subscribers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email').notNull(),
    name: varchar('name'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    userId: varchar('user_id')
      .notNull()
      .references(() => Users.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    userIdIdx: index('subscribers_user_id_idx').on(table.userId),
  })
);

const createId = init({ length: 64, fingerprint: 'random-text' });

export const articles = pgTable(
  'articles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title').notNull(),
    content: text('content'),
    published: boolean('published').default(false),
    slug: varchar('slug', { length: 64 })
      .$defaultFn(() => createId())
      .notNull(),
    views: integer('views').default(0),
    lastNewsletterSentAt: timestamp('last_newsletter_sent_at'),
    seoTitle: varchar('seo_title'),
    seoDescription: varchar('seo_description'),
    ogImage: varchar('og_image'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    publishedAt: timestamp('published_at').defaultNow().notNull(),
    authorId: varchar('author_id')
      .notNull()
      .references(() => Users.id, { onDelete: 'cascade' }),
    canonicalURL: varchar('canonical_url'),
    organizationId: varchar('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    authorSlugUnique: uniqueIndex('articles_author_id_slug_unique').on(
      table.authorId,
      table.slug
    ),
    organizationIdIdx: index('articles_organization_id_idx').on(
      table.organizationId
    ),
  })
);

export const projects = pgTable(
  'projects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title').notNull(),
    content: text('content'),
    published: boolean('published').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    slug: text('slug').notNull(),
    views: integer('views').default(0),
    year: integer('year'),
    description: text('description'),
    url: varchar('url'),
    seoTitle: varchar('seo_title'),
    seoDescription: varchar('seo_description'),
    ogImage: varchar('og_image'),
    password: varchar('password'),
    authorId: varchar('author_id')
      .notNull()
      .references(() => Users.id, { onDelete: 'cascade' }),
    organizationId: varchar('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    authorSlugUnique: uniqueIndex('projects_author_id_slug_unique').on(
      table.authorId,
      table.slug
    ),
    organizationIdIdx: index('projects_organization_id_idx').on(
      table.organizationId
    ),
  })
);

export const collections = pgTable(
  'collections',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name').notNull(),
    authorId: varchar('author_id')
      .notNull()
      .references(() => Users.id, { onDelete: 'cascade' }),
    organizationId: varchar('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    organizationIdIdx: index('collections_organization_id_idx').on(
      table.organizationId
    ),
  })
);

export const bookmarks = pgTable(
  'bookmarks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title').notNull(),
    url: varchar('url').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    authorId: varchar('author_id')
      .notNull()
      .references(() => Users.id, { onDelete: 'cascade' }),
    clicks: integer('clicks').default(0),
    collectionId: uuid('collection_id').references(() => collections.id),
    organizationId: varchar('organization_id')
      .notNull()
      .references(() => organization.id),
  },
  (table) => ({
    organizationIdIdx: index('bookmarks_organization_id_idx').on(
      table.organizationId
    ),
  })
);

export const integrationStatePlatform = pgEnum('integration_state_platform', [
  'YOUTUBE',
  'LINKEDIN',
  'TWITTER',
]);

export const integrationStates = pgTable('integration_state', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  organizationId: varchar('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  creatorId: varchar('creator_id')
    .notNull()
    .references(() => Users.id, { onDelete: 'cascade' }),
  platform: integrationStatePlatform('platform').notNull(),
});

// YouTube installation table
export const youtubeIntegration = pgTable('youtube_integration', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  organizationId: varchar('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  creatorId: varchar('creator_id')
    .notNull()
    .references(() => Users.id, { onDelete: 'cascade' }),

  // OAuth related fields
  accessToken: varchar('access_token').notNull(),
  refreshToken: varchar('refresh_token').notNull(),
  tokenType: varchar('token_type').notNull(),
  scope: varchar('scope').notNull(),
  expiryDate: timestamp('expiry_date', { withTimezone: true }).notNull(),
});

export const integrationStateRelations = relations(
  integrationStates,
  ({ one }) => ({
    organization: one(organization, {
      fields: [integrationStates.organizationId],
      references: [organization.id],
    }),
  })
);

export const youtubeInstallationRelations = relations(
  youtubeIntegration,
  ({ one }) => ({
    organization: one(organization, {
      fields: [youtubeIntegration.organizationId],
      references: [organization.id],
    }),
  })
);

export const document = pgTable(
  'document',
  {
    id: uuid('id').notNull().defaultRandom(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    title: text('title').notNull(),
    content: text('content'),
    kind: varchar('text', { enum: ['text', 'code', 'image', 'sheet'] })
      .notNull()
      .default('text'),
    organizationId: varchar('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    userId: varchar('user_id')
      .notNull()
      .references(() => Users.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  }
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  'suggestion',
  {
    id: uuid('id').notNull().defaultRandom(),
    documentId: uuid('document_id').notNull(),
    documentCreatedAt: timestamp('document_created_at').notNull(),
    originalText: text('original_text').notNull(),
    suggestedText: text('suggested_text').notNull(),
    description: text('description'),
    isResolved: boolean('is_resolved').notNull().default(false),
    organizationId: varchar('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    userId: varchar('user_id')
      .notNull()
      .references(() => Users.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  })
);

export type Suggestion = InferSelectModel<typeof suggestion>;

export const youtubeIntegrationInsertSchema =
  createInsertSchema(youtubeIntegration);

export const organizationUpdateSchema = createUpdateSchema(organization);

export const categories = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull().unique(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [uniqueIndex('name_idx').on(t.name)]
);

export const videoVisibility = pgEnum('video_visibility', [
  'private',
  'public',
]);

export const videos = pgTable('videos', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  muxStatus: text('mux_status'),
  muxAssetId: text('mux_asset_id').unique(),
  muxUploadId: text('mux_upload_id').unique(),
  muxPlaybackId: text('mux_playback_id').unique(),
  muxTrackId: text('mux_track_id').unique(),
  muxTrackStatus: text('mux_track_status'),
  chapters: jsonb('chapters'),
  thumbnailUrl: text('thumbnail_url'),
  thumbnailKey: text('thumbnail_key'),
  previewUrl: text('preview_url'),
  previewKey: text('preview_key'),
  duration: integer('duration'),
  visibility: videoVisibility('visibility').default('private').notNull(),
  userId: uuid('user_id')
    .references(() => Users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  organizationId: uuid('organization_id')
    .references(() => organization.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  categoryId: uuid('category_id').references(() => categories.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const videoViews = pgTable(
  'video_views',
  {
    userId: uuid('user_id')
      .references(() => Users.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    videoId: uuid('video_id')
      .references(() => videos.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: 'video_views_pk',
      columns: [t.userId, t.videoId],
    }),
  ]
);

export const reactionType = pgEnum('reaction_type', ['like', 'dislike']);

export const videoReactions = pgTable(
  'video_reactions',
  {
    userId: uuid('user_id')
      .references(() => Users.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    videoId: uuid('video_id')
      .references(() => videos.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    type: reactionType('type').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: 'video_reactions_pk',
      columns: [t.userId, t.videoId],
    }),
  ]
);

export const videoReactionRelations = relations(videoReactions, ({ one }) => ({
  user: one(Users, {
    fields: [videoReactions.userId],
    references: [Users.id],
  }),
  video: one(videos, {
    fields: [videoReactions.videoId],
    references: [videos.id],
  }),
}));

export const videoReactionSelectSchema = createSelectSchema(videoReactions);
export const videoReactionInsertSchema = createInsertSchema(videoReactions);
export const videoReactionUpdateSchema = createUpdateSchema(videoReactions);

export const videoViewRelations = relations(videoViews, ({ one }) => ({
  user: one(Users, {
    fields: [videoViews.userId],
    references: [Users.id],
  }),
  video: one(videos, {
    fields: [videoViews.videoId],
    references: [videos.id],
  }),
}));

export const videoViewSelectSchema = createSelectSchema(videoViews);
export const videoViewInsertSchema = createInsertSchema(videoViews);
export const videoViewUpdateSchema = createUpdateSchema(videoViews);

export const videoSelectSchema = createSelectSchema(videos);
export const videoInsertSchema = createInsertSchema(videos);
export const videoUpdateSchema = createUpdateSchema(videos);

//NOTE (Optional): Relations work only on application level, does not affect database schema or relations
export const videoRelations = relations(videos, ({ one, many }) => ({
  user: one(Users, {
    fields: [videos.userId],
    references: [Users.id],
  }),
  organization: one(organization, {
    fields: [videos.organizationId],
    references: [organization.id],
  }),
  category: one(categories, {
    fields: [videos.categoryId],
    references: [categories.id],
  }),
  views: many(videoViews),
  reactions: many(videoReactions),
  comments: many(comments),
}));

//NOTE (Optional): Relations work only on application level, does not affect database schema or relations
// user can have many videos
// user can have many video views
// user can have many video reactions
// user can have many subscriptions
// user can have many subscribers
export const userRelations = relations(Users, ({ many, one }) => ({
  videos: many(videos),
  videoViews: many(videoViews),
  videoReactions: many(videoReactions),
  subscriptions: many(subscriptions, {
    relationName: 'subscriptions_viewer_id_fkey',
  }),
  subscribers: many(subscriptions, {
    relationName: 'subscriptions_creator_id_fkey',
  }),
  comments: many(comments),
  commentReactions: many(commentReactions),
  profile: one(Profile, {
    fields: [Users.id],
    references: [Profile.id],
  }),
  commentCategories: many(commentCategoryTable),
  commenterCategories: many(commenterCategoryTable),
}));

//NOTE (Optional): Relations work only on application level, does not affect database schema or relations
// organization can have many videos
export const organizationRelations = relations(organization, ({ many }) => ({
  videos: many(videos),
}));

//NOTE (Optional): Relations work only on application level, does not affect database schema or relations
// category can have many videos
export const categoryRelations = relations(categories, ({ many }) => ({
  videos: many(videos),
}));

export const subscriptions = pgTable(
  'subscriptions',
  {
    viewerId: uuid('viewer_id')
      .references(() => Users.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    creatorId: uuid('creator_id')
      .references(() => Users.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: 'subscriptions_pk',
      columns: [t.viewerId, t.creatorId],
    }),
  ]
);

export const commenterCategoryTable = pgTable(
  'commenter_category',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    name: text('name').notNull(),
    description: text('description'),
    userId: uuid('user_id')
      .notNull()
      .references(() => Users.id, { onDelete: 'cascade' }),
  },
  (t) => [
    uniqueIndex('commenter_category_name_user_id_idx').on(t.name, t.userId),
  ]
);

export const commentCategoryTable = pgTable(
  'comment_category',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    name: text('name').notNull(),
    description: text('description'),
    userId: uuid('user_id')
      .notNull()
      .references(() => Users.id, { onDelete: 'cascade' }),
  },
  (t) => [uniqueIndex('comment_category_name_user_id_idx').on(t.name, t.userId)]
);

export const ruleCommentCategoryTable = pgTable(
  'rule_comment_category',
  {
    ruleId: uuid('rule_id')
      .notNull()
      .references(() => rule.id, { onDelete: 'cascade' }),
    commentCategoryId: uuid('comment_category_id')
      .notNull()
      .references(() => commentCategoryTable.id, { onDelete: 'cascade' }),
  },
  (t) => [
    uniqueIndex('rule_comment_category_idx').on(t.ruleId, t.commentCategoryId),
  ]
);

export const ruleCommenterCategoryTable = pgTable(
  'rule_commenter_category',
  {
    ruleId: uuid('rule_id')
      .notNull()
      .references(() => rule.id, { onDelete: 'cascade' }),
    commenterCategoryId: uuid('commenter_category_id')
      .notNull()
      .references(() => commenterCategoryTable.id, { onDelete: 'cascade' }),
  },
  (t) => [
    uniqueIndex('rule_commenter_category_idx').on(
      t.ruleId,
      t.commenterCategoryId
    ),
  ]
);

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  viewer: one(Users, {
    fields: [subscriptions.viewerId],
    references: [Users.id],
    relationName: 'subscriptions_viewer_id_fkey',
  }),
  creator: one(Users, {
    fields: [subscriptions.creatorId],
    references: [Users.id],
    relationName: 'subscriptions_creator_id_fkey',
  }),
}));

export const comments = pgTable(
  'comments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    parentId: uuid('parent_id'),
    userId: uuid('user_id')
      .references(() => Users.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    videoId: uuid('video_id')
      .references(() => videos.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    value: text('value').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => {
    return [
      foreignKey({
        columns: [t.parentId],
        foreignColumns: [t.id],
        name: 'comments_parent_id_fkey',
      }),
    ];
  }
);

export const commentRelations = relations(comments, ({ one, many }) => ({
  user: one(Users, {
    fields: [comments.userId],
    references: [Users.id],
  }),
  video: one(videos, {
    fields: [comments.videoId],
    references: [videos.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'comments_parent_id_fkey',
  }),
  replies: many(comments, {
    relationName: 'comments_parent_id_fkey',
  }),
  reactions: many(commentReactions),
}));

export const commentSelectSchema = createSelectSchema(comments);
export const commentInsertSchema = createInsertSchema(comments);
export const commentUpdateSchema = createUpdateSchema(comments);

export const commentReactions = pgTable(
  'comment_reactions',
  {
    userId: uuid('user_id')
      .references(() => Users.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    commentId: uuid('comment_id')
      .references(() => comments.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    type: reactionType('type').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: 'comment_reactions_pk',
      columns: [t.userId, t.commentId],
    }),
  ]
);

export const commentReactionRelations = relations(
  commentReactions,
  ({ one }) => ({
    user: one(Users, {
      fields: [commentReactions.userId],
      references: [Users.id],
    }),
    comment: one(comments, {
      fields: [commentReactions.commentId],
      references: [comments.id],
    }),
  })
);

// Relations for commenterCategoryTable
export const commenterCategoryRelations = relations(
  commenterCategoryTable,
  ({ one, many }) => ({
    user: one(Users, {
      fields: [commenterCategoryTable.userId],
      references: [Users.id],
    }),
    rules: many(ruleCommenterCategoryTable), // Links to the join table
  })
);

// Relations for commentCategoryTable
export const commentCategoryRelations = relations(
  commentCategoryTable,
  ({ one, many }) => ({
    user: one(Users, {
      fields: [commentCategoryTable.userId],
      references: [Users.id],
    }),
    rules: many(ruleCommentCategoryTable), // Links to the join table
  })
);

// Relations for ruleCommentCategoryTable
export const ruleCommentCategoryRelations = relations(
  ruleCommentCategoryTable,
  ({ one }) => ({
    rule: one(rule, {
      fields: [ruleCommentCategoryTable.ruleId],
      references: [rule.id],
    }),
    commentCategory: one(commentCategoryTable, {
      fields: [ruleCommentCategoryTable.commentCategoryId],
      references: [commentCategoryTable.id],
    }),
  })
);

// Relations for ruleCommenterCategoryTable
export const ruleCommenterCategoryRelations = relations(
  ruleCommenterCategoryTable,
  ({ one }) => ({
    rule: one(rule, {
      fields: [ruleCommenterCategoryTable.ruleId],
      references: [rule.id],
    }),
    commenterCategory: one(commenterCategoryTable, {
      fields: [ruleCommenterCategoryTable.commenterCategoryId],
      references: [commenterCategoryTable.id],
    }),
  })
);

export const ruleRelations = relations(rule, ({ many, one }) => ({
  actions: many(action),
  executedRules: many(executedRule),
  threadTrackers: many(threadTracker),
  group: one(group, {
    fields: [rule.groupId],
    references: [group.id],
  }),
  categoryFilters: many(commentCategoryTable),
  commentCategories: many(ruleCommentCategoryTable),
  commenterCategories: many(ruleCommenterCategoryTable),
}));

export const schema = {
  organization,
  organizationUpdateSchema,
  apiKeys,
  assistants,
  chatMessages,
  chatSessions,
  preferences,
  prompts,
  feedbacks,
  changelogs,
  customAssistants,
  collections,
  bookmarks,
  projects,
  articles,
  subscribers,
  premium,
  integrationStates,
  youtubeIntegration,
  document,
  suggestion,
};
