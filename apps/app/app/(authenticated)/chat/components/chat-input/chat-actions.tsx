import { ImageUpload } from '@/app/(authenticated)/chat/components/chat-input/image-upload';
import { SpaceSelector } from '@/app/(authenticated)/chat/components/chat-input/space-selector';
import { PluginSelect } from '@/app/(authenticated)/chat/components/plugin-select';
import { defaultPreferences } from '@/config';
import {
  useAssistants,
  useChatContext,
  usePreferenceContext,
  usePromptsContext,
} from '@/context';
import { useAssistantUtils } from '@/hooks';
import type { TAssistant } from '@/types';
import { AiIdeaIcon, SentIcon } from '@hugeicons/react';
import { Button } from '@repo/design-system/components/ui';
import { Flex } from '@repo/design-system/components/ui/flex';
import { cn } from '@repo/design-system/lib/utils';
import { useEffect, useState } from 'react';

export type TChatActions = {
  sendMessage: (message: string) => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
export const ChatActions = ({
  sendMessage,
  handleImageUpload,
}: TChatActions) => {
  const { store } = useChatContext();
  const isGenerating = store((state) => state.isGenerating);
  const editor = store((state) => state.editor);
  const { preferences, updatePreferences } = usePreferenceContext();
  const { selectedAssistant, open: openAssistants } = useAssistants();
  const { open: openPrompts } = usePromptsContext();
  const [selectedAssistantKey, setSelectedAssistantKey] = useState<
    TAssistant['key']
  >(preferences.defaultAssistant);
  const { models, getAssistantByKey, getAssistantIcon } = useAssistantUtils();
  useEffect(() => {
    const assistantProps = getAssistantByKey(preferences.defaultAssistant);
    if (assistantProps?.model) {
      setSelectedAssistantKey(preferences.defaultAssistant);
    } else {
      updatePreferences({
        defaultAssistant: defaultPreferences.defaultAssistant,
      });
    }
  }, [models, preferences]);
  const assistantKey = selectedAssistant?.assistant.key;
  const assistantName = selectedAssistant?.assistant.name;
  const hasTextInput = !!editor?.getText();
  const sendButtonClasses = cn({
    'bg-zinc-800 text-white dark:bg-teal-600/20 dark:text-teal-400 dark:outline-teal-400':
      hasTextInput,
  });
  return (
    <Flex
      className="w-full px-1 pt-1 pb-1 md:px-2 md:pb-2"
      items="center"
      justify="between"
    >
      <Flex gap="xs" items="center">
        <Button
          variant="ghost"
          onClick={openAssistants}
          className="gap-2 pr-3 pl-1.5 text-xs md:text-sm"
          size="sm"
        >
          {assistantKey && getAssistantIcon(assistantKey, 'sm')}
          {assistantName}
        </Button>
        <PluginSelect selectedAssistantKey={selectedAssistantKey} />
        <ImageUpload
          id="image-upload"
          label="Upload Image"
          tooltip="Upload Image"
          showIcon
          handleImageUpload={handleImageUpload}
        />
        <SpaceSelector />
      </Flex>
      <Flex gap="xs" items="center">
        <Button
          variant="ghost"
          onClick={() => {
            openPrompts();
          }}
          className="gap-2 pr-3 pl-1.5 text-xs md:text-sm"
          size="sm"
        >
          <AiIdeaIcon size={16} variant="stroke" strokeWidth="2" />
          <span className="hidden md:flex">Prompts</span>
        </Button>
        <Button
          size="iconSm"
          variant={hasTextInput ? 'default' : 'secondary'}
          disabled={!hasTextInput || isGenerating}
          className={sendButtonClasses}
          onClick={() => {
            editor?.getText() && sendMessage(editor?.getText());
          }}
        >
          <SentIcon
            size={16}
            className="-translate-x-0.5 rotate-45"
            variant="solid"
            strokeWidth="2"
          />
        </Button>
      </Flex>
    </Flex>
  );
};
