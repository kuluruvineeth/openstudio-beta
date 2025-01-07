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
import type { ChangeEvent } from 'react';

export const CommonSettings = () => {
  const { preferences, updatePreferences } = usePreferenceContext();

  const renderResetToDefault = (key: keyof TPreferences) => {
    return (
      <Button
        variant="outline"
        size="iconXS"
        rounded="lg"
        onClick={() => {
          updatePreferences({ [key]: defaultPreferences[key] });
        }}
      >
        <ArrowClockwise size={14} weight="bold" />
      </Button>
    );
  };

  const onInputChange = (min: number, max: number, key: keyof TPreferences) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      if (value < min) {
        updatePreferences({ [key]: min });
        return;
      } else if (value > max) {
        updatePreferences({ [key]: max });
        return;
      }
      updatePreferences({ [key]: value });
    };
  };

  const onSliderChange = (
    min: number,
    max: number,
    key: keyof TPreferences
  ) => {
    return (value: number[]) => {
      if (value?.[0] < min) {
        updatePreferences({ [key]: min });
        return;
      } else if (value?.[0] > max) {
        updatePreferences({ [key]: max });
        return;
      }
      updatePreferences({ [key]: value?.[0] });
    };
  };

  return (
    <>
      <SettingsContainer title="Default Assistant Settings">
        <Flex direction="col" gap="sm" className="w-full" items="start">
          <Flex justify="between" items="center" className="w-full">
            <Flex direction="col" items="start">
              <Type weight="medium"> System Prompt</Type>

              <Type size="xxs" textColor="secondary">
                Default instructions for the model.
              </Type>
            </Flex>{' '}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updatePreferences({
                  systemPrompt: defaultPreferences.systemPrompt,
                });
              }}
            >
              Reset
            </Button>
          </Flex>
          <Textarea
            name="systemPrompt"
            value={preferences.systemPrompt}
            autoComplete="off"
            onChange={(e) => {
              updatePreferences({ systemPrompt: e.target.value });
            }}
          />
        </Flex>
      </SettingsContainer>

      <SettingsContainer title="Model Settings">
        <SettingCard className="mt-2 p-5">
          <Flex justify="between" items="center">
            <Flex direction="col" items="start">
              <Type weight="medium">Context Length</Type>
              <Type size="xxs" textColor="secondary">
                Number of previous messages to consider.
              </Type>
            </Flex>
            <Flex items="center" gap="sm">
              <Input
                name="messageLimit"
                type="number"
                size="sm"
                className="w-[100px]"
                value={preferences?.messageLimit}
                autoComplete="off"
                onChange={(e) => {
                  updatePreferences({
                    messageLimit: Number(e.target.value),
                  });
                }}
              />
              {renderResetToDefault('messageLimit')}
            </Flex>
          </Flex>
          <div className="my-4 h-[1px] w-full bg-zinc-500/10" />

          <Flex justify="between" items="center">
            <Flex direction="col" items="start">
              <Type weight="medium">Max Tokens</Type>
              <Type size="xxs" textColor="secondary">
                Maximum tokens in a single response.
              </Type>
            </Flex>
            <Flex items="center" gap="sm">
              <Input
                name="maxTokens"
                type="number"
                size="sm"
                className="w-[100px]"
                value={preferences?.maxTokens}
                autoComplete="off"
                onChange={(e) => {
                  updatePreferences({
                    maxTokens: Number(e.target.value),
                  });
                }}
              />
              {renderResetToDefault('maxTokens')}
            </Flex>
          </Flex>
          <div className="my-4 h-[1px] w-full bg-zinc-500/10" />

          <Flex justify="between" items="center">
            <Flex direction="col" items="start">
              <Type weight="medium">Temperature</Type>
              <Type size="xxs" textColor="secondary">
                Adjust randomness of responses.
              </Type>
            </Flex>
            <Flex items="center" gap="sm">
              <Slider
                className="my-2 w-[80px]"
                value={[Number(preferences?.temperature)]}
                min={0}
                step={0.1}
                max={1}
                onValueChange={onSliderChange(0, 1, 'temperature')}
              />
              <Input
                name="temperature"
                type="number"
                size="sm"
                className="w-[80px]"
                value={preferences?.temperature}
                min={0}
                step={1}
                max={100}
                autoComplete="off"
                onChange={onInputChange(0, 1, 'temperature')}
              />
              {renderResetToDefault('temperature')}
            </Flex>
          </Flex>
          <div className="my-4 h-[1px] w-full bg-zinc-500/10" />

          <Flex justify="between" items="center">
            <Flex direction="col" items="start">
              <Type weight="medium">TopP</Type>
              <Type size="xxs" textColor="secondary">
                Control text diversity.
              </Type>
            </Flex>
            <Flex items="center" gap="sm">
              <Slider
                className="my-2 w-[80px]"
                value={[Number(preferences.topP)]}
                min={0}
                step={0.01}
                max={1}
                onValueChange={onSliderChange(0, 1, 'topP')}
              />
              <Input
                name="topP"
                type="number"
                size="sm"
                className="w-[80px]"
                value={preferences.topP}
                min={0}
                step={1}
                max={1}
                autoComplete="off"
                onChange={onInputChange(0, 1, 'topP')}
              />
              {renderResetToDefault('topP')}
            </Flex>
          </Flex>
          <div className="my-4 h-[1px] w-full bg-zinc-500/10" />

          <Flex justify="between" items="center">
            <Flex direction="col" items="start">
              <Type weight="medium">TopK</Type>
              <Type size="xxs" textColor="secondary">
                Limit highest probability tokens.
              </Type>
            </Flex>
            <Flex items="center" gap="sm">
              <Slider
                className="my-2 w-[80px]"
                value={[Number(preferences.topK)]}
                min={1}
                step={1}
                max={100}
                onValueChange={onSliderChange(1, 100, 'topK')}
              />
              <Input
                name="topK"
                type="number"
                size="sm"
                className="w-[80px]"
                value={preferences.topK}
                min={0}
                step={1}
                max={100}
                autoComplete="off"
                onChange={onInputChange(1, 100, 'topK')}
              />
              {renderResetToDefault('topK')}
            </Flex>
          </Flex>
        </SettingCard>
      </SettingsContainer>
    </>
  );
};
