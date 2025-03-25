// export function hasExampleParams(rule: {
//   condition: {
//     static?: {
//       videoId?: string | null;
//       from?: string | null;
//     } | null;
//   };
//   actions: { content?: string | null }[]; // Adjusted to match action table structure
// }) {
//   return (
//     rule.condition.static?.videoId?.includes('') ||
//     rule.condition.static?.from?.includes('@kuluruvineeth') ||
//     rule.actions.some((a) => a.content?.includes(''))
//   );
// }

const commonPrompts = [
  "Mark positive feedback comments as 'POSITIVE'",
  "Mark negative or critical comments as 'NEGATIVE'",
  "Mark neutral, general comments as 'NEUTRAL'",
  "Mark spam comments as 'SPAM' and hide them",
  "Mark offensive or inappropriate comments as 'OFFENSIVE'",
  "Mark comments sharing useful insights or facts as 'INFORMATIVE'",
  "Mark comments expressing engagement or excitement as 'ENGAGEMENT'",
  "Mark feedback about improving the content as 'CONSTRUCTIVE_CRITICISM'",
  "Mark questions about video content as 'QUESTION'",
  "Mark appreciative comments as 'APPRECIATION'",
  "Mark collaboration-related comments as 'COLLABORATION_OPPORTUNITY'",
  "Mark comments expressing support or encouragement as 'SUPPORT'",
  "Mark humorous or joke comments as 'HUMOROUS'",
  "Mark educational or learning-based comments as 'EDUCATIONAL'",
  "Mark personal experiences or stories as 'PERSONAL_STORY'",
  "If a comment doesn’t fit into any category, mark it as 'OTHER'",
];

const common = `${commonPrompts.map((prompt) => `* ${prompt}`).join('.\n')}.`;

export const examplePrompts = [
  ...commonPrompts,
  'Mark comments asking for future video topics as "Video Request"',
  'Mark comments reporting errors in the video as "Error Report"',
  'Reply to new viewers by thanking them for watching',
  'Mark comments with constructive criticism as "Feedback"',
  'If someone asks about my equipment, send them my gear list link: https://kit.co/example',
  'If someone asks about sponsorships, reply with my business email',
  'If someone leaves a detailed review, label it "Detailed Review" and heart the comment',
  'If someone shares my video, label it as "Share", heart it, and respond with a thank you message',
  'If someone asks for a tutorial, reply with links to relevant videos in my channel',
  'If someone reports a technical issue with the video, reply asking for more details about their device and browser',
  'Review any comments with questions and draft a helpful reply',
  'If people ask me to collaborate, label the comment "Collab Request" and reply with my collaboration criteria',
  'Mark comments from other creators as "Creator"',
  'Mark comments with merchandise questions as "Merch"',
  'Mark comments reporting inappropriate content as "Report"',
  'Mark comments mentioning competitors as "Competitor Mention"',
];

const creatorPrompt = `${common}
* If someone asks about my filming equipment, reply with my gear list: https://kit.co/example.
* Mark comments asking for advice as "Advice Request".
* Mark comments with technical questions as "Technical Question".
* Mark comments from regular viewers as "Regular Viewer".
* Mark comments with video suggestions as "Suggestion".
* Mark comments with timestamps as "Timestamp" and pin them.
* Mark comments reporting errors in the video as "Error Report".
* Mark comments with sponsorship inquiries as "Sponsorship" and reply with my business email.`;

