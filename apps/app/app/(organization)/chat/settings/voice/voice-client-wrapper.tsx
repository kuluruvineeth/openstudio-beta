'use client';

import { SettingCard } from '@/app/(organization)/chat/components/settings/setting-card';
import { SettingsContainer } from '@/app/(organization)/chat/components/settings/settings-container';
import { usePreferenceContext } from '@/context/preferences';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Switch } from '@repo/design-system/components/ui/switch';
import { Type } from '@repo/design-system/components/ui/text';

export default function VoiceClientWrapper() {
  const { updatePreferences, preferences } = usePreferenceContext();

  return (
    <SettingsContainer title="Voice Settings">
      <SettingCard className="flex flex-col justify-center py-5">
        <Flex justify="between" items="center">
          <Flex direction="col" items="start">
            <Type textColor="primary" weight="medium">
              Enable Whisper Speech-to-Text
            </Type>
            <Type size="xs" textColor="tertiary">
              OpenAI API key required.
            </Type>
          </Flex>
          <Switch
            checked={preferences?.whisperSpeechToTextEnabled}
            onCheckedChange={(checked) => {
              updatePreferences({
                whisperSpeechToTextEnabled: checked,
              });
            }}
          />
        </Flex>
      </SettingCard>
    </SettingsContainer>
  );
}
