import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      MUX_TOKEN_ID: z.string().min(1),
      MUX_TOKEN_SECRET: z.string().min(1),
    },
    runtimeEnv: {
      MUX_TOKEN_ID: process.env.MUX_TOKEN_ID,
      MUX_TOKEN_SECRET: process.env.MUX_TOKEN_SECRET,
    },
  });
