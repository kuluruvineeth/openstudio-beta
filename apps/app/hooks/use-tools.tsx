import { GeneratedImage } from '@/app/(authenticated)/chat/components/generated-image';
import { usePreferenceContext } from '@/context';
import { dalleTool } from '@/tools/dalle';
import { duckduckGoTool } from '@/tools/duckduckgo';
import { googleSearchTool } from '@/tools/google';
import { memoryTool } from '@/tools/memory';
import type { TToolConfig, TToolKey } from '@/types';
import { BrainIcon, GlobalSearchIcon, Image01Icon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';

export const useTools = () => {
  const { preferences, apiKeys } = usePreferenceContext();
  const { push } = useRouter();

  const tools: TToolConfig[] = [
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
        push('settings/plugins/web-search');
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
      smallIcon: GlobalSearchIcon,
    },
    {
      key: 'image_generation',
      description: 'Generate images',
      tool: dalleTool,
      name: 'Image Generation',
      isBeta: true,
      showInMenu: true,
      validate: async () => {
        return true;
      },
      validationFailedAction: () => {},
      renderUI: ({ image }) => {
        return <GeneratedImage image={image} />;
      },
      loadingMessage: 'Generating Image ...',
      resultMessage: 'Generated Image',
      icon: Image01Icon,
      smallIcon: Image01Icon,
    },
    {
      key: 'memory',
      description: 'AI will remeber things about you',
      tool: memoryTool,
      name: 'Memory',
      isBeta: true,
      showInMenu: true,
      validate: async () => {
        return true;
      },
      validationFailedAction: () => {},
      renderUI: ({ image }) => {
        return (
          <img
            src={image}
            alt=""
            className="h-[400px] w-[400px] rounded-2xl border"
          />
        );
      },
      loadingMessage: 'Saving to the memory...',
      resultMessage: 'Saved to the memory',
      icon: BrainIcon,
      smallIcon: BrainIcon,
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
