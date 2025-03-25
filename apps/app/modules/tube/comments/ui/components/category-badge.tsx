import { Badge, type Color } from '@repo/design-system/components/badge';
import { capitalCase } from 'change-case';

const categoryColors: Record<string, Color> = {
  POSITIVE: 'green',
  NEGATIVE: 'red',
  NEUTRAL: 'gray',
  SPAM: 'orange',
  OFFENSIVE: 'darkred',
  INFORMATIVE: 'blue',
  ENGAGEMENT: 'green',
  CONSTRUCTIVE_CRITICISM: 'purple',
  QUESTION: 'yellow',
  APPRECIATION: 'lightgreen',
  COLLABORATION_OPPORTUNITY: 'teal',
  SUPPORT: 'lightblue',
  HUMOROUS: 'orange',
  EDUCATIONAL: 'navy',
  PERSONAL_STORY: 'violet',
  OTHER: 'gray',
};

//TODO: FOR LATER
const commenterCategoryColors: Record<string, Color> = {
  TOP_FAN: 'green',
  CASUAL_VIEWER: 'gray',
  COLLABORATOR: 'teal',
  CRITIC: 'purple',
  INFLUENCER: 'blue',
  SPAMMER: 'orange',
  TROLL: 'darkred',
  SUPPORTER: 'lightblue',
  EDUCATOR: 'navy',
  ENTERTAINER: 'orange',
  QUESTIONER: 'yellow',
  STORYTELLER: 'violet',
  UNKNOWN: 'gray',
};

export const CategoryBadge = ({ category }: { category: string }) => {
  return (
    <Badge
      color={category ? categoryColors[category] || 'gray' : 'gray'}
      className="max-w-[100px] overflow-hidden "
    >
      {capitalCase(category || 'Uncategorized')}
    </Badge>
  );
};
