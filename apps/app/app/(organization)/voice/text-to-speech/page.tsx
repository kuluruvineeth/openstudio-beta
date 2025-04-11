import { PageLayout } from '@/app/(organization)/voice/components/page-layout';
import { TextToSpeechEditor } from '@/app/(organization)/voice/components/speech-synthesis/text-to-speech-editor';
// import { getHistoryItems } from '@/lib/history';

// biome-ignore lint/suspicious/useAwait: <explanation>
export default async function TextToSpeechPage() {
  const service = 'openstudio/voice-api';

  //   const historyItems = await getHistoryItems(service);

  return (
    <PageLayout
      title={'Text to Speech'}
      service={service}
      showSidebar={true}
      //   historyItems={historyItems}
    >
      <TextToSpeechEditor service={service} credits={1000} />
    </PageLayout>
  );
}
