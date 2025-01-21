'use server';
import { OpenStudioRole } from '@repo/backend/auth';
import { createClient } from '@repo/backend/auth/server';
import {
  currentMembers,
  currentOrganizationId,
  currentUser,
} from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { schema } from '@repo/backend/schema';
import { parseError } from '@repo/observability/error';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const inviteMember = async (
  email: string,
  role: OpenStudioRole
): Promise<
  | {
      error: string;
    }
  | {
      message: string;
    }
> => {
  try {
    const [user, organizationId, members, supabase] = await Promise.all([
      currentUser(),
      currentOrganizationId(),
      currentMembers(),
      createClient(),
    ]);

    if (!user) {
      throw new Error('Not logged in');
    }

    if (user.user_metadata.organization_role !== OpenStudioRole.Admin) {
      throw new Error('You are not authorized to invite users');
    }

    if (!organizationId) {
      throw new Error('Not logged in');
    }

    const organization = await database
      .select()
      .from(schema.organization)
      .where(eq(schema.organization.id, organizationId));

    if (!organization) {
      throw new Error('Organization not found');
    }

    const users = await supabase.auth.admin.listUsers();
    const existingMember = users.data.users.find(
      (user) => user.email === email
    );

    if (existingMember) {
      if (existingMember.user_metadata.organization_id === organizationId) {
        throw new Error('This user is already a member of your organization');
      }

      throw new Error('This user is already a member of another organization');
    }

    const response = await supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        organization_role: role,
        organization_id: organizationId,
      },
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    revalidatePath('/settings/members');

    return { message: 'Member invited successfully' };
  } catch (error) {
    const message = parseError(error);

    return { error: message };
  }
};
