'use server';

import { getProjectById } from '@/actions/projects';

export async function unlockProject(prev: any, data: FormData) {
  const projectId = data.get('projectId') as string;
  const pw = data.get('password') as string;
  const project = await getProjectById(projectId);
  if (!project) {
    return {
      error: 'Project not found',
    };
  }

  if (project[0].password === pw) {
    return {
      unlocked: true,
    };
  }
  return {
    error: 'Incorrect Password',
  };
}
