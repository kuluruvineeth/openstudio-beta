import { ModelIcon } from '@/app/(authenticated)/chat/components/icons/model-icon';
import { useSettings } from '@/app/context/settings/context';
import type { TPreferences } from '@/app/hooks/use-preferences';
import { usePreferences } from '@/app/hooks/use-preferences';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { Browser, Calculator, Globe } from '@phosphor-icons/react';
import axios from 'axios';
import type { ReactNode } from 'react';
import { z } from 'zod';

const calculatorTool = () => {
  const calculatorSchema = z.object({
    operation: z
      .enum(['add', 'subtract', 'multiply', 'divide'])
      .describe('The type of operation to execute.'),
    number1: z.number().describe('The first number to operate on.'),
    number2: z.number().describe('The second number to operate on.'),
  });

  return new DynamicStructuredTool({
    name: 'calculator',
    description: 'Can perform mathematical operations.',
    schema: calculatorSchema,
    func: async ({ operation, number1, number2 }) => {
      // Functions must return strings
      if (operation === 'add') {
        return `${number1 + number2}`;
      } else if (operation === 'subtract') {
        return `${number1 - number2}`;
      } else if (operation === 'multiply') {
        return `${number1 * number2}`;
      } else if (operation === 'divide') {
        return `${number1 / number2}`;
      } else {
        throw new Error('Invalid operation.');
      }
    },
  });
};

const webSearchTool = (preference: TPreferences) => {
  const webSearchSchema = z.object({
    input: z.string(),
  });

  return new DynamicStructuredTool({
    name: 'web_search',
    description:
      "A search engine optimized for comprehensive, accurate, and trusted results. Useful for when you need to answer questions about current events. Input should be a search query. Don't use tool if already used it to answer the question.",
    schema: webSearchSchema,
    func: async ({ input }, runManager) => {
      const url = 'https://www.googleapis.com/customsearch/v1';
      const params = {
        key: preference.googleSearchApiKey,
        cx: preference.googleSearchEngineId,
        q: input,
      };

      try {
        const response = await axios.get(url, { params });

        if (response.status !== 200) {
          runManager?.handleToolError('Error performing Google search');
          throw new Error('Invalid response');
        }
        const googleSearchResult = response.data?.items?.map((item: any) => ({
          title: item.title,
          snippet: item.snippet,
          url: item.link,
        }));

        const searchInfo = googleSearchResult
          ?.map(
            (r: any, index: number) =>
              `${index + 1}. Title: """${r.title}""" \n URL: """${
                r.url
              }"""\n snippet: """${r.snippet}""" `
          )
          ?.join('\n\n');

        const searchPrompt = `Information: \n\n ${searchInfo} \n\n Based on snippet please answer the given question with proper citations. Must Remove XML tags if any. Question: ${input}`;

        return searchPrompt;
      } catch (error) {
        return 'Error performing Google search. Ask user to check API keys.';
      }
    },
  });
};

