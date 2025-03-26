'use client';

import { OnboardingModal } from '@/components/onboarding-modal';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsToolbar,
  TabsTrigger,
} from '@repo/design-system/components/ui/tabs';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Process } from '../components/process';
import { Rules } from '../components/rules';
import { RulesPrompt } from '../components/rules-prompt';

export const AutomationTabsSection = () => {
  return (
    <Suspense fallback={<AutomationTabsSectionSkeleton />}>
      <ErrorBoundary fallback={<div>Error</div>}>
        <AutomationTabsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const AutomationTabsSectionSkeleton = () => {
  return (
    <div className="w-full">
      {/* Tabs header skeleton */}
      <div className="mb-6 flex items-center justify-between border-border border-b pb-2">
        <div className="flex space-x-2 overflow-x-auto">
          {/* biome-ignore lint/style/useConsistentBuiltinInstantiation: <explanation> */}
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-20" />
          ))}
        </div>
        <Skeleton className="h-9 w-9" />
      </div>

      {/* Card skeleton */}
      <div className="rounded-lg border border-border">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Main content area */}
          <div className="col-span-2 p-6">
            <div className="mb-4 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            {/* Textarea skeleton */}
            <Skeleton className="mb-4 h-[300px] w-full" />
            {/* Buttons skeleton */}
            <div className="flex flex-wrap gap-2">
              {/* biome-ignore lint/style/useConsistentBuiltinInstantiation: <explanation> */}
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-9 w-32" />
              ))}
            </div>
          </div>

          {/* Examples sidebar skeleton */}
          <div className="p-6">
            <Skeleton className="mb-4 h-6 w-24" />
            <div className="space-y-2">
              {/* biome-ignore lint/style/useConsistentBuiltinInstantiation: <explanation> */}
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AutomationTabsSectionSuspense = () => {
  return (
    <Tabs defaultValue="prompt">
      <TabsToolbar>
        <div className="w-full overflow-x-auto">
          <TabsList>
            <TabsTrigger value="prompt">Prompt</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="test">Test</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
        </div>

        <OnboardingModal
          title="How to get started with your Personal AI Assistant"
          description={
            <p>
              Watch the video below to learn how to get started with your
              Personal AI Assistant to automatically handle your Youtube Channel
              Comments to begin with.
            </p>
          }
          videoId="Z_2XLXBjqzI"
        />
      </TabsToolbar>

      <TabsContent value="prompt" className="mb-10 px-2 sm:px-6">
        <RulesPrompt />
      </TabsContent>
      <TabsContent value="rules" className="mb-10 px-2 sm:px-6">
        <Rules />
      </TabsContent>
      <TabsContent value="test" className="mb-10 px-2 sm:px-6">
        <Process />
      </TabsContent>
      <TabsContent value="history" className="mb-10 px-2 sm:px-6">
        History
      </TabsContent>
      <TabsContent value="pending" className="mb-10 px-2 sm:px-6">
        Pending
      </TabsContent>
    </Tabs>
  );
};
