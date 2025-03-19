'use client';

import { Container } from '@repo/design-system/components/container';
import { Prose } from '@repo/design-system/components/prose';
import { Badge } from '@repo/design-system/components/ui/badge';
import { UnderConstruction } from '@repo/design-system/components/ui/under-construction';
import { cn } from '@repo/design-system/lib/utils';
import { ArrowUpRightIcon } from 'lucide-react';
import { LazyMotion, domAnimation, m } from 'motion/react';
import Image from 'next/image';
import type { ComponentProps } from 'react';
import Balancer from 'react-wrap-balancer';
import { CTAButton } from '../cta-button';

type HeroProperties = ComponentProps<'section'> & {
  readonly latestUpdate: string | undefined;
};

export const Hero = ({
  className,
  latestUpdate,
  ...properties
}: HeroProperties) => (
  <section className={cn('overflow-hidden', className)} {...properties}>
    <LazyMotion features={domAnimation}>
      <Container className="border-x p-4 text-center">
        <div className="rounded-xl border bg-background p-8 shadow-sm sm:p-16 md:p-24">
          <div className="relative z-10 flex flex-col items-center">
            {latestUpdate ? (
              <m.div
                animate={{ opacity: 1, translateY: 0 }}
                initial={{ opacity: 0, translateY: 16 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
              >
                <a
                  aria-label="View latest update on OpenStudio changelog page"
                  href="https://openstudio.tech/changelog"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Badge
                    variant="outline"
                    className="gap-2 rounded-full py-0.5 pr-3 pl-0.5 font-medium"
                  >
                    <span
                      className="shrink-0 truncate rounded-full bg-foreground/5 px-2.5 py-1 text-muted-foreground text-xs"
                      style={{
                        boxShadow: 'inset 0 1px 0 0 hsla(0,0%,100%,.08)',
                      }}
                    >
                      Latest update
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <span className="w-full truncate">{latestUpdate}</span>
                      <ArrowUpRightIcon
                        size={16}
                        className="shrink-0 text-muted-foreground"
                      />
                    </span>
                  </Badge>
                </a>
              </m.div>
            ) : null}
            <Prose className="mt-8 max-w-6xl">
              <UnderConstruction />
              <m.h1
                initial={{ opacity: 0, translateY: 16 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 1, ease: 'easeInOut', delay: 0.5 }}
                className={cn(
                  'mb-4 font-semibold tracking-tighter',
                  'text-[2.125rem] sm:text-5xl md:text-6xl lg:text-7xl'
                )}
              >
                Open Studio,
                <br /> meet open apps
              </m.h1>
              <m.p
                className="mx-auto mt-0 max-w-3xl text-muted-foreground sm:text-lg"
                initial={{ opacity: 0, translateY: 16 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 1, ease: 'easeInOut', delay: 1 }}
              >
                <Balancer>
                  Open Studio is an attempt to build an open-source ecosystem
                  of verticalized AI agents. ChatHub drives research and
                  starting with verticalized agent like OpenStudio Tube to get
                  the work done for YouTube. More niche AI inbound!
                </Balancer>
              </m.p>
            </Prose>
            <m.div
              className="mt-8 flex max-w-lg flex-col items-center gap-4 sm:flex-row"
              initial={{ opacity: 0, translateY: 16 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 1, ease: 'easeInOut', delay: 1.5 }}
            >
              <CTAButton size="lg" />
              {/* <Button variant="outlined" size="lg">
                <Link href="/pricing">See pricing</Link>
              </Button> */}
            </m.div>
          </div>
        </div>
      </Container>
      <Screenshots />
    </LazyMotion>
  </section>
);

export function Screenshots() {
  const images = {
    light: '/home/hero.png',
    dark: '/home/hero.png',
  };

  return (
    <div className="relative flex aspect-[4/3.6] flex-col gap-4 overflow-hidden md:aspect-auto">
      {/* <div className='overflow-hidden bg-gradient-to-t from-gray-50 to-white after:absolute after:bottom-0 after:left-0 after:right-0 after:z-20 after:h-[0.5px] dark:from-gray-900 dark:after:bg-gray-800'> */}
      <div className="overflow-hidden bg-gradient-to-t from-gray-50 to-white dark:from-gray-900">
        <Image
          alt="Screenshot of OpenStudio ChatHub Multi-Assistant AI"
          src={images.dark}
          width={1280} // Use the full size instead of dividing
          height={406} // Use the full size instead of dividing
          priority
          quality={100}
          className="md:-mb-[60px] lg:-mb-[100px] relative z-10 mx-auto w-full max-w-7xl" // Modified classes
        />
      </div>
      <Image
        draggable={false}
        src="/home/watercolor-2.webp"
        width={1792 / 2}
        height={1024 / 2}
        priority
        alt="watercolor"
        className="-bottom-[20%] absolute left-[53%] z-0 saturate-[200%]"
      />
      <Image
        draggable={false}
        src="/home/watercolor-2.webp"
        width={1792 / 2}
        height={1024 / 2}
        priority
        alt="watercolor"
        className="-bottom-[20%] absolute right-[54%] z-0 saturate-[200%]"
      />
    </div>
  );
}
