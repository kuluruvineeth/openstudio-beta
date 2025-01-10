import {
  PreferenceProvider,
  ReactQueryProvider,
  SessionsProvider,
} from '@/context'; // Consolidated context imports
import { TooltipProvider } from '@repo/design-system/components/ui/tooltip';
import { ThemeProvider } from '@repo/design-system/providers/theme';

import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <Header pages={['']} page=""></Header> */}
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ReactQueryProvider>
          <TooltipProvider>
            <PreferenceProvider>
              <SessionsProvider>{children}</SessionsProvider>
            </PreferenceProvider>
          </TooltipProvider>
        </ReactQueryProvider>
      </ThemeProvider>
    </>
  );
}
