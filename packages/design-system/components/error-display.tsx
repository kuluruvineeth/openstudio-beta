'use client';

import { Button } from '@repo/design-system/components/ui/button';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import type React from 'react';
import { Panel } from './panel';

// TODO would be better to have a consistent definition here. didn't want to break things.
export function ErrorDisplay(props: {
  error: { info?: { error: string }; error?: string };
}) {
  // biome-ignore lint/style/useBlockStatements: <explanation>
  if (props.error?.info?.error || props.error?.error)
    return (
      <NotFound>
        <p>There was an error:</p>
        <p>{props.error?.info?.error || props.error?.error}</p>
      </NotFound>
    );

  if (props.error) {
    return (
      <NotFound>
        <p>There was an error.</p>
        <p>
          Please refresh or contact support at{' '}
          <a href={'mailto:support@openstudio.tech'}>support@openstudio.tech</a>{' '}
          if the error persists.
        </p>
      </NotFound>
    );
  }

  return null;
}

const NotFound = (props: { children: React.ReactNode }) => {
  return (
    <div className="text-gray-700">
      <Panel>{props.children}</Panel>
    </div>
  );
};

export const NotLoggedIn = () => {
  return (
    <div className="flex flex-col items-center justify-center sm:p-20 md:p-32">
      <div className="text-gray-700 text-lg">You are not signed in 😞</div>
      <Button
        variant="outline"
        className="mt-2"
        onClick={() => redirect('/sign-in')}
      >
        Sign in
      </Button>
      <div className="mt-8">
        <Image
          src="/images/illustrations/falling.svg"
          alt=""
          width={400}
          height={400}
          unoptimized
          className="dark:brightness-90 dark:invert"
        />
      </div>
    </div>
  );
};
