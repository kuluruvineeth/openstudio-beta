import { PageLayout } from '@/app/(organization)/voice/components/page-layout';
import { SoundEffectsGenerator } from '@/app/(organization)/voice/components/sound-effects/sound-effects-generator';

// biome-ignore lint/suspicious/useAwait: <explanation>
export default async function SoundEffectsGeneratePage() {
  const credits = 0;

  const soundEffectsTabs = [
    {
      name: 'Generate',
      path: '/app/sound-effects/generate',
    },
    {
      name: 'History',
      path: '/app/sound-effects/history',
    },
  ];

  return (
    <PageLayout
      title={'Sound Effects'}
      showSidebar={false}
      tabs={soundEffectsTabs}
      service="openstudio/seed-vc-api"
    >
      <SoundEffectsGenerator credits={credits} />
    </PageLayout>
  );
}
