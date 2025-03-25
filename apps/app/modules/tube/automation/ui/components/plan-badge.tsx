import type { actionType } from '@repo/backend/schema';
import type { Color } from '@repo/design-system/components/badge';

// Define a type for the action values using the enum values
type ActionValue = (typeof actionType.enumValues)[number];

export function getActionColor(action: ActionValue): Color {
  switch (action) {
    case 'REPLY':
      return 'blue';
    case 'DELETE':
      return 'red';
    case 'PUBLISH':
      return 'green';
    case 'REJECT':
      return 'yellow';
    case 'REVIEW':
      return 'purple';
    case 'MARK_AS_SPAM':
      return 'red';
    case 'NOTIFY':
      return 'orange';
    case 'CALL_WEBHOOK':
      return 'blue';
    case 'CATEGORIZE':
      return 'violet';
    case 'TRANSLATE':
      return 'purple';
    default:
      return 'gray';
  }
}
