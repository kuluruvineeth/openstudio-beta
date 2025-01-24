'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Icons } from '@repo/design-system/components/ui/icons';
import { toast } from '@repo/design-system/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function CreateProject() {
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();
  async function onClick() {
    startTransition(async () => {
      const project = await createProject();
      if (project) {
        router.push(`/minime/projects/${project.id}`);
        router.refresh();
      }
    });
  }

  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={onClick}
      disabled={isLoading}
      aria-label="New project"
    >
      {isLoading && <Icons.spinner className="animate-spin" size={15} />} New
      project
    </Button>
  );
}

export async function createProject() {
  const res = await fetch('/api/projects', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Untitled project',
      content: 'My new project',
      year: new Date().getFullYear(),
      description: 'my first project',
    }),
  });
  if (!res?.ok) {
    const body = await res.text();

    toast({
      title: 'Something went wrong.',
      description: body,
    });
    return null;
  }
  return await res.json();
}
