import { database } from '@repo/backend/database';
import { schema } from '@repo/backend/schema';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const data = await database.select().from(schema.customAssistants);
  return NextResponse.json({ assistants: data || [] });
}
