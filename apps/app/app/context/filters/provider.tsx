'use client';
import { useChatContext } from '@/app/context/chat/context';
import { FiltersContext } from '@/app/context/filters/context';
import { Chat, Plus } from '@phosphor-icons/react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/design-system/components/ui/command';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export type TFiltersProvider = {
  children: React.ReactNode;
};

export const FiltersProvider = ({ children }: TFiltersProvider) => {
  const { sessions, createSession } = useChatContext();
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const open = () => setIsFilterOpen(true);
  const dismiss = () => setIsFilterOpen(false);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsFilterOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  return (
    <FiltersContext.Provider value={{ open, dismiss }}>
      {children}
      <CommandDialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem
              className="gap-3"
              value="new"
              onSelect={(value) => {
                createSession().then((session) => {
                  router.push(`/chat/${session.id}`);
                  dismiss();
                });
              }}
            >
              <Plus size={14} weight="bold" />
              New session
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Sessions">
            {sessions?.map((session) => (
              <CommandItem
                key={session.id}
                value={`${session.id}/${session.title}`}
                className="w-full gap-3"
                onSelect={(value) => {
                  router.push(`/chat/${session.id}`);
                  dismiss();
                }}
              >
                <Chat
                  size={14}
                  weight="fill"
                  className="flex-shrink-0 text-zinc-500"
                />{' '}
                <span className="w-full truncate">{session.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </FiltersContext.Provider>
  );
};
