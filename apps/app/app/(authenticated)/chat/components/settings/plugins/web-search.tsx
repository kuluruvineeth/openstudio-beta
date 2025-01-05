import { SettingCard } from '@/app/(authenticated)/chat/components/settings/setting-card';
import { SettingsContainer } from '@/app/(authenticated)/chat/components/settings/settings-container';
import { usePreferenceContext } from '@/app/context/preferences';
import { ArrowRight, CaretDown, Info } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Input } from '@repo/design-system/components/ui/input';
import { Type } from '@repo/design-system/components/ui/text';
import { useToast } from '@repo/design-system/components/ui/use-toast';
import axios from 'axios';
import { useEffect } from 'react';

export const WebSearchPlugin = () => {
  const { toast } = useToast();
  const { preferences, updatePreferences } = usePreferenceContext();

  useEffect(() => {}, []);

  const handleRunTest = async () => {
    try {
      const url = 'https://www.googleapis.com/customsearch/v1';
      const params = {
        key: preferences.googleSearchApiKey,
        cx: preferences.googleSearchEngineId,
        q: 'Latest news',
      };

      const response = await axios.get(url, { params });

      if (response.status === 200) {
        toast({
          title: 'Test successful',
          description: 'Google search plugin is working',
          variant: 'default',
        });
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      toast({
        title: 'Test failed',
        description: 'Google search plugin is not working',
        variant: 'destructive',
      });
    }
  };

  const renderWebSearchOptions = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="secondary">
            google <CaretDown size={12} weight="bold" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]" align="end">
          <DropdownMenuItem>Google</DropdownMenuItem>
          <DropdownMenuItem>DuckDuckGo</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  return (
    <SettingsContainer title="Web search plugin">
      <SettingCard className="flex flex-row items-center justify-between">
        <Flex className="w-full" justify="between" items="center">
          <Type size="sm" textColor="secondary">
            Default Search Engine
          </Type>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="secondary">
                {preferences.defaultWebSearchEngine}{' '}
                <CaretDown size={12} weight="bold" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]" align="end">
              <DropdownMenuItem
                onClick={() => {
                  updatePreferences({ defaultWebSearchEngine: 'google' });
                }}
              >
                Google
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  updatePreferences({ defaultWebSearchEngine: 'duckduckgo' });
                }}
              >
                DuckDuckGo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Flex>
      </SettingCard>
      {preferences.defaultWebSearchEngine === 'google' && (
        <SettingCard className="flex w-full flex-col items-start gap-2 py-3">
          <Flex direction="col" gap="sm" className="w-full">
            <Type
              size="xs"
              className="flex flex-row items-center gap-2"
              textColor="secondary"
            >
              Google Search Engine ID <Info weight="regular" size={14} />
            </Type>
            <Input
              name="googleSearchEngineId"
              type="text"
              value={preferences.googleSearchEngineId}
              autoComplete="off"
              onChange={(e) => {
                updatePreferences({ googleSearchEngineId: e.target.value });
              }}
            />
          </Flex>
          <Flex direction="col" gap="sm" className="w-full">
            <Type
              size="xs"
              className="flex flex-row items-center gap-2"
              textColor="secondary"
            >
              Google Search Api Key <Info weight="regular" size={14} />
            </Type>
            <Input
              name="googleSearchApiKey"
              type="text"
              value={preferences.googleSearchApiKey}
              autoComplete="off"
              onChange={(e) => {
                updatePreferences({ googleSearchApiKey: e.target.value });
              }}
            />
          </Flex>
          <Flex gap="sm">
            <Button onClick={handleRunTest} size="sm">
              Run check
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                window.open(
                  'https://programmablesearchengine.google.com/controlpanel/create',
                  '_blank'
                );
              }}
            >
              Get your API key here <ArrowRight size={16} weight="bold" />
            </Button>
          </Flex>
        </SettingCard>
      )}
    </SettingsContainer>
  );
};
