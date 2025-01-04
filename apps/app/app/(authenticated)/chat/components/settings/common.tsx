import { SettingCard } from '@/app/(authenticated)/chat/components/settings/setting-card';
import { SettingsContainer } from '@/app/(authenticated)/chat/components/settings/settings-container';
import { usePreferenceContext } from '@/app/context/preferences/context';
import { useModelSettings } from '@/app/hooks/use-model-settings';
import {
  type TPreferences,
  defaultPreferences,
} from '@/app/hooks/use-preferences';
import { ArrowClockwise, Info } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Input } from '@repo/design-system/components/ui/input';
import { Slider } from '@repo/design-system/components/ui/slider';
import { Type } from '@repo/design-system/components/ui/text';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import type { ChangeEvent } from 'react';

export const CommonSettings = () => {
  const { preferencesQuery, setPreferencesMutation } = usePreferenceContext();
  const { formik, setPreferences } = useModelSettings({});

  const renderResetToDefault = (key: keyof TPreferences) => {
    return (
      <Button
        variant="outline"
        size="iconXS"
        rounded="lg"
        onClick={() => {
          setPreferences({ [key]: defaultPreferences[key] });
          formik.setFieldValue(key, defaultPreferences[key]);
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
        setPreferencesMutation.mutate({ [key]: min });
        return;
      } else if (value > max) {
        setPreferencesMutation.mutate({ [key]: max });
        return;
      }
      setPreferencesMutation.mutate({ [key]: value });
    };
  };

  const onSliderChange = (
    min: number,
    max: number,
    key: keyof TPreferences
  ) => {
    return (value: number[]) => {
      if (value?.[0] < min) {
        setPreferencesMutation.mutate({ [key]: min });
        return;
      } else if (value?.[0] > max) {
        setPreferencesMutation.mutate({ [key]: max });
        return;
      }
      setPreferencesMutation.mutate({ [key]: value?.[0] });
    };
  };

  return (
    <SettingsContainer title="Model Settings">
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-row items-center justify-between py-1">
          <Type
            size="xs"
            textColor="secondary"
            className="flex flex-row items-center gap-1"
          >
            System Default Prompt <Info weight="regular" size={14} />
          </Type>
        </div>
        <Textarea
          name="systemPrompt"
          value={formik.values.systemPrompt}
          autoComplete="off"
          onChange={(e) => {
            setPreferences({ systemPrompt: e.target.value });
            formik.setFieldValue('systemPrompt', e.target.value);
          }}
        />
      </div>

      <SettingCard className="mt-2 p-3">
        <Flex justify="between">
          <Flex direction="col" items="start">
            <Type>Context Length</Type>
            <Type size="xxs" textColor="secondary">
              Number of previous messages to use as context
            </Type>
          </Flex>
          <Flex items="center" gap="sm">
            <Input
              name="messageLimit"
              type="number"
              size="sm"
              className="w-[100px]"
              value={preferencesQuery?.data?.messageLimit}
              autoComplete="off"
              onChange={(e) => {
                setPreferencesMutation.mutate({
                  messageLimit: Number(e.target.value),
                });
              }}
            />
            {renderResetToDefault('messageLimit')}
          </Flex>
        </Flex>
        <div className="my-3 h-[1px] w-full bg-zinc-500/10" />

        <Flex justify="between">
          <Flex direction="col" items="start">
            <Type>Max output tokens</Type>
            <Type size="xxs" textColor="secondary">
              Maximum number of tokens to generate
            </Type>
          </Flex>
          <Flex items="center" gap="sm">
            <Input
              name="maxTokens"
              type="number"
              size="sm"
              className="w-[100px]"
              value={preferencesQuery?.data?.maxTokens}
              autoComplete="off"
              onChange={(e) => {
                setPreferencesMutation.mutate({
                  maxTokens: Number(e.target.value),
                });
              }}
            />
            {renderResetToDefault('maxTokens')}
          </Flex>
        </Flex>
        <div className="my-3 h-[1px] w-full bg-zinc-500/10" />

        <Flex justify="between">
          <Flex direction="col" items="start">
            <Type>Temprature</Type>
            <Type size="xxs" textColor="secondary">
              Maximum number of tokens to generate
            </Type>
          </Flex>
          <Flex items="center" gap="sm">
            <Slider
              className="my-2 w-[80px]"
              value={[Number(preferencesQuery?.data?.temperature)]}
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
              value={preferencesQuery?.data?.temperature}
              min={0}
              step={1}
              max={100}
              autoComplete="off"
              onChange={onInputChange(0, 1, 'temperature')}
            />
            {renderResetToDefault('temperature')}
          </Flex>
        </Flex>
        <div className="my-3 h-[1px] w-full bg-zinc-500/10" />

        <Flex justify="between">
          <Flex direction="col" items="start">
            <Type>TopP</Type>
            <Type size="xxs" textColor="secondary">
              Maximum number of tokens to generate
            </Type>
          </Flex>
          <Flex items="center" gap="sm">
            <Slider
              className="my-2 w-[80px]"
              value={[Number(formik.values.topP)]}
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
              value={formik.values.topP}
              min={0}
              step={1}
              max={1}
              autoComplete="off"
              onChange={onInputChange(0, 1, 'topP')}
            />
            {renderResetToDefault('topP')}
          </Flex>
        </Flex>
        <div className="my-3 h-[1px] w-full bg-zinc-500/10" />

        <Flex justify="between">
          <Flex direction="col" items="start">
            <Type>TopK</Type>
            <Type size="xxs" textColor="secondary">
              Maximum number of tokens to generate
            </Type>
          </Flex>
          <Flex items="center" gap="sm">
            <Slider
              className="my-2 w-[80px]"
              value={[Number(formik.values.topK)]}
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
              value={formik.values.topK}
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
  );
};
