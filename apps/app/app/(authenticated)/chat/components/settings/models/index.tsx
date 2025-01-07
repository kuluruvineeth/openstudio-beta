import {
  ModelIcon,
  type ModelIconType,
} from '@/app/(authenticated)/chat/components/model-icon';
import { AnthropicSettings } from '@/app/(authenticated)/chat/components/settings/models/anthropic';
import { GeminiSettings } from '@/app/(authenticated)/chat/components/settings/models/gemini';
import { OllamaSettings } from '@/app/(authenticated)/chat/components/settings/models/ollama';
import { OpenAISettings } from '@/app/(authenticated)/chat/components/settings/models/openai';
import { usePreferenceContext } from '@/context/preferences';
import { useSettingsContext } from '@/context/settings';
import type { TBaseModel } from '@/types';
import { AlertCircleIcon, CheckmarkCircle02Icon } from '@hugeicons/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/design-system/components/ui/accordion';
import { Flex } from '@repo/design-system/components/ui/flex';
import { cn } from '@repo/design-system/lib/utils';
import { useEffect, useState } from 'react';

export const ModelSettings = () => {
  const { selected } = useSettingsContext();
  const { apiKeys, preferences, updatePreferences } = usePreferenceContext();
  const [selectedModel, setSelectedModel] = useState<TBaseModel>('openai');

  const [ollamaConnected, setOllamaConnected] = useState(false);
  const checkOllamaConnection = async () => {
    try {
      const url = preferences.ollamaBaseUrl;
      const response = await fetch(url + '/api/tags');
      setOllamaConnected(true);
    } catch (error) {
      setOllamaConnected(false);
    }
  };
  useEffect(() => {
    checkOllamaConnection();
  }, [preferences.ollamaBaseUrl]);

  useEffect(() => {
    if (selected.startsWith('models/')) {
      const model = selected?.split('/')?.[1];
      setSelectedModel(model as TBaseModel);
    }
  }, [selected]);
  const modelSettingsData = [
    {
      value: 'openai',
      label: 'OpenAI',
      iconType: 'openai',
      connected: !!apiKeys.openai,
      settingsComponent: OpenAISettings,
    },
    {
      value: 'anthropic',
      label: 'Anthropic',
      iconType: 'anthropic',
      connected: !!apiKeys.anthropic,
      settingsComponent: AnthropicSettings,
    },
    {
      value: 'gemini',
      label: 'Gemini',
      iconType: 'gemini',
      connected: !!apiKeys.gemini,
      settingsComponent: GeminiSettings,
    },
    {
      value: 'ollama',
      label: 'Ollama',
      iconType: 'ollama',
      connected: ollamaConnected,
      settingsComponent: OllamaSettings,
    },
  ];
  return (
    <Flex direction="col" gap="sm" className="p-4">
      <Accordion
        type="single"
        value={selectedModel}
        collapsible
        className="w-full"
        onValueChange={(value) => {
          setSelectedModel(value as TBaseModel);
        }}
      >
        {modelSettingsData.map((model) => (
          <AccordionItem key={model.value} value={model.value}>
            <AccordionTrigger>
              <Flex gap="sm" items="center">
                <ModelIcon type={model.iconType as ModelIconType} size="sm" />
                {model.label}
              </Flex>
              <Flex className="flex-1" />
              <div
                className={cn(
                  '!rotate-0 px-2',
                  model.connected ? 'text-emerald-400' : 'text-zinc-500'
                )}
              >
                {model.connected ? (
                  <CheckmarkCircle02Icon
                    size={20}
                    strokeWidth={1.5}
                    variant="solid"
                  />
                ) : (
                  <AlertCircleIcon
                    size={20}
                    strokeWidth={1.5}
                    variant="solid"
                  />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <model.settingsComponent />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Flex>
  );
};
