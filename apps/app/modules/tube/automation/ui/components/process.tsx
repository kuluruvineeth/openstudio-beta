'use client';

import { trpc } from '@/trpc/client';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui';
import { useQueryState } from 'nuqs';
import { YoutubeIntegrationAlert } from './no-youtube-integration-alert';
import { ProcessRulesContent } from './process-rules';
import { Toggle } from './toggle';

export function Process() {
  const [mode, setMode] = useQueryState('mode');
  const isApplyMode = mode === 'apply';

  const { data: youtubeIntegrationData } =
    trpc.automation.getYoutubeIntegration.useQuery();

  return (
    <>
      {/* if no youtube integration, show alert */}
      {!youtubeIntegrationData && <YoutubeIntegrationAlert />}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-1.5">
              <CardTitle>
                {isApplyMode ? 'Process your comments' : 'Test your rules'}
              </CardTitle>
              <CardDescription>
                {isApplyMode
                  ? 'Run your rules on previous comments'
                  : 'Check how your rules perform against previous comments.'}
              </CardDescription>
            </div>
            <div className="flex pt-1">
              <Toggle
                name="test-mode"
                label="Test"
                labelRight="Apply"
                enabled={isApplyMode}
                onChange={(enabled: boolean) =>
                  setMode(enabled ? 'apply' : 'test')
                }
              />
            </div>
          </div>
        </CardHeader>
        <ProcessRulesContent testMode={!isApplyMode} />
      </Card>
    </>
  );
}