export const personas = {
  contentCreator: {
    label: '📹 Content Creator',
    prompt: creatorPrompt,
  },
  educationalChannel: {
    label: '🎓 Educational Channel',
    prompt: `${common}
* Mark comments with additional resources as "Resources" and pin them.
* If someone asks for clarification on a topic, draft a detailed explanation.
* If someone reports an error in the educational content, label as "Correction" and draft a reply thanking them.
* Mark comments with study questions as "Study Question".
* If someone asks for recommended reading, reply with a list of books or articles on the topic.
* Mark comments from educators as "Educator".
* If someone asks about certification or courses, reply with information about your courses or recommendations.
* Mark comments with success stories as "Success Story" and heart them.
* If someone asks about prerequisites, draft a reply explaining what knowledge is needed before watching.
* Mark comments requesting specific topics as "Topic Request".`,
  },
  gamingChannel: {
    label: '🎮 Gaming Channel',
    prompt: `${common}
* Mark comments asking about my gaming setup as "Setup Question" and reply with my PC/console specifications.
* If someone asks for gaming tips, draft a helpful reply with specific strategies.
* Mark comments about game updates as "Game Update".
* If someone reports a bug in the game, label as "Bug Report".
* Mark comments from fellow gamers as "Gamer".
* If someone asks about my game settings, reply with my current configuration.
* Mark comments requesting specific games as "Game Request".
* If someone asks about my gaming schedule, reply with my streaming times.
* Mark comments with gameplay suggestions as "Gameplay Suggestion".
* If someone asks about joining multiplayer sessions, reply with information about community game nights.`,
  },
  techReviewer: {
    label: '💻 Tech Reviewer',
    prompt: `${common}
* Mark comments asking for product comparisons as "Comparison Request".
* If someone asks about pricing, reply with current pricing information and any known discounts.
* Mark comments reporting different experiences with reviewed products as "User Experience".
* If someone asks for buying advice, draft a reply with personalized recommendations based on their needs.
* Mark comments with technical specifications questions as "Specs Question".
* If someone reports a factual error in the review, label as "Correction" and verify the information.
* Mark comments asking about alternatives as "Alternative Request".
* If someone asks about durability or long-term use, reply with any follow-up experience you've had.
* Mark comments with purchase decision updates as "Purchase Decision" and heart them.
* If someone asks about upcoming reviews, reply with your content schedule if available.`,
  },
  fitnessChannel: {
    label: '💪 Fitness Channel',
    prompt: `${common}
* Mark comments with progress updates as "Progress" and heart them.
* If someone asks about modifications for exercises, draft a reply with alternative movements.
* Mark comments asking about nutrition as "Nutrition Question".
* If someone reports pain or discomfort, reply advising them to consult a healthcare professional.
* Mark comments asking about workout frequency as "Frequency Question".
* If someone asks about equipment substitutions, draft a reply with household alternatives.
* Mark comments with form questions as "Form Question".
* If someone asks about your fitness journey, reply with a brief summary of your experience.
* Mark comments requesting specific workout types as "Workout Request".
* If someone asks about supplements, reply with general information but advise consulting professionals.`,
  },
  cookingChannel: {
    label: '🍳 Cooking Channel',
    prompt: `${common}
* Mark comments with recipe modifications as "Recipe Mod" and heart them.
* If someone asks about ingredient substitutions, draft a reply with alternatives.
* Mark comments with cooking results as "Cooking Result" and heart them.
* If someone reports recipe issues, label as "Recipe Issue" and verify the instructions.
* Mark comments asking about kitchen equipment as "Equipment Question".
* If someone asks about nutritional information, reply with approximate values if available.
* Mark comments requesting specific recipes as "Recipe Request".
* If someone asks about food storage, reply with proper storage guidelines.
* Mark comments with technique questions as "Technique Question".
* If someone asks about ingredient sourcing, reply with suggestions on where to find items.`,
  },
  musicChannel: {
    label: '🎵 Music Channel',
    prompt: `${common}
* Mark comments requesting song tutorials as "Tutorial Request".
* If someone asks about my instruments or equipment, reply with my current setup.
* Mark comments with cover suggestions as "Cover Request".
* If someone asks about music theory, draft an informative reply explaining the concept.
* Mark comments with performance feedback as "Performance Feedback".
* If someone asks about sheet music or tabs, reply with links if available.
* Mark comments asking about my musical influences as "Influence Question".
* If someone asks about production techniques, reply with an overview of your process.
* Mark comments requesting collaborations as "Collab Request".
* If someone asks about learning resources, reply with recommended books, courses, or videos.`,
  },
  travelChannel: {
    label: '✈️ Travel Channel',
    prompt: `${common}
* Mark comments asking about travel costs as "Budget Question".
* If someone asks about accommodations, reply with details about where you stayed.
* Mark comments asking about local transportation as "Transport Question".
* If someone asks about travel safety, reply with your experience and general safety tips.
* Mark comments requesting specific destinations as "Destination Request".
* If someone asks about travel gear, reply with your packing essentials.
* Mark comments with their own travel stories as "Travel Story" and heart them.
* If someone asks about visa requirements, advise checking official government websites for current information.
* Mark comments asking about food recommendations as "Food Question".
* If someone asks about language barriers, reply with your experience and communication tips.`,
  },
  beautyChannel: {
    label: '💄 Beauty Channel',
    prompt: `${common}
* Mark comments asking about product ingredients as "Ingredient Question".
* If someone asks about product dupes, reply with affordable alternatives if known.
* Mark comments with product results as "Product Result" and heart them.
* If someone reports skin reactions, advise discontinuing use and consulting a dermatologist.
* Mark comments requesting specific tutorials as "Tutorial Request".
* If someone asks about your skincare routine, reply with your current regimen.
* Mark comments asking about product pricing as "Price Question".
* If someone asks about cruelty-free or vegan options, reply with ethical alternatives.
* Mark comments with technique questions as "Technique Question".
* If someone asks about products for specific skin/hair types, draft a personalized recommendation.`,
  },
  newsCommentator: {
    label: '📰 News Commentator',
    prompt: `${common}
* Mark comments with additional sources as "Source" and pin them if valuable.
* If someone asks for clarification on facts, reply with verified information and sources.
* Mark comments with different perspectives as "Perspective".
* If someone reports factual errors, label as "Fact Check" and verify the information.
* Mark comments with topic suggestions as "Topic Suggestion".
* If someone asks about your political stance, reply that you aim to present balanced information.
* Mark comments with personal experiences related to news topics as "Personal Account".
* If someone asks for more in-depth analysis, reply with additional context or direct to longer-form content.
* Mark comments with breaking news updates as "News Update".
* If someone asks about your research process, reply with an overview of how you verify information.`,
  },
  other: {
    label: '🤖 Other',
    prompt: common,
  },
};
