import { defaultPreferences } from '@/config';
import { usePreferenceContext } from '@/context/preferences';
import { useAssistantUtils } from '@/hooks/use-assistant-utils';
import type { TPreferences } from '@/types';
import { ArrowClockwise, Info } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Settings03Icon } from '@repo/design-system/components/ui/icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/design-system/components/ui/popover';
import { Slider } from '@repo/design-system/components/ui/slider';
import { Type } from '@repo/design-system/components/ui/text';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { useState } from 'react';

export const QuickSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { preferences, updatePreferences } = usePreferenceContext();
  const { getModelByKey, getAssistantByKey } = useAssistantUtils();

  const renderResetToDefault = (key: keyof typeof defaultPreferences) => {
    return (
      <Button
        variant="outlined"
        size="icon-xs"
        rounded="lg"
        onClick={() => {
          updatePreferences({ [key]: defaultPreferences[key] });
        }}
      >
        <ArrowClockwise size={14} weight="bold" />
      </Button>
    );
  };

  const assistant = getAssistantByKey(preferences?.defaultAssistant);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip content="Configure Model">
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <Settings03Icon size={16} variant="stroke" strokeWidth="2" />
          </Button>
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent className="roundex-2xl mr-8 w-[300px] p-0 dark:bg-zinc-700">
        <Flex direction="col" className="w-full px-3 py-1">
          <Flex items="center" justify="between" className="w-full">
            <Tooltip content="Temprature">
              <Type
                className="flex flex-row items-center gap-1"
                textColor="secondary"
              >
                MaxTokens <Info weight="regular" size={14} />{' '}
                {preferences?.maxTokens}
              </Type>
            </Tooltip>
            <Flex items="center" gap="md">
              <Slider
                className="my-2 w-[80px]"
                value={[Number(preferences?.maxTokens)]}
                step={1}
                min={0}
                max={assistant?.model?.maxOutputTokens}
                onValueChange={(value: number[]) => {
                  updatePreferences({ maxTokens: value?.[0] });
                }}
              />
              {renderResetToDefault('maxTokens')}
            </Flex>
          </Flex>
          <Flex items="center" justify="between" className="w-full">
            <Tooltip content="Temprature">
              <Type
                className="flex flex-row items-center gap-1"
                textColor="secondary"
              >
                Temperature <Info weight="regular" size={14} />
                {preferences?.temperature}
              </Type>
            </Tooltip>
            <Flex items="center" gap="md">
              <Slider
                className="my-2 w-[80px]"
                value={[Number(preferences?.temperature)]}
                step={0.1}
                min={0.1}
                max={1}
                onValueChange={(value: number[]) => {
                  updatePreferences({ temperature: value?.[0].toString() });
                }}
              />
              {renderResetToDefault('temperature')}
            </Flex>
          </Flex>
          <Flex items="center" justify="between" className="w-full">
            <Tooltip content="TopP">
              <Type
                className="flex flex-row items-center gap-1"
                textColor="secondary"
              >
                TopP <Info weight="regular" size={14} /> {preferences?.topP}
              </Type>
            </Tooltip>
            <Flex items="center" gap="md">
              <Slider
                className="my-2 w-[80px]"
                value={[Number(preferences?.topP)]}
                step={0.1}
                min={0.1}
                max={1}
                onValueChange={(value: number[]) => {
                  updatePreferences({ topP: value?.[0].toString() });
                }}
              />
              {renderResetToDefault('topP')}
            </Flex>
          </Flex>
          <Flex items="center" justify="between" className="w-full">
            <Tooltip content="TopK">
              <Type
                className="flex flex-row items-center gap-1"
                textColor="secondary"
              >
                TopK <Info weight="regular" size={14} /> {preferences?.topK}
              </Type>
            </Tooltip>
            <Flex items="center" gap="md">
              <Slider
                className="my-2 w-[80px]"
                value={[Number(preferences?.topK)]}
                step={0.1}
                min={0.1}
                max={1}
                onValueChange={(value: number[]) => {
                  updatePreferences({ topK: value?.[0].toString() });
                }}
              />
              {renderResetToDefault('topK')}
            </Flex>
          </Flex>
        </Flex>
      </PopoverContent>
    </Popover>
  );
};
