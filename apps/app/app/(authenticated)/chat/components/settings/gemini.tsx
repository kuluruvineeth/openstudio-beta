import { SettingsContainer } from '@/app/(authenticated)/chat/components/settings/settings-container';
import { useLLMTest } from '@/app/hooks/use-llm-test';
import { usePreferences } from '@/app/hooks/use-preferences';
import { ArrowRight, Info } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { useEffect, useState } from 'react';

export const GeminiSettings = () => {
  const [key, setKey] = useState<string>('');
  const { getApiKey, setApiKey } = usePreferences();
  const { renderSaveApiKeyButton } = useLLMTest();
  useEffect(() => {
    getApiKey('gemini').then((key) => {
      if (key) {
        setKey(key);
      }
    });
  }, []);
  return (
    <SettingsContainer title="Gemini Settings">
      <div className="flex flex-row items-end justify-between">
        <p className="text-sm text-zinc-500 md:text-base">
          Google Gemini API Key
        </p>
      </div>
      <Input
        placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
        type="password"
        autoComplete="off"
        value={key}
        onChange={(e) => {
          setKey(e.target.value);
        }}
      />
      <div className="flex flex-row items-center gap-2">
        {renderSaveApiKeyButton('gemini', key, () => {
          setApiKey('gemini', key);
        })}
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            window.open('https://aistudio.google.com/app/apikey', '_blank');
          }}
        >
          Get your API key here <ArrowRight size={16} weight="bold" />
        </Button>
      </div>
      <div className="flex flex-row items-start gap-1 py-2 text-zinc-500">
        <Info size={16} weight="bold" />
        <p className=" text-xs">
          Your API Key is stored locally on your browser and never sent anywhere
          else.
        </p>
      </div>
    </SettingsContainer>
  );
};
