import { initialArtifactData, useArtifact } from '@/hooks/use-artifact';
import { Button } from '@repo/design-system/components/ui/button';
import { CrossIcon } from '@repo/design-system/components/ui/icons';
import { memo } from 'react';
import type { UIArtifact } from './artifact';
function PureArtifactCloseButton() {
  const { setArtifact } = useArtifact();

  return (
    <Button
      variant="outline"
      className="h-fit p-2 dark:hover:bg-zinc-700"
      onClick={() => {
        setArtifact((currentArtifact: UIArtifact) =>
          currentArtifact.status === 'streaming'
            ? {
                ...currentArtifact,
                isVisible: false,
              }
            : { ...initialArtifactData, status: 'idle' }
        );
      }}
    >
      <CrossIcon size={18} />
    </Button>
  );
}

export const ArtifactCloseButton = memo(PureArtifactCloseButton, () => true);
