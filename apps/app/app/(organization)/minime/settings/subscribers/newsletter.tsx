'use client';

import { Icons } from '@repo/design-system/components/ui/icons';
import { Switch } from '@repo/design-system/components/ui/switch';
import { toast } from '@repo/design-system/components/ui/use-toast';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { newsletterToggle } from './actions';

export default function Newsletter({ checked }: { checked: boolean }) {
  const [state, formAction] = useFormState(newsletterToggle, null);
  useEffect(() => {
    if (state?.error) {
      toast({
        title: state?.error,
      });
    }
    if (state?.status) {
      toast({
        title:
          state?.status === 'on'
            ? 'Newsletter is active'
            : 'Newsletter is inactive',
      });
    }
  }, [state?.error, state?.status]);

  return (
    <form action={formAction} className="flex items-center gap-2">
      <label htmlFor="newsletter-toggle" className="text-gray-4 text-xs">
        Newsletter
      </label>

      <Toggle checked={checked} />
    </form>
  );
}

function Toggle({ checked }: { checked: boolean }) {
  const { pending } = useFormStatus();
  return (
    <>
      <Switch
        type="submit"
        name="newsletter"
        id="newsletter-toggle"
        aria-label="Newsletter Toggle"
        defaultChecked={checked}
      />
      {pending && (
        <Icons.spinner size={15} className="animate-spin text-gray-1" />
      )}
    </>
  );
}
