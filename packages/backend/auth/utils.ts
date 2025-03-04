import { createClient } from './server';

export const currentUser = async () => {
  const client = await createClient();
  const { data } = await client.auth.getUser();
  return data.user;
};

export const getUserByDomain = async (domain: string) => {
  const client = await createClient();
  const { data } = await client.auth.admin.listUsers({
    perPage: 100_000,
  });
  return data.users.find(
    (user) =>
      user.user_metadata.domain === domain ||
      user.user_metadata.username === domain
  );
};

// get user by id
export const getUserById = async (id: string) => {
  const client = await createClient();
  const { data } = await client.auth.admin.getUserById(id);
  return data.user;
};

// update user newsletter
export const updateUserNewsletter = async (id: string, newsletter: boolean) => {
  const client = await createClient();
  const response = await client.auth.admin.updateUserById(id, {
    user_metadata: {
      newsletter,
    },
  });
  return response;
};

// get user by username
export const getUserByUsername = async (username: string) => {
  const client = await createClient();
  const { data } = await client.auth.admin.listUsers({
    perPage: 100_000,
  });
  return data.users.find((user) => user.user_metadata.username === username);
};

export const getAllUserDomains = async () => {
  const client = await createClient();
  const { data } = await client.auth.admin.listUsers({
    perPage: 100_000,
  });
  // return only domain and username
  return data.users.map((user) => ({
    domain: user.user_metadata.domain,
    username: user.user_metadata.username,
  }));
};

export const currentOrganizationId = async () => {
  const user = await currentUser();
  if (
    !user ||
    typeof user.user_metadata.organization_id !== 'string' ||
    !user.user_metadata.organization_id
  ) {
    return null;
  }

  return user!.user_metadata.organization_id;
};

export const getMembers = async (organizationId: string) => {
  const client = await createClient();

  if (!organizationId) {
    return [];
  }

  const users = await client.auth.admin.listUsers({
    perPage: 100_000,
  });

  const members = users.data.users.filter(
    (user) => user.user_metadata.organization_id === organizationId
  );

  return members;
};

export const currentMembers = async () => {
  const organizationId = await currentOrganizationId();

  if (!organizationId) {
    return [];
  }

  return getMembers(organizationId);
};
