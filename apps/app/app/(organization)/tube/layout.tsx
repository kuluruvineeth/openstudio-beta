import { TubeLayout } from '@/modules/tube/home/ui/layouts/tube-layout';
import { TubeProvider } from '@/modules/tube/providers/tube-provider';
import { StudioNavbar } from '@/modules/tube/studio/ui/components/studio-navbar';
import { trpc } from '@/trpc/server';
import { Flex } from '@repo/design-system/components/ui/flex';
import type React from 'react';
interface LayoutProps {
  children: React.ReactNode;
}

// biome-ignore lint/suspicious/useAwait: <explanation>
const Layout = async ({ children }: LayoutProps) => {
  void trpc.user.getPremium.prefetch();
  return (
    <TubeProvider>
      <TubeLayout>
        <Flex className="w-full" direction="col">
          <StudioNavbar />
          {children}
        </Flex>
      </TubeLayout>
    </TubeProvider>
  );
};

export default Layout;
