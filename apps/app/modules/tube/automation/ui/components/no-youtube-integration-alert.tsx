import { AlertWithButton } from '@repo/design-system/components/ui';
import { Button } from '@repo/design-system/components/ui/button';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-component';
import { YoutubeIcon } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

export function NoYoutubeIntegrationTooltip(props: {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  children: React.ReactElement<any>;
  showTooltip: boolean;
  openModal: () => void;
}) {
  if (!props.showTooltip) return props.children;

  return (
    <Tooltip
      contentComponent={
        <NoYoutubeIntegrationTooltipContent openModal={props.openModal} />
      }
    >
      <span>{props.children}</span>
    </Tooltip>
  );
}

export function NoYoutubeIntegrationTooltipContent({
  openModal,
}: {
  // biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
  openModal: () => void;
}) {
  return (
    <div className="text-center">
      <p>
        You{"'"}re not connected to Youtube yet. Please connect to Youtube to
        use this feature.
      </p>
      <Button onClick={openModal}>
        <Link href="/settings/integrations">
          <YoutubeIcon />
        </Link>
      </Button>
    </div>
  );
}

export function YoutubeIntegrationAlert({ className }: { className?: string }) {
  return (
    <div className={className}>
      <AlertWithButton
        title="Youtube Integration"
        description={
          <p>
            You{"'"}re not connected to Youtube yet. Please connect to Youtube
            to use this feature.
          </p>
        }
        button={
          <Button variant="outline" prefixIcon={YoutubeIcon}>
            <Link href="/settings/integrations">Connect</Link>
          </Button>
        }
        variant="destructive"
      />
    </div>
  );
}
