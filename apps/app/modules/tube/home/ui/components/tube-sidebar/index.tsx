'use client';

import { configs } from '@/config/index';
import * as navigation from '@/lib/navigation';
import { Button } from '@repo/design-system/components/ui';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { Github, Moon, Sun, Twitter } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const TubeSidebar = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative flex h-[100dvh] w-[260px] flex-shrink-0 flex-row border-zinc-500/10 border-l">
      <Flex direction="col" gap="xl" className="no-scrollbar w-full pr-1 pl-3">
        <Flex
          direction="col"
          gap="xl"
          className="no-scrollbar w-full flex-1 overflow-y-auto pt-4"
        >
          <Flex gap="xs" direction="col" items="start" className="w-full">
            <Flex className="w-full" gap="xs" direction="col">
              {[
                navigation.tubeStudio,
                navigation.tubeAIAutomation,
                navigation.youtubeComments,
                // navigation.smartCategorization,
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex h-9 w-full cursor-pointer flex-row items-center gap-2 rounded-md py-0.5 pr-1 pl-2 hover:bg-zinc-500/10 ${
                    item.active(pathname) ? 'bg-zinc-500/10' : ''
                  }`}
                >
                  <Flex
                    direction="row"
                    items="center"
                    className="w-full"
                    gap="xs"
                  >
                    <item.icon size={16} />
                    <Type
                      className="line-clamp-1 w-full"
                      size="sm"
                      textColor="primary"
                    >
                      {item.label}
                    </Type>
                  </Flex>
                </Link>
              ))}
            </Flex>
          </Flex>
        </Flex>
        <Flex
          className="w-full bg-zinc-50 py-3 dark:bg-zinc-900"
          direction="col"
          gap="sm"
        >
          <Flex className="w-full items-center justify-between opacity-70">
            <Flex gap="xs">
              <Button
                size="icon-xs"
                variant="ghost"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              </Button>
              <Button
                size="icon-xs"
                variant="ghost"
                onClick={() => {
                  window.open(
                    'https://github.com/kuluruvineeth/openstudio-beta',
                    '_blank'
                  );
                }}
              >
                <Github size={14} />
              </Button>
              <Button
                size="icon-xs"
                variant="ghost"
                onClick={() => {
                  window.open('https://x.com/kuluruvineeth', '_blank');
                }}
              >
                <Twitter size={14} />
              </Button>
            </Flex>
            <Type
              size="xs"
              weight="medium"
              textColor="secondary"
              className="px-1"
            >
              v {configs.version}
            </Type>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};
