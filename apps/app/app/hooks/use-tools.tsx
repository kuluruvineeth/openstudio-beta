import { usePreferenceContext } from '@/app/context';
import { useSettingsContext } from '@/app/context';
import { dalleTool } from '@/app/tools/dalle';
import { duckduckGoTool } from '@/app/tools/duckduckgo';
import { googleSearchTool } from '@/app/tools/google';
import { GlobalSearchIcon, Image01Icon } from '@hugeicons/react';
import type { ReactNode } from 'react';
import type { TApiKeys, TPreferences } from '.';
import { Globe } from '@phosphor-icons/react';

export const toolKeys = ['calculator', 'web_search'];

export type TToolResponseArgs = {
  toolName: string;
  toolArgs: any;
  toolResult: any;
};

export type TToolArg = {
  preferences: TPreferences;
  apiKeys: TApiKeys;
  toolResponse: (response: TToolResponseArgs) => void;
};

export type TToolKey = (typeof toolKeys)[number];
export type IconSize = 'sm' | 'md' | 'lg';
export type TTool = {
  key: TToolKey;
  description: string;
  name: string;
  loadingMessage?: string;
  resultMessage?: string;
  isBeta?: boolean;
  renderUI?: (args: any) => ReactNode;
  showInMenu?: boolean;
  validate?: () => Promise<boolean>;
  validationFailedAction?: () => void;
  tool: (args: TToolArg) => any;
  //TODO: should be type of HugeiconsProps
  icon: any;
  smallIcon: () => ReactNode;
};

export const useTools = () => {
  const { preferences, apiKeys } = usePreferenceContext();
  const { open } = useSettingsContext();

  const tools: TTool[] = [
    {
      key: 'web_search',
      description: 'Search on web',
      tool:
        preferences?.defaultWebSearchEngine === 'google'
          ? googleSearchTool
          : duckduckGoTool,
      name: 'Web Search',
      isBeta: true,
      showInMenu: true,
      validate: async () => {
        if (
          preferences?.defaultWebSearchEngine === 'google' &&
          (!preferences?.googleSearchApiKey ||
            !preferences?.googleSearchEngineId)
        ) {
          return false;
        }
        return true;
      },
      validationFailedAction: () => {
        open('web-search');
      },
      loadingMessage:
        preferences?.defaultWebSearchEngine === 'google'
          ? 'Searching on Google...'
          : 'Searching on DuckDuckGo...',
      resultMessage:
        preferences?.defaultWebSearchEngine === 'google'
          ? 'Results from Google search'
          : 'Result from DuckDuckGo search',
      icon: GlobalSearchIcon,
      smallIcon: () => <Globe size={16} weight="bold" />,
    },
    {
      key: 'image',
      description: 'Generate images',
      tool: dalleTool,
      name: 'Dalle',
      isBeta: true,
      showInMenu: true,
      validate: async () => {
        return true;
      },
      validationFailedAction: () => {
        open('web-search');
      },
      loadingMessage: 'Generating Image',
      resultMessage: 'Generated Image',
      icon: Image01Icon,
      smallIcon: () => <Globe size={16} weight="bold" />,
    },
  ];

  const getToolByKey = (key: TToolKey) => {
    return tools.find((tool) => tool.key.includes(key));
  };

  const getToolInfoByKey = (key: TToolKey) => {
    return tools.find((tool) => tool.key.includes(key));
  };
  return {
    tools,
    getToolByKey,
    getToolInfoByKey,
  };
};
