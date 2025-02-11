import { defaultPreferences } from '@/config';
import { usePreferenceContext } from '@/context';
import { useRootContext } from '@/context/root';
import { formatNumber } from '@/helper/utils';
import { useAssistantUtils } from '@/hooks/use-assistant-utils';
import { usePremium } from '@/hooks/use-premium';
import type { TAssistant } from '@/types';
import { Badge } from '@repo/design-system/components/ui/badge';
import { CommandItem } from '@repo/design-system/components/ui/command';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { toast } from '@repo/design-system/components/ui/use-toast';
import { Check, Eye, ToyBrick } from 'lucide-react';

export type TAssistantItem = {
  assistant: TAssistant;
  onSelect: (assistant: TAssistant) => void;
};

export const AssistantItem = ({ assistant, onSelect }: TAssistantItem) => {
  const { updatePreferences, preferences } = usePreferenceContext();
  const { getAssistantByKey, getAssistantIcon } = useAssistantUtils();
  const { isPremium } = usePremium();
  const assistantProps = getAssistantByKey(assistant.key);
  const { setOpenPricingModal } = useRootContext();
  const model = assistantProps?.model;
  const isSelected = preferences.defaultAssistants
    ? preferences.defaultAssistants.includes(assistant.key)
    : preferences.defaultAssistant === assistant.key;

  const maxAssistants = isPremium ? 2 : 2;
  const handleSelect = () => {
    if (isSelected) {
      // Remove from defaultAssistants if already selected
      const updatedAssistants =
        preferences.defaultAssistants?.filter((key) => key !== assistant.key) ||
        [];

      updatePreferences(
        {
          // If we're removing the current defaultAssistant, set it to the first remaining assistant
          defaultAssistant:
            preferences.defaultAssistant === assistant.key
              ? updatedAssistants.length > 0
                ? updatedAssistants[0]
                : 'chathub'
              : preferences.defaultAssistant,
          defaultAssistants: updatedAssistants,
          maxTokens: defaultPreferences.maxTokens,
        },
        () => onSelect(assistant)
      );
    } else {
      // For non-premium users, ensure they can only have one assistant
      if (!isPremium) {
        // If they already have an assistant and trying to select another
        if (
          preferences.defaultAssistants &&
          preferences.defaultAssistants.length >= maxAssistants
        ) {
          setOpenPricingModal(true);
          toast({
            title: 'Error',
            description: 'Beta feature: You can only select 2 assistants',
            variant: 'destructive',
          });
          return;
        }
        const updatedAssistants = [
          ...(preferences.defaultAssistants?.filter(
            (key) => key !== assistant.key
          ) || []),
          assistant.key,
        ];
        updatePreferences(
          {
            defaultAssistant: assistant.key,
            defaultAssistants: updatedAssistants,
            maxTokens: defaultPreferences.maxTokens,
          },
          () => onSelect(assistant)
        );
        return;
      }
      // For premium users
      if (
        !preferences.defaultAssistants ||
        preferences.defaultAssistants?.length >= maxAssistants
      ) {
        toast({
          title: 'Error',
          description: 'Beta feature: You can only select 2 assistants',
          variant: 'destructive',
        });
        return;
      }
      // Add new selection, ensuring defaultAssistant is first in the array
      const updatedAssistants = [
        ...(preferences.defaultAssistants?.filter(
          (key) => key !== assistant.key
        ) || []),
        assistant.key,
      ];

      updatePreferences(
        {
          defaultAssistant: assistant.key,
          defaultAssistants: updatedAssistants,
          maxTokens: defaultPreferences.maxTokens,
        },
        () => onSelect(assistant)
      );
    }
  };

  return (
    <CommandItem
      value={assistant.name}
      className="!py-2.5 w-full"
      onSelect={handleSelect}
    >
      <Flex gap="md" items="center" key={assistant.key} className="w-full">
        <Flex direction="col">
          <Flex gap="sm" items="center" className="flex-1">
            <Type size="sm" weight="medium">
              {assistant.name}
            </Type>
            {model?.isNew && assistant.type !== 'custom' && <Badge>New</Badge>}
          </Flex>
        </Flex>
        <div className="flex flex-1"></div>

        <Flex gap="md" items="center">
          {isSelected && (
            <Check size={16} className="text-green-500" strokeWidth={1.5} />
          )}
          {!!model?.vision && (
            <Eye size={16} strokeWidth={1.5} className="text-zinc-500" />
          )}
          {!!model?.plugins?.length && (
            <ToyBrick size={16} strokeWidth={1.5} className="text-zinc-500" />
          )}
          {model?.tokens && (
            <Type size="xs" textColor="secondary">
              {formatNumber(model?.tokens)}
            </Type>
          )}
        </Flex>
      </Flex>
    </CommandItem>
  );
};
