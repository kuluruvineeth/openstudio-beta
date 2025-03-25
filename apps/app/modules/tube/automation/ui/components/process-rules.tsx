'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { BookOpenCheckIcon, PauseIcon } from 'lucide-react';
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
      </div>
    </div>
  );
}
