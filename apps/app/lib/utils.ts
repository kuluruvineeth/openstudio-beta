import { siteConfig } from '@/config/site';
import type {
  CoreAssistantMessage,
  CoreToolMessage,
  Message,
  ToolInvocation,
} from '@repo/ai';
import type { Message as DBMessage, Document } from '@repo/backend/schema';
import type { Metadata } from 'next';
import type { NextRequest } from 'next/server';

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const snakeCaseToTitle = (str: string) => {
  return str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

export function formatShortDate(
  date: Date,
  options: {
    includeYear?: boolean;
    lowerCase?: boolean;
  } = {
    includeYear: false,
    lowerCase: false,
  }
) {
  // if date is today, return the time. e.g. 12.30pm
  // if date is before today then return the date. eg AUG 13th

  const today = new Date();

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    const formattedDate = date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: options.includeYear ? 'numeric' : undefined,
    });

    return options.lowerCase ? formattedDate : formattedDate.toUpperCase();
  }
}

export const formatDuration = (duration: number) => {
  const seconds = Math.floor((duration % 60000) / 1000);
  const minutes = Math.floor(duration / 60000);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export function detectBot(req: NextRequest) {
  const url = req.nextUrl;
  if (url.searchParams.get('bot')) return true;
  const ua = req.headers.get('User-Agent');
  if (ua) {
    return /bot|chatgpt|facebookexternalhit|WhatsApp|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex|MetaInspector/i.test(
      ua
    );
  }
  return false;
}

export function getInitials(input: string): string {
  const splitted = input.split(' ');
  const [first, last] =
    splitted?.length > 1
      ? [splitted[0].charAt(0), splitted[1].charAt(0)]
      : [input[0], input.at(-1)];
  return `${first + last}`.toLocaleUpperCase();
}

export function generateSEO({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  siteName = siteConfig.name,
  seoTitle = siteConfig.name,
  icons = {
    shortcut: [
      {
        media: '(prefers-color-scheme: light)',
        rel: 'icon',
        type: 'image/x-icon',
        url: '/favicon-light.ico',
        href: '/favicon-light.ico',
      },
      {
        media: '(prefers-color-scheme: dark)',
        rel: 'icon',
        type: 'image/x-icon',
        url: '/favicon.ico',
        href: '/favicon.ico',
      },
    ],
    icon: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon-16x16.png',
      },
    ],
    apple: [
      {
        rel: 'apple-touch-icon',
        sizes: '32x32',
        url: '/apple-touch-icon.png',
      },
    ],
  },
  url = siteConfig.url,
  template,
  noIndex = false,
  canonicalURL,
  feeds,
}: {
  title?: string;
  template?: string | null;
  description?: string;
  seoTitle?: string;
  image?: string;
  siteName?: string;
  icons?: Metadata['icons'];
  url?: string;
  noIndex?: boolean;
  canonicalURL?: string;
  feeds?: {
    rss: string;
    atom: string;
  };
} = {}): Metadata {
  return {
    ...(template
      ? {
          title: {
            default: title,
            template: template ? `%s / ${template}` : '',
          },
        }
      : {
          title,
        }),
    description,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      title: seoTitle || title,
      description,
      images: [
        {
          url: image,
        },
      ],
      siteName,
      url,
    },
    twitter: {
      title: seoTitle || title,
      description,
      card: 'summary_large_image',
      images: [
        {
          url: image,
        },
      ],
    },
    icons,
    metadataBase: url
      ? new URL(url)
      : new URL(`https://${process.env.NEXT_PUBLIC_APP_DOMAIN as string}`),
    alternates: {
      canonical: canonicalURL || url,
      ...(feeds && {
        types: {
          'application/rss+xml': [
            {
              title: 'RSS Feed',
              url: feeds.rss,
            },
          ],
          'application/atom+xml': [
            {
              title: 'Atom Feed',
              url: feeds.atom,
            },
          ],
        },
      }),
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export function getMostRecentUserMessage(messages: Array<Message>) {
  const userMessages = messages.filter((message) => message.role === 'user');
  return userMessages.at(-1);
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface ApplicationError extends Error {
  info: string;
  status: number;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      'An error occurred while fetching the data.'
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

export function getLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  return [];
}

function addToolMessageToChat({
  toolMessage,
  messages,
}: {
  toolMessage: CoreToolMessage;
  messages: Array<Message>;
}): Array<Message> {
  return messages.map((message) => {
    if (message.toolInvocations) {
      return {
        ...message,
        toolInvocations: message.toolInvocations.map((toolInvocation) => {
          const toolResult = toolMessage.content.find(
            (tool) => tool.toolCallId === toolInvocation.toolCallId
          );

          if (toolResult) {
            return {
              ...toolInvocation,
              state: 'result',
              result: toolResult.result,
            };
          }

          return toolInvocation;
        }),
      };
    }

    return message;
  });
}

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage;
type ResponseMessage = ResponseMessageWithoutId & { id: string };

export function sanitizeResponseMessages({
  messages,
  reasoning,
}: {
  messages: Array<ResponseMessage>;
  reasoning: string | undefined;
}) {
  const toolResultIds: Array<string> = [];

  for (const message of messages) {
    if (message.role === 'tool') {
      for (const content of message.content) {
        if (content.type === 'tool-result') {
          toolResultIds.push(content.toolCallId);
        }
      }
    }
  }

  const messagesBySanitizedContent = messages.map((message) => {
    if (message.role !== 'assistant') return message;

    if (typeof message.content === 'string') return message;

    const sanitizedContent = message.content.filter((content) =>
      content.type === 'tool-call'
        ? toolResultIds.includes(content.toolCallId)
        : content.type === 'text'
          ? content.text.length > 0
          : true
    );

    if (reasoning) {
      // @ts-expect-error: reasoning message parts in sdk is wip
      sanitizedContent.push({ type: 'reasoning', reasoning });
    }

    return {
      ...message,
      content: sanitizedContent,
    };
  });

  return messagesBySanitizedContent.filter(
    (message) => message.content.length > 0
  );
}

export function sanitizeUIMessages(messages: Array<Message>): Array<Message> {
  const messagesBySanitizedToolInvocations = messages.map((message) => {
    if (message.role !== 'assistant') return message;

    if (!message.toolInvocations) return message;

    const toolResultIds: Array<string> = [];

    for (const toolInvocation of message.toolInvocations) {
      if (toolInvocation.state === 'result') {
        toolResultIds.push(toolInvocation.toolCallId);
      }
    }

    const sanitizedToolInvocations = message.toolInvocations.filter(
      (toolInvocation) =>
        toolInvocation.state === 'result' ||
        toolResultIds.includes(toolInvocation.toolCallId)
    );

    return {
      ...message,
      toolInvocations: sanitizedToolInvocations,
    };
  });

  return messagesBySanitizedToolInvocations.filter(
    (message) =>
      message.content.length > 0 ||
      (message.toolInvocations && message.toolInvocations.length > 0)
  );
}

export function getDocumentTimestampByIndex(
  documents: Array<Document>,
  index: number
) {
  if (!documents) return new Date();
  if (index > documents.length) return new Date();

  return documents[index].createdAt;
}

export function convertToUIMessages(
  messages: Array<DBMessage>
): Array<Message> {
  return messages.reduce((chatMessages: Array<Message>, message) => {
    if (message.role === 'tool') {
      return addToolMessageToChat({
        toolMessage: message as CoreToolMessage,
        messages: chatMessages,
      });
    }

    let textContent = '';
    let reasoning: string | undefined;
    const toolInvocations: Array<ToolInvocation> = [];

    if (typeof message.content === 'string') {
      textContent = message.content;
    } else if (Array.isArray(message.content)) {
      for (const content of message.content) {
        if (content.type === 'text') {
          textContent += content.text;
        } else if (content.type === 'tool-call') {
          toolInvocations.push({
            state: 'call',
            toolCallId: content.toolCallId,
            toolName: content.toolName,
            args: content.args,
          });
        } else if (content.type === 'reasoning') {
          reasoning = content.reasoning;
        }
      }
    }

    chatMessages.push({
      id: message.id,
      role: message.role as Message['role'],
      content: textContent,
      reasoning,
      toolInvocations,
    });

    return chatMessages;
  }, []);
}

export function sanitizeUnknownStrings<T>(data: T): T {
  if (typeof data === 'string') {
    return (data === '<UNKNOWN>' ? '' : data) as T;
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeUnknownStrings(item)) as T;
  }
  if (typeof data === 'object' && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        sanitizeUnknownStrings(value),
      ])
    ) as T;
  }
  return data;
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
