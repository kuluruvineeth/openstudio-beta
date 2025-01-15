import { HistorySidebar } from '@/app/(authenticated)/chat/components/history/history-side-bar';
import { MoreOptionsDropdown } from '@/app/(authenticated)/chat/components/layout/more-options-dropdown';
import { ModelIcon } from '@/app/(authenticated)/chat/components/model-icon';
import { useSessions } from '@/context';
import { Button } from '@repo/design-system/components/ui';
import { BetaTag } from '@repo/design-system/components/ui/beta-tag';
import { Flex } from '@repo/design-system/components/ui/flex';
import { PlusSignIcon } from '@repo/design-system/components/ui/icons';
import { SidebarTrigger } from '@repo/design-system/components/ui/sidebar';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { useRouter } from 'next/navigation';

export const NavbarItem = ({
  tooltip,
  icon,
  onClick,
}: {
  tooltip: string;
  icon: any;
  onClick: () => void;
}) => {
  if (!icon) return null;
  const Icon = icon;
  return (
    <Tooltip content={tooltip} side="bottom" sideOffset={4}>
      <Button size="iconSm" variant="ghost" onClick={onClick}>
        <Icon size={18} strokeWidth={2} />
      </Button>
    </Tooltip>
  );
};

export const Navbar = () => {
  const { push } = useRouter();
  const { createSession } = useSessions();

  return (
    <div className="group fixed top-0 right-0 left-0 z-10 flex w-full flex-row items-center justify-center gap-2.5 border-zinc-500/10 py-2 pr-2 pl-4 md:border-r dark:border-zinc-500/5">
      <Flex className="flex-1" />
      <SidebarTrigger />
      <Flex
        direction="row"
        items="center"
        gap="sm"
        onClick={() => push('/')}
        className="cursor-pointer"
      >
        <ModelIcon type="chathub" size="xs" rounded={false} />
        <BetaTag />
      </Flex>

      <NavbarItem
        tooltip="New Session"
        icon={PlusSignIcon}
        onClick={() => {
          push('/chat');
          createSession();
        }}
      />
      {/* <Flex className="flex-1" /> */}
      <HistorySidebar />
      <MoreOptionsDropdown />
    </div>
  );
};
