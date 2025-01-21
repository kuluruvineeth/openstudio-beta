import { keys as analytics } from '@repo/analytics/keys';
import { keys as collaboration } from '@repo/collaboration/keys';
import { keys as database } from '@repo/backend/keys';
import { keys as email } from '@repo/email/keys';
import { keys as flags } from '@repo/feature-flags/keys';
import { keys as core } from '@repo/next-config/keys';
import { keys as observability } from '@repo/observability/keys';
import { keys as ratelimit } from '@repo/rate-limit/keys';
import { keys as security } from '@repo/security/keys';
import { keys as webhooks } from '@repo/webhooks/keys';
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  extends: [
    analytics(),
    collaboration(),
    core(),
    database(),
    email(),
    flags(),
    observability(),
    security(),
    webhooks(),
    ratelimit(),
  ],
  server: {},
  client: {
    NEXT_PUBLIC_OPENAI_API_KEY: z.string().min(1).startsWith('sk-').optional(),
    NEXT_PUBLIC_TAVILY_API_KEY: z
      .string()
      .min(1)
      .startsWith('tvly-')
      .optional(),
    NEXT_PUBLIC_HUGEICONS_API_KEY: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    NEXT_PUBLIC_TAVILY_API_KEY: process.env.NEXT_PUBLIC_TAVILY_API_KEY,
    NEXT_PUBLIC_HUGEICONS_API_KEY: process.env.NEXT_PUBLIC_HUGEICONS_API_KEY,
  },
});