const duckduckGoTool = () => {
  const webSearchSchema = z.object({
    input: z.string(),
  });
  return new DynamicStructuredTool({
    name: 'duckduckgo_search',
    description:
      "A search engine optimized for comprehensive, accurate, and trusted results. Useful for when you need to answer questions about current events. Input should be a search query. Don't use tool if already used it to answer the question.",
    schema: webSearchSchema,
    func: async ({ input }, runManager) => {
      try {
        const response = await axios.post('/api/search', { query: input });
        const result = response.data?.results;
        if (!result) {
          runManager?.handleToolError('Error performing Duckduck go search');
          throw new Error('Invalid response');
        }
        const searchPrompt = `Information: \n\n ${result} \n\n Based on snippet please answer the given question with proper citations without using duckduckgo_search function again. Must Remove XML tags if any. Question: ${input}`;
        return searchPrompt;
      } catch (error) {
        return 'Error performing search. Must not use duckduckgo_search tool now. Ask user to check API keys.';
      }
    },
  });
};
const readWebsiteTool = () => {
  const webSearchSchema = z.object({
    url: z.string().url(),
    query: z.string(),
  });
  return new DynamicStructuredTool({
    name: 'read_website',
    description:
      'Website reader tool to extract information from a website. Useful when you want to look into website content to answer question. Input should be a URL and query',
    schema: webSearchSchema,
    func: async ({ url, query }, runManager) => {
      try {
        const response = await axios.post('/api/extract', { url });
        if (!response?.data?.text) {
          runManager?.handleToolError('Error performing Google search');
          throw new Error('Invalid response');
        }
        const content = response.data.text;
        const searchPrompt = `Information: \n\n ${content} \n\n\n Based on snippet please answer the given question with proper citations. Must Remove XML tags if any. Question: ${query}`;
        return searchPrompt;
      } catch (error) {
        return 'Error performing Google search. Ask user to check API keys.';
      }
    },
  });
};
export type TToolKey =
  | 'calculator'
  | 'web_search'
  | 'read_website'
  | 'duckduckgo_search';

export type IconSize = 'sm' | 'md' | 'lg';
export type TTool = {
  key: TToolKey;
  name: string;
  loadingMessage?: string;
  resultMessage?: string;
  isBeta?: boolean;
  validate?: () => Promise<boolean>;
  validationFailedAction?: () => void;
  //TODO: type should be zod object
  tool: (arg?: any) => DynamicStructuredTool<any>;
  icon: (size: IconSize) => ReactNode;
  smallIcon: () => ReactNode;
};

export const useTools = () => {
  const { getPreferences } = usePreferences();
  const { open } = useSettings();
  const tools: TTool[] = [
    {
      key: 'calculator',
      tool: calculatorTool,
      name: 'Calculator',
      loadingMessage: 'Calculating...',
      resultMessage: 'Calculated Result',
      icon: (size: IconSize) => <ModelIcon type="calculator" size={size} />,
      smallIcon: () => <Calculator size={16} weight="bold" />,
    },
    {
      key: 'web_search',
      tool: webSearchTool,
      name: 'Google Search',
      isBeta: true,
      validate: async () => {
        const prefrences = await getPreferences();
        if (
          !prefrences.googleSearchApiKey ||
          !prefrences.googleSearchEngineId
        ) {
          return false;
        }
        return true;
      },
      validationFailedAction: () => {
        open('web-search');
      },
      loadingMessage: 'Searching on web...',
      resultMessage: 'Results from Google Search',
      icon: (size: IconSize) => <ModelIcon type="websearch" size={size} />,
      smallIcon: () => <Globe size={16} weight="bold" />,
    },
    {
      key: 'duckduckgo_search',
      tool: duckduckGoTool,
      name: 'DuckDuckGo Search',
      isBeta: true,
      loadingMessage: 'Searching on web...',
      resultMessage: 'Results from DuckDuckGo Search',
      icon: (size: IconSize) => (
        <ModelIcon type="duckduckgo_search" size={size} />
      ),
      smallIcon: () => <Globe size={16} weight="bold" />,
    },
    {
      key: 'read_website',
      tool: readWebsiteTool,
      name: 'Read Website',
      isBeta: true,
      loadingMessage: 'Analyzing website...',
      resultMessage: 'Results from Website Reader',
      icon: (size: IconSize) => <ModelIcon type="website_reader" size={size} />,
      smallIcon: () => <Browser size={16} weight="bold" />,
    },
  ];

  const getToolByKey = (key: TToolKey) => {
    return tools.find((tool) => tool.key === key)?.tool;
  };

  const getToolInfoByKey = (key: TToolKey) => {
    return tools.find((tool) => tool.key === key);
  };
  return {
    calculatorTool,
    webSearchTool,
    tools,
    getToolByKey,
    getToolInfoByKey,
  };
};
