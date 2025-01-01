import { usePreferences } from '@/app/hooks/use-preferences';
import { ArrowRight, Info } from '@phosphor-icons/react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@repo/design-system/components/ui/alert';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { useEffect, useState } from 'react';

export const OpenAISettings = () => {
  const [key, setKey] = useState<string>('');
  const { getApiKey, setApiKey } = usePreferences();
  useEffect(() => {
    getApiKey('openai').then((key) => {
      if (key) {
        setKey(key);
      }
    });
  }, []);
  return (
    <div className="flex flex-col items-start gap-2 px-4">
      <p className="py-4 font-medium text-md text-white">OpenAI Settings</p>
      <div className="flex flex-row items-end justify-between">
        <p className="text-xs text-zinc-500">Open AI API Key</p>
      </div>
      <Input
        placeholder="Sk-xxxxxxxxxxxxxxxxxxxxxxxx"
        value={key}
        type="password"
        autoComplete="off"
        onChange={(e) => {
          setKey(e.target.value);
          setApiKey('openai', e.target.value);
        }}
      />
      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          window.open('https://platform.openai.com/account/api-keys', '_blank');
        }}
      >
        Get your API key here <ArrowRight size={16} weight="bold" />
      </Button>
      <Alert variant="success">
        <Info className="h-4 w-4" />
        <AlertTitle>Attention!</AlertTitle>
        <AlertDescription>
          Your API Key is stored locally on your browser and never sent anywhere
          else.
        </AlertDescription>
      </Alert>
    </div>
  );
};
