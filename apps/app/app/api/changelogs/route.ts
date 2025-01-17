import { database } from '@repo/database';
import { schema } from '@repo/database/schema';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const changelogs = await database.select().from(schema.changelogs);
  return NextResponse.json({ changelogs });
}
