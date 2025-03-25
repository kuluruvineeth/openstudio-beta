export const defaultCommentCategory = {
  POSITIVE: {
    name: 'Positive',
    enabled: true,
    description: 'Encouraging and uplifting comments',
  },
  NEGATIVE: {
    name: 'Negative',
    enabled: true,
    description: 'Critical or unfavorable comments',
  },
  NEUTRAL: {
    name: 'Neutral',
    enabled: true,
    description: 'Balanced or neutral tone comments',
  },
  SPAM: {
    name: 'Spam',
    enabled: true,
    description: 'Unwanted or repetitive promotional messages',
  },
  OFFENSIVE: {
    name: 'Offensive',
    enabled: true,
    description: 'Hateful or inappropriate comments',
  },
  INFORMATIVE: {
    name: 'Informative',
    enabled: true,
    description: 'Fact-based or educational content',
  },
  ENGAGEMENT: {
    name: 'Engagement',
    enabled: true,
    description: 'General interactions and audience engagement',
  },
  CONSTRUCTIVE_CRITICISM: {
    name: 'Constructive Criticism',
    enabled: true,
    description: 'Helpful feedback and suggestions',
  },
  QUESTION: {
    name: 'Question',
    enabled: true,
    description: 'Inquiries and clarifications',
  },
  APPRECIATION: {
    name: 'Appreciation',
    enabled: true,
    description: 'Expressions of gratitude or admiration',
  },
  COLLABORATION_OPPORTUNITY: {
    name: 'Collaboration Opportunity',
    enabled: true,
    description: 'Requests or offers for collaboration',
  },
  SUPPORT: {
    name: 'Support',
    enabled: true,
    description: 'Encouraging or assisting the creator',
  },
  HUMOROUS: {
    name: 'Humorous',
    enabled: true,
    description: 'Funny or lighthearted comments',
  },
  EDUCATIONAL: {
    name: 'Educational',
    enabled: true,
    description: 'Teaching or sharing knowledge',
  },
  PERSONAL_STORY: {
    name: 'Personal Story',
    enabled: true,
    description: 'Sharing personal experiences',
  },
  OTHER: {
    name: 'Other',
    enabled: true,
    description: 'Unclassified or miscellaneous comments',
  },
} as const;

export const defaultCommenterCategory = {
  TOP_FAN: {
    name: 'Top Fan',
    enabled: true,
    description: 'Highly engaged and supportive viewer',
  },
  CASUAL_VIEWER: {
    name: 'Casual Viewer',
    enabled: true,
    description: 'Occasional commenter or passive viewer',
  },
  COLLABORATOR: {
    name: 'Collaborator',
    enabled: true,
    description: 'Potential or existing collaboration partner',
  },
  CRITIC: {
    name: 'Critic',
    enabled: true,
    description: 'Frequently provides negative feedback',
  },
  INFLUENCER: {
    name: 'Influencer',
    enabled: true,
    description: 'A recognized or well-known creator',
  },
  SPAMMER: {
    name: 'Spammer',
    enabled: true,
    description: 'Repeatedly posts promotional or irrelevant content',
  },
  TROLL: {
    name: 'Troll',
    enabled: true,
    description: 'Posts inflammatory or disruptive comments',
  },
  SUPPORTER: {
    name: 'Supporter',
    enabled: true,
    description: 'Consistently encourages and engages',
  },
  EDUCATOR: {
    name: 'Educator',
    enabled: true,
    description: 'Shares knowledge and valuable insights',
  },
  ENTERTAINER: {
    name: 'Entertainer',
    enabled: true,
    description: 'Posts humorous or engaging content',
  },
  QUESTIONER: {
    name: 'Questioner',
    enabled: true,
    description: 'Frequently asks questions and seeks clarification',
  },
  STORYTELLER: {
    name: 'Storyteller',
    enabled: true,
    description: 'Shares personal anecdotes or experiences',
  },
  UNKNOWN: {
    name: 'Unknown',
    enabled: true,
    description: "Commenters that don't fit any category",
  },
} as const;

export type CommentCategoryKey = keyof typeof defaultCommentCategory;
export type CommentCategoryValue =
  (typeof defaultCommentCategory)[CommentCategoryKey];
export type CommentCategory = CommentCategoryValue['name'];

export type CommenterCategoryKey = keyof typeof defaultCommenterCategory;
export type CommenterCategoryValue =
  (typeof defaultCommenterCategory)[CommenterCategoryKey];
export type CommenterCategory = CommenterCategoryValue['name'];
