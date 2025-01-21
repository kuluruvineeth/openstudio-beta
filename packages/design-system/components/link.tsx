import NextLink from 'next/link';
import { forwardRef } from 'react';
import type { ComponentProps } from 'react';

type LinkProperties = {
  readonly href: string;
  readonly children: ComponentProps<'a'>['children'];
  readonly className?: string;
  readonly external?: boolean;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProperties>(
  ({ href, external, ...properties }, reference) => {
    const isExternal = href.startsWith('http');

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          {...properties}
          ref={reference}
        />
      );
    }

    return (
      <NextLink
        target={external ? '_blank' : undefined}
        href={href}
        {...properties}
        ref={reference}
      />
    );
  }
);
