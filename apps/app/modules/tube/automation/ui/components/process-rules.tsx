'use client';

import {
  isAIRule,
  isCategoryRule,
  isGroupRule,
  isStaticRule,
} from '@/lib/utils/condition';
import { trpc } from '@/trpc/client';
import { CardContent } from '@repo/design-system/components/ui';
import { Button } from '@repo/design-system/components/ui/button';
import { Separator } from '@repo/design-system/components/ui/separator';
import { BookOpenCheckIcon, PauseIcon, PenSquareIcon } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { parseAsBoolean } from 'nuqs';
import { useRef, useState } from 'react';
export function ProcessRulesContent({ testMode }: { testMode: boolean }) {
  const [searchQuery, setSearchQuery] = useQueryState('search');
  const [showCustomForm, setShowCustomForm] = useQueryState(
    'custom',
    parseAsBoolean.withDefault(false)
  );
  const isRunningAllRef = useRef(false);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [currentPageLimit, setCurrentPageLimit] = useState(testMode ? 1 : 10);

  const { data: rules } = trpc.automation.getRules.useQuery();

  const hasAiRules = rules?.some(
    (rule) =>
      isAIRule(rule) &&
      !isStaticRule(rule) &&
      !isGroupRule(rule) &&
      !isCategoryRule(rule)
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-2 border-border border-b px-6 pb-4">
        <div className="flex items-center gap-2">
          {isRunningAll ? (
            <Button variant="outline" prefixIcon={PauseIcon}>
              Stop
            </Button>
          ) : (
            <Button variant="outline" prefixIcon={BookOpenCheckIcon}>
              {testMode ? 'Test All' : 'Run on All'}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasAiRules && testMode && (
            <Button
              variant={'ghost'}
              onClick={() => setShowCustomForm((show) => !show)}
              prefixIcon={PenSquareIcon}
            >
              Custom
            </Button>
          )}
        </div>
      </div>

      {hasAiRules && showCustomForm && testMode && (
        <div className="mt-2">
          <CardContent>
            <h1>Custom Form</h1>
          </CardContent>
          <Separator />
        </div>
      )}
    </div>
  );
}
