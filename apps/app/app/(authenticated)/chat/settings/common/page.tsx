'use client';
import { SettingCard } from '@/app/(authenticated)/chat/components/settings/setting-card';
import { SettingsContainer } from '@/app/(authenticated)/chat/components/settings/settings-container';
import { defaultPreferences } from '@/config';
import { usePreferenceContext } from '@/context/preferences';
import type { TPreferences } from '@/types';
import { ArrowClockwise } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Input } from '@repo/design-system/components/ui/input';
import { Slider } from '@repo/design-system/components/ui/slider';
import { Type } from '@repo/design-system/components/ui/text';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { cn } from '@repo/design-system/lib/utils';
import type { ChangeEvent } from 'react';

export default function CommonPage() {
  const { preferences, updatePreferences } = usePreferenceContext();
  const renderResetToDefault = (key: keyof TPreferences) => (
    <Button
      variant="secondary"
      size="iconXS"
      rounded="lg"
      onClick={() => updatePreferences({ [key]: defaultPreferences[key] })}
    >
      <ArrowClockwise size={14} weight="bold" />
    </Button>
  );
  const handleInputChange =
    (key: keyof TPreferences, min: number, max: number) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      updatePreferences({
        [key]: value < min ? min : value > max ? max : value,
      });
    };
  const handleSliderChange =
    (key: keyof TPreferences, min: number, max: number) =>
    (value: number[]) => {
      updatePreferences({
        [key]: value?.[0] < min ? min : value?.[0] > max ? max : value?.[0],
      });
    };
  const settings = [
    {
      key: 'messageLimit',
      label: 'Context Length',
      description: 'Number of previous messages to consider.',
      type: 'number',
      min: 0,
      max: 100,
      step: 1,
    },
    {
      key: 'maxTokens',
      label: 'Max Tokens',
      description: 'Maximum tokens in a single response.',
      type: 'number',
      min: 0,
      max: 1000,
      step: 1,
    },
    {
      key: 'temperature',
      label: 'Temperature',
      description: 'Adjust randomness of responses.',
      type: 'number',
      min: 0,
      max: 1,
      step: 0.1,
    },
    {
      key: 'topP',
      label: 'TopP',
      description: 'Control text diversity.',
      type: 'number',
      min: 0,
      max: 1,
      step: 0.01,
    },
    {
      key: 'topK',
      label: 'TopK',
      description: 'Limit highest probability tokens.',
      type: 'number',
      min: 1,
      max: 100,
      step: 1,
    },
  ];
  return (
    <SettingsContainer title="Model Settings" gap="sm">
      <Flex direction="col" gap="md" className="w-full" items="start">
        <Flex justify="between" items="center" className="w-full">
          <Flex direction="col" items="start">
            <Type weight="medium"> System Prompt</Type>
            <Type size="xxs" textColor="secondary">
              Default instructions for the model.
            </Type>
          </Flex>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              updatePreferences({
                systemPrompt: defaultPreferences.systemPrompt,
              })
            }
          >
            Reset
          </Button>
        </Flex>
        <Textarea
          name="systemPrompt"
          value={preferences.systemPrompt}
          autoComplete="off"
          onChange={(e) => updatePreferences({ systemPrompt: e.target.value })}
        />
      </Flex>

      <SettingCard className="px-5">
        {settings.map((setting, index) => {
          const listItemClasses = cn(
            `w-full border-b border-zinc-500/10 py-4 `,
            {
              'border-b-0': index === settings.length - 1,
            }
          );
          return (
            <Flex
              key={setting.key}
              justify="between"
              items="center"
              className={listItemClasses}
            >
              <Flex direction="col" items="start">
                <Type weight="medium">{setting.label}</Type>
                <Type size="xxs" textColor="secondary">
                  {setting.description}
                </Type>
              </Flex>
              <Flex items="center" gap="sm">
                {setting.type === 'number' && (
                  <>
                    <Slider
                      className="my-2 w-[80px]"
                      value={[
                        Number(preferences[setting.key as keyof TPreferences]),
                      ]}
                      min={setting.min}
                      step={setting.step}
                      max={setting.max}
                      onValueChange={handleSliderChange(
                        setting.key as keyof TPreferences,
                        setting.min,
                        setting.max
                      )}
                    />
                    <Input
                      name={setting.key}
                      type="number"
                      size="sm"
                      className="w-[100px]"
                      value={
                        preferences[setting.key as keyof TPreferences] as string
                      }
                      min={setting.min}
                      max={setting.max}
                      step={setting.step}
                      autoComplete="off"
                      onChange={handleInputChange(
                        setting.key as keyof TPreferences,
                        setting.min,
                        setting.max
                      )}
                    />
                  </>
                )}
                {renderResetToDefault(setting.key as keyof TPreferences)}
              </Flex>
            </Flex>
          );
        })}
      </SettingCard>
    </SettingsContainer>
  );
}
