'use client';

import { ApiKeyModal } from '@/app/(organization)/chat/components/api-key-modal';
import { CommandSearch } from '@/app/(organization)/chat/components/command-search';
import { HistorySidebar } from '@/app/(organization)/chat/components/history/history-side-bar';
import { Sidebar } from '@/app/(organization)/chat/components/layout/sidebar';
import { PricingModal } from '@/app/(organization)/chat/components/pricing-modal';
import { MessageLimitModal } from '@/app/(organization)/chat/components/message-limit-modal';
import { useRootContext } from '@/context/root';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Toaster } from '@repo/design-system/components/ui/toaster';
import { cn } from '@repo/design-system/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Drawer } from 'vaul';

export type RootLayoutProps = {
  children: React.ReactNode;
};

export const RootLayout = ({ children }: RootLayoutProps) => {
  const pathname = usePathname();
  const { isSidebarOpen, isMobileSidebarOpen, setIsMobileSidebarOpen } =
    useRootContext();

  const mainContainerClass =
    'relative flex flex-1 flex-col h-[98dvh] w-full overflow-hidden rounded-md bg-zinc-25 shadow-sm dark:border dark:border-white/5 dark:bg-zinc-800';

  return (
    <div className="flex min-h-[100dvh] w-full flex-col justify-start bg-white md:flex-row dark:bg-zinc-800">
      <div className="flex min-h-[100dvh] w-full flex-col overflow-hidden bg-zinc-50 md:flex-row dark:bg-zinc-900">
        {/* <div className="hidden md:block">
          <Sidebar />
        </div> */}
        <Flex className="flex-1 gap-0 overflow-hidden">
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                key="history-sidebar"
                layoutId="sidebar"
                initial={{ width: 0, opacity: 1 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="hidden md:block"
              >
                <HistorySidebar />
              </motion.div>
            )}
          </AnimatePresence>
          {/* {isSettingsPage && (
            <div className="hidden md:block">
              <SettingsSidebar />
            </div>
          )} */}
          <Drawer.Root
            open={isMobileSidebarOpen}
            direction="left"
            shouldScaleBackground
            onOpenChange={setIsMobileSidebarOpen}
          >
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 z-30 bg-zinc-500/70 backdrop-blur-sm" />
              <Drawer.Content
                className={cn('fixed top-0 bottom-0 left-0 z-[50]')}
              >
                <Flex className="bg-zinc-50 pr-2 dark:bg-zinc-900">
                  <Sidebar />
                  {/* {isChatPage && !isSettingsPage && <HistorySidebar />} */}
                  {/* {isSettingsPage && <SettingsSidebar />} */}
                  <HistorySidebar />
                </Flex>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
          <motion.div className="flex-1 pt-2 pr-2">
            <div className={cn(mainContainerClass)}>{children}</div>
          </motion.div>
          <ApiKeyModal />
          <PricingModal />
          <MessageLimitModal />
          <CommandSearch />
        </Flex>
        <Toaster />
      </div>
    </div>
  );
};

// export const MainLayout = ({ children }: MainLayoutProps) => {
//   const pathname = usePathname();
//   const { isSidebarOpen, isMobileSidebarOpen, setIsMobileSidebarOpen } =
//     useRootContext();

//   const isChatPage = pathname.startsWith("/chat");
//   const isSettingsPage = pathname.startsWith("/settings");
//   const mainContainerClass =
//     "relative flex flex-1 flex-col h-[98dvh] w-full overflow-hidden rounded-md bg-zinc-25 shadow-sm dark:border dark:border-white/5 dark:bg-zinc-800";
//   const settingsContainerClass =
//     "overflow-hidden h-[98dvh] w-full rounded-md bg-white shadow-sm dark:border dark:border-white/5 dark:bg-zinc-800";

//   return (
//     <div className="flex min-h-[98dvh] w-full flex-row gap-0.5 overflow-hidden bg-zinc-50 dark:bg-zinc-900">
//       <Flex className="hidden lg:flex">
//         <Sidebar />
//         <AnimatePresence>
//           {isChatPage && isSidebarOpen && <HistorySidebar />}
//           {isSettingsPage && <SettingsSidebar />}
//         </AnimatePresence>
//       </Flex>
//       <Drawer.Root
//         open={isMobileSidebarOpen}
//         direction="left"
//         shouldScaleBackground
//         onOpenChange={setIsMobileSidebarOpen}
//       >
//         <Drawer.Portal>
//           <Drawer.Overlay className="fixed inset-0 z-30 bg-zinc-500/70 backdrop-blur-sm" />
//           <Drawer.Content className={cn("fixed bottom-0 left-0 top-0 z-[50]")}>
//             <Flex className="bg-zinc-50 pr-2">
//               {isChatPage && <HistorySidebar />}
//               {isSettingsPage && <SettingsSidebar />}
//             </Flex>
//           </Drawer.Content>
//         </Drawer.Portal>
//       </Drawer.Root>

//       <Flex className="w-full">
//         <motion.div className="flex flex-1 gap-0 overflow-hidden p-0 md:px-2 md:pt-2">
//           <div
//             className={cn(
//               isSettingsPage ? settingsContainerClass : mainContainerClass,
//             )}
//           >
//             {children}
//           </div>
//         </motion.div>
//         <ApiKeyModal />
//         <CommandSearch />
//       </Flex>
//       <Toaster />
//     </div>
//   );
// };
