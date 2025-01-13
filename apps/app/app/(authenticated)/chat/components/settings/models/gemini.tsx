import { ApiKeyInfo } from '@/app/(authenticated)/chat/components/settings/models/api-key-info';
import ApiKeyInput from '@/app/(authenticated)/chat/components/settings/models/api-key-input';
import { configs } from '@/config';
import { usePreferenceContext } from '@/context/preferences';
import { useLLMTest } from '@/hooks/use-llm-test';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { FormLabel } from '@repo/design-system/components/ui/form-label';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const GeminiSettings = () => {
  const [key, setKey] = useState<string>('');
  const { apiKeys, updateApiKey } = usePreferenceContext();
  const { checkApiKey, isCheckingApiKey } = useLLMTest();

  useEffect(() => {
    setKey(apiKeys.gemini || '');
  }, [apiKeys.gemini]);

  return (
    <Flex direction="col" gap="sm">
      <FormLabel
        label="Google Gemini API Key"
        extra={() => (
          <Link
            href={configs.geminiApiKeyUrl}
            target="_blank"
            className="font-medium text-blue-400 text-sm hover:opacity-90"
          >
            Get API key here
          </Link>
        )}
      />
      <ApiKeyInput
        value={key}
        setValue={setKey}
        isDisabled={!!apiKeys.gemini}
        placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
        isLocked={!!apiKeys.gemini}
      />

      <Flex gap="sm">
        {!apiKeys.gemini && (
          <Button
            size="sm"
            variant="default"
            onClick={() => {
              checkApiKey({
                model: 'gemini',
                key,
                onValidated: () => {
                  updateApiKey('gemini', key);
                },
                onError: () => {
                  setKey('');
                },
              });
            }}
          >
            {isCheckingApiKey ? 'Checking...' : 'Save Key'}
          </Button>
        )}

        {apiKeys?.gemini && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setKey('');
              updateApiKey('gemini', '');
            }}
          >
            Remove Key
          </Button>
        )}
      </Flex>
      <ApiKeyInfo />
    </Flex>
  );
};
