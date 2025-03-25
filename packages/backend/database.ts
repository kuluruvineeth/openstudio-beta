import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { keys } from './keys';
import * as schema from './schema';
const env = keys();
const client = postgres(env.POSTGRES_DATABASE_URL, { prepare: false });

export const database = drizzle(client, { schema });

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
