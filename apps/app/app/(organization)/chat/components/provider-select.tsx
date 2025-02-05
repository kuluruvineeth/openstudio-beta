import { providers } from '@/config/models';
import type { TProvider } from '@/types';
import {
  Button,
  type ButtonProps,
} from '@repo/design-system/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { Flex } from '@repo/design-system/components/ui/flex';
import { cn } from '@repo/design-system/lib/utils';
import { ChevronDown } from 'lucide-react';
import { type FC, useState } from 'react';
import { ModelIcon } from './model-icon';

export type TProviderSelect = {
  selectedProvider: TProvider;
  fullWidth?: boolean;
  variant?: ButtonProps['variant'];
  setSelectedProvider: (provider: TProvider) => void;
  className?: string;
};
export const ProviderSelect: FC<TProviderSelect> = ({
  selectedProvider,
  variant = 'secondary',
  fullWidth,
  setSelectedProvider,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            className={cn('justify-start gap-2 text-xs md:text-sm', className)}
          >
            <ModelIcon type={selectedProvider} size="sm" />
            {selectedProvider}
            <Flex className="flex-1" />
            <ChevronDown size={14} strokeWidth="2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="end"
          sideOffset={4}
          className={cn(
            'no-scrollbar z-[999] max-h-[260px] overflow-y-auto text-xs md:text-sm',
            fullWidth ? 'w-full' : 'min-w-[250px]'
          )}
        >
          {providers
            ?.filter((a) => !['chathub'].includes(a))
            .map((p) => {
              return (
                <DropdownMenuItem
                  className={cn(
                    'font-medium text-xs md:text-sm',
                    selectedProvider === p && 'bg-zinc-50 dark:bg-black/30'
                  )}
                  key={p}
                  onClick={() => {
                    setSelectedProvider(p);
                    setIsOpen(false);
                  }}
                >
                  <ModelIcon type={p} size="sm" />
                  {p}
                </DropdownMenuItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
