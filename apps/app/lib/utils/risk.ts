import type { actionType } from '@repo/backend/schema';
import type { RuleConditions } from './condition';

const RISK_LEVELS = {
  VERY_HIGH: 'very-high',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export type RiskLevel = (typeof RISK_LEVELS)[keyof typeof RISK_LEVELS];

export type RiskAction = {
  type: (typeof actionType)[keyof typeof actionType];
  content: string | null;
  url: string | null;
};

export function getActionRiskLevel(
  action: RiskAction,
  isAutomated: boolean,
  rule: RuleConditions
): {
  level: RiskLevel;
  message: string;
} {
  const highRiskActions = ['DELETE', 'REPLY'];

  if (!highRiskActions.some((type) => action.type === type)) {
    return {
      level: RISK_LEVELS.LOW,
      message:
        'Low Risk: No Comment replying or deleting action is performed without your review.',
    };
  }

  //TODO: Lots of other checks needs to be added here

  return {
    level: RISK_LEVELS.HIGH,
    message: 'High Risk: Comment replying or deleting action is performed.',
  };
}
