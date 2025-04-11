import { PageLayout } from '@/app/(organization)/voice/components/page-layout';
import { VoiceChanger } from '@/app/(organization)/voice/components/speech-synthesis/voice-changer';

// biome-ignore lint/suspicious/useAwait: <explanation>
export default async function SpeechToSpeechPage() {
  const service = 'openstudio/seed-vc-api';

  return (
    <PageLayout
      title={'Voice Changer'}
      service={service}
      showSidebar={true}
      //   historyItems={historyItems}
    >
      <VoiceChanger credits={1000} service={service} />
    </PageLayout>
  );
}
