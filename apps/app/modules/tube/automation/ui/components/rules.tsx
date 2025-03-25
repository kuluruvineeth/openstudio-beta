'use client';

import { trpc } from '@/trpc/client';
import type { actionType } from '@repo/backend/schema';
import { Badge } from '@repo/design-system/components/badge';
import { LoadingContent } from '@repo/design-system/components/loading-content';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { DropdownMenu } from '@repo/design-system/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/design-system/components/ui/table';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { capitalCase } from 'change-case';
import {
  AlertTriangleIcon,
  MoreHorizontalIcon,
  PenIcon,
  PlusIcon,
} from 'lucide-react';
import Link from 'next/link';
import { getActionColor } from './plan-badge';
import { Toggle } from './toggle';
type RuleAction = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: (typeof actionType.enumValues)[number];
  ruleId: string;
};

type CategoryFilter = {
  id: string;
  name: string;
};

type Rule = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  enabled: boolean;
  automate: boolean;
  userId: string;
  conditionalOperator: 'AND' | 'OR';
  instructions: string | null;
  categoryFilterType: 'INCLUDE' | 'EXCLUDE' | null;
  actions: RuleAction[];
  categoryFilters: CategoryFilter[];
};

export function Rules() {
  const { data, isLoading, error, refetch } =
    trpc.automation.getRules.useQuery();

  const hasRules = !!data?.length;

  const { mutate: setRuleAutomated } =
    trpc.automation.setRuleAutomated.useMutation();
  const { mutate: setRuleOnThreads } =
    trpc.automation.setRuleOnThreads.useMutation();

  return (
    <div>
      {hasRules && (
        <div className="my-2 flex justify-end gap-2">
          <Button variant="outline" prefixIcon={PenIcon}>
            <Link href="/tube/automation?tab=prompt">Add Rule via Prompt</Link>
          </Button>
          <Button variant="outline" prefixIcon={PlusIcon}>
            <Link href="/tube/automation/rule/create">Add Rule Manually</Link>
          </Button>
        </div>
      )}
      <Card>
        <LoadingContent loading={isLoading} error={error}>
          {hasRules ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead className="text-center">
                    <Tooltip content="When disabled, actions require manual approval in the Pending tab.">
                      <span>Automated</span>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="text-center">
                    <Tooltip content="Apply rule to comment threads">
                      <span>Threads</span>
                    </Tooltip>
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">User Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data
                  ?.sort((a, b) => (b.enabled ? 1 : 0) - (a.enabled ? 1 : 0))
                  .map((rule) => (
                    <TableRow
                      key={rule.id}
                      className={rule.enabled ? '' : 'bg-muted opacity-60'}
                    >
                      <TableCell className="font-medium">
                        <Link href={`/tube/automation/rules/${rule.id}`}>
                          {!rule.enabled && (
                            <Badge color="red" className="mr-2">
                              Disabled
                            </Badge>
                          )}
                          {rule.name}
                        </Link>
                      </TableCell>
                      <TableCell className="whitespace-pre-wrap">
                        {`AI: ${rule.instructions}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <SecurityAlert />
                          {'AI'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Actions actions={rule.actions} />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Toggle
                            enabled={rule.automate}
                            onChange={() => {
                              setRuleAutomated({
                                ruleId: rule.id,
                                automate: !rule.automate,
                              });
                              refetch();
                            }}
                            name="automate"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Toggle
                            enabled={rule.runOnThreads}
                            onChange={() => {
                              setRuleOnThreads({
                                ruleId: rule.id,
                                runOnThreads: !rule.runOnThreads,
                              });
                              refetch();
                            }}
                            name="runOnThreads"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontalIcon className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link href={`/tube/automation/rules/${rule.id}`}>
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {rule.enabled ? 'Disable' : 'Enable'}
                            </DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <NoRules />
          )}
        </LoadingContent>
      </Card>
    </div>
  );
}

function NoRules() {
  return (
    <>
      <CardHeader>
        <CardTitle>AI Personal Assistant</CardTitle>
        <CardDescription>
          Set up intelligent automations to let our AI handle your comments for
          you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/tube/automation?tab=prompt">
              <PenIcon className="mr-2 hidden h-4 w-4 md:block" />
              Set Prompt
            </Link>
          </Button>

          <Button type="button" variant="outline" asChild>
            <Link href="/tube/automation/rule/create">
              Create a Rule Manually
            </Link>
          </Button>
        </div>
      </CardContent>
    </>
  );
}

function Actions({ actions }: { actions: RuleAction[] | RuleAction | null }) {
  // biome-ignore lint/style/useBlockStatements: <explanation>
  if (!actions) return null;
  return (
    <div className="flex flex-1 space-x-2">
      {Array.isArray(actions)
        ? actions?.map((action) => {
            return (
              <Badge
                key={action.id}
                color={getActionColor(action.type)}
                className="text-nowrap"
              >
                {capitalCase(action.type)}
              </Badge>
            );
          })
        : actions && (
            <Badge
              key={actions.id}
              color={getActionColor(actions.type)}
              className="text-nowrap"
            >
              {capitalCase(actions.type)}
            </Badge>
          )}
    </div>
  );
}

//TODO: Make it dynamic based on the risk level
function SecurityAlert() {
  return (
    <Tooltip content="Low Risk: The AI just categorizes for now">
      <AlertTriangleIcon
        className="h-4 w-4"
        style={{
          color: '#FFD700',
        }}
      />
    </Tooltip>
  );
}
