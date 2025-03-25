import '@repo/design-system/styles/globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { TRPCProvider } from '@/trpc/client';
import { AnalyticsProvider } from '@repo/analytics';
import { DesignSystemProvider } from '@repo/design-system';
import { fonts } from '@repo/design-system/lib/fonts';
import { Toolbar } from '@repo/feature-flags/components/toolbar';
import type { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Open Studio',
  description:
    'OpenStudio - App of Apps, Your gateway to AI Powered Applications',
  openGraph: {
    title: 'Open Studio',
    siteName: 'Open Studio',
    description:
      'Experience the future of AI applications in one unified platform. Open Studio brings you a seamless gateway to cutting-edge AI tools and services.',
    url: 'https://openstudio.tech',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Open Studio',
    site: 'openstudio.tech',
    description:
      'Discover a world of AI possibilities with Open Studio. Your all-in-one platform for accessing and interacting with advanced AI applications.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://openstudio.tech',
  },
};

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html lang="en" className={fonts} suppressHydrationWarning>
    <body className="min-h-screen bg-backdrop">
      <TRPCProvider>
        <AnalyticsProvider>
          <DesignSystemProvider>
            <QueryProvider>
              <NuqsAdapter>{children}</NuqsAdapter>
            </QueryProvider>
          </DesignSystemProvider>
          <Toolbar />
        </AnalyticsProvider>
      </TRPCProvider>
    </body>
  </html>
);

export default RootLayout;
