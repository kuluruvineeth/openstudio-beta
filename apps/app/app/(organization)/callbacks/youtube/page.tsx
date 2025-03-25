import { currentOrganizationId, currentUser } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import {
  integrationStates,
  organization,
  youtubeIntegration,
  youtubeIntegrationInsertSchema,
} from '@repo/backend/schema';
import { createMetadata } from '@repo/seo/metadata';
import { getOAuth2Client, getYouTubeChannelId } from '@repo/youtube';
import { and, eq, sql } from 'drizzle-orm';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = createMetadata({
  title: 'Processing',
  description: 'Please wait while we process your request.',
});

type YoutubeCallbackPageProperties = {
  readonly searchParams: Promise<Record<string, string>>;
};

const YoutubeCallbackPage = async (props: YoutubeCallbackPageProperties) => {
  const searchParams = await props.searchParams;
  const { code, state, error, error_description } = searchParams;
  const [user, organizationId] = await Promise.all([
    currentUser(),
    currentOrganizationId(),
  ]);

  if (error) {
    throw new Error(error_description);
  }

  const youtubeAuthData = await getOAuth2Client().getToken(code);

  if (!user || !organizationId || !code || !state) {
    notFound();
  }

  // Count installation states
  const installationState = await database
    .select({ count: sql`count(*)` })
    .from(integrationStates)
    .where(
      and(
        eq(integrationStates.id, state),
        eq(integrationStates.platform, 'YOUTUBE'),
        eq(integrationStates.creatorId, user.id)
      )
    );

  if (!installationState[0].count) {
    throw new Error('State parameter is invalid');
  }

  // Delete installation state
  await database
    .delete(integrationStates)
    .where(eq(integrationStates.id, state))
    .returning({ id: integrationStates.id });

  try {
    const result = await database.transaction(async (tx) => {
      // Step 1: Insert YouTube integration data
      const integrationResult = await tx
        .insert(youtubeIntegration)
        .values(
          youtubeIntegrationInsertSchema.parse({
            organizationId,
            creatorId: user.id,
            accessToken: youtubeAuthData.tokens.access_token,
            refreshToken: youtubeAuthData.tokens.refresh_token,
            tokenType: youtubeAuthData.tokens.token_type,
            scope: youtubeAuthData.tokens.scope,
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            expiryDate: new Date(youtubeAuthData.tokens.expiry_date!),
          })
        )
        .returning();

      if (!integrationResult || integrationResult.length === 0) {
        throw new Error('Failed to insert YouTube integration data');
      }

      // Step 2: Fetch YouTube channel ID
      const channelResponse = await getYouTubeChannelId(
        organizationId,
        integrationResult
      );

      if (!channelResponse?.items || channelResponse.items.length === 0) {
        throw new Error('YouTube channel ID not found');
      }

      const channelId = channelResponse.items[0].id;

      if (!channelId) {
        throw new Error('Invalid YouTube channel ID');
      }

      // Step 3: Update organization with YouTube channel ID
      const updateResult = await tx
        .update(organization)
        .set({ youtubeChannelId: channelId })
        .where(eq(organization.id, organizationId))
        .returning({ id: organization.id });

      if (!updateResult || updateResult.length === 0) {
        throw new Error(
          'Failed to update organization with YouTube channel ID'
        );
      }
    });
  } catch (error) {
    // Log the error for debugging
    console.error('YouTube integration error:', error);
    throw error;
  }
  // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
  return redirect(`/settings/integrations`);
};

export default YoutubeCallbackPage;
