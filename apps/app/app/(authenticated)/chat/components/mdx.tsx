import { CodeBlock } from '@/app/(authenticated)/chat/components/codeblock';
import { SearchFavicon } from '@/app/(authenticated)/chat/components/tools/search-favicon';
import { REVEAL_ANIMATION_VARIANTS } from '@/helper/animations';
import { isValidUrl } from '@/helper/utils';
import { ArrowUpRight } from '@phosphor-icons/react';
import { Flex } from '@repo/design-system/components/ui/flex';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@repo/design-system/components/ui/hover-card';
import { Type } from '@repo/design-system/components/ui/text';
import { cn } from '@repo/design-system/lib/utils';
import { motion } from 'framer-motion';
import Markdown from 'marked-react';
import type { FC, JSX, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Link from "next/link";

export type TMdx = {
  message?: string;
  animate: boolean;
  messageId?: string;
  size?: 'xs' | 'sm' | 'base';
};
const Mdx: FC<TMdx> = ({ message, animate, messageId, size = 'base' }) => {
  const [processedMessage, setProcessedMessage] = useState('');
  useEffect(() => {
    if (message) {
      // Process the message to hide incomplete Markdown elements
      const processed = hideIncompleteMarkdown(message);
      setProcessedMessage(processed);
    }
  }, [message]);
  const hideIncompleteMarkdown = (text: string) => {
    // Remove incomplete links
    text = text.replace(/\[([^\]]*)\](\([^)]*\)?)?/g, (match, text, url) => {
      return url && url.endsWith(')') ? match : '';
    });
    // Remove incomplete images
    text = text.replace(/!\[([^\]]*)\]\(([^)]*)\)/g, (match, alt, src) => {
      return src && src.endsWith(')') ? match : '';
    });
    // Remove incomplete table cells
    text = text.replace(/\|([^|]+)\|/g, (match, text) => {
      return text ? match : '';
    });
    // Remove incomplete table cells (duplicate, can be removed)
    text = text.replace(/\|([^|]+)\|/g, (match, text) => {
      return text ? match : '';
    });
    return text;
  };

  if (!message || !messageId) {
    return null;
  }
  const renderParagraph = (children: ReactNode) => <p>{children}</p>;
  const renderEm = (children: ReactNode) => <em>{children}</em>;
  const renderHeading = (children: ReactNode, level: number) => {
    const Heading = `h${level}` as keyof JSX.IntrinsicElements;
    return <Heading>{children}</Heading>;
  };
  const renderHr = () => (
    <hr className="my-4 border-gray-100 dark:border-white/10" />
  );
  const renderLink = (href: string, text: ReactNode, messageId: string) => {
    if (text && isValidUrl(href)) {
      const url = new URL(href).host;
      return (
        <HoverCard>
          <HoverCardTrigger>
            <Link
              href={href}
              target="_blank"
              data-message-id={messageId}
              className="!no-underline font-normal text-blue-500 dark:text-blue-400"
              rel="noreferrer"
            >
              {text}
            </Link>
          </HoverCardTrigger>
          <HoverCardContent
            sideOffset={12}
            className="flex max-w-[400px] cursor-pointer flex-col items-start rounded-lg p-2"
            onClick={() => {
              window.open(href, '_blank');
            }}
          >
            <Flex gap="sm" items="start" className="w-full text-zinc-500">
              <SearchFavicon link={url} className="!m-0 !mt-1" size="md" />
              <Type
                size="sm"
                textColor="secondary"
                className="line-clamp-2 flex-1"
              >
                {href}
              </Type>
              <ArrowUpRight
                size={16}
                weight="bold"
                className="mt-1 flex-shrink-0"
              />
            </Flex>
          </HoverCardContent>
        </HoverCard>
      );
    }
    return <></>;
  };
  const renderImage = (src: string, alt: string) => {
    return <></>;
  };
  const renderBlockquote = (children: ReactNode) => (
    <blockquote>
      <p>{children}</p>
    </blockquote>
  );
  const renderList = (children: ReactNode, ordered: boolean) =>
    ordered ? <ol>{children}</ol> : <ul>{children}</ul>;
  const renderListItem = (children: ReactNode) => (
    <li>
      <p>{children}</p>
    </li>
  );
  const renderStrong = (children: ReactNode) => <strong>{children}</strong>;
  const renderCode = (code: string, lang: string) => (
    <div className="not-prose my-4 w-full flex-shrink-0">
      <CodeBlock lang={lang} code={code?.toString()} />
    </div>
  );
  const renderCodespan = (code: string) => (
    <span className="rounded-md bg-zinc-50 px-2 py-1 font-medium text-sm text-zinc-800 md:text-base dark:bg-white/10 dark:text-white">
      {code}
    </span>
  );

  const articleClass = cn(
    'prose dark:prose-invert prose-zinc w-full pb-8 prose-h3:font-medium prose-h4:font-medium prose-h5:font-medium prose-h6:font-medium prose-heading:font-medium prose-strong:font-medium prose-h3:text-base prose-h4:text-sm prose-h5:text-sm prose-h6:text-sm prose-headings:text-lg prose-th:text-sm md:prose-h3:text-lg md:prose-h4:text-base md:prose-h5:text-base md:prose-h6:text-base',
    {
      'prose-sm': size === 'sm',
      'prose-sm md:prose-base': size === 'base',
      'prose-xs': size === 'xs',
    }
  );

  return (
    <article className={articleClass} id={`message-${messageId}`}>
      <Markdown
        renderer={{
          text: (text) => (
            <motion.span
              variants={REVEAL_ANIMATION_VARIANTS}
              animate={'visible'}
              initial={animate ? 'hidden' : 'visible'}
            >
              {text}
            </motion.span>
          ),
          paragraph: renderParagraph,
          em: renderEm,
          heading: renderHeading,
          hr: renderHr,
          link: (href, text) => renderLink(href, text, messageId),
          image: renderImage,
          blockquote: renderBlockquote,
          list: renderList,
          listItem: renderListItem,
          strong: renderStrong,
          code: renderCode,
          codespan: renderCodespan,
        }}
        openLinksInNewTab={true}
      >
        {processedMessage}
      </Markdown>
    </article>
  );
};
Mdx.displayName = 'Mdx';
export { Mdx };
