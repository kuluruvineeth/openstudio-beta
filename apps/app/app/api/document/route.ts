import type { ArtifactKind } from '@/app/(organization)/artifacts/components/v2/artifact';
import {
  deleteDocumentsByIdAfterTimestamp,
  getDocumentsById,
  saveDocument,
} from '@/lib/queries';
import { currentUser } from '@repo/backend/auth/utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  const user = await currentUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const documents = await getDocumentsById({ id });

  const [document] = documents;

  if (!document) {
    return new Response('Not Found', { status: 404 });
  }

  if (document.userId !== user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  return Response.json(documents, { status: 200 });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  const user = await currentUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const {
    content,
    title,
    kind,
  }: { content: string; title: string; kind: ArtifactKind } =
    await request.json();

  if (user?.id) {
    const document = await saveDocument({
      id,
      content,
      title,
      kind,
      userId: user.id,
      organizationId: user.user_metadata.organization_id,
    });

    return Response.json(document, { status: 200 });
  }
  return new Response('Unauthorized', { status: 401 });
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const { timestamp }: { timestamp: string } = await request.json();

  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  const user = await currentUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const documents = await getDocumentsById({ id });

  const [document] = documents;

  if (document.userId !== user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  await deleteDocumentsByIdAfterTimestamp({
    id,
    timestamp: new Date(timestamp),
  });

  return new Response('Deleted', { status: 200 });
}
