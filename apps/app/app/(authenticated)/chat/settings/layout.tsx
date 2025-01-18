'use client';
import { SettingsTopNav } from '@/app/(authenticated)/chat/components/chat-input/settings-top-nav';
import { useRootContext } from '@/context/root';
import { Flex } from '@repo/design-system/components/ui/flex';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';

export type TSettingMenu = {
  name: string;
  //TODO: later add hugeicons props
  // icon: FC<Omit<HugeiconsProps, "ref"> & RefAttributes<SVGSVGElement>>;
  icon: any;
  route: string;
};

export default function SettingsPage({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { setIsMobileSidebarOpen } = useRootContext();
  const { push } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileSidebarOpen(false);
    if (pathname === '/chat/settings') {
      push('/chat/settings/common');
    }
  }, [pathname]);

  return (
    <Flex
      justify="center"
      className="no-scrollbar h-full w-full overflow-y-auto"
    >
      <SettingsTopNav />
      <Flex className="relative w-[720px]">
        <Flex className="w-full px-4 pt-16 md:p-8">{children}</Flex>
      </Flex>
    </Flex>
  );
}
