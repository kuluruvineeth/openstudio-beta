import { generateObject, openai } from '@repo/ai';
import { database } from '@repo/backend/database';
import { videos } from '@repo/backend/schema';
import { schemaTask } from '@trigger.dev/sdk/v3';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

export const YOUTUBE_DESCRIPTION_PROMPT = `
Your task is to create an SEO-optimized YouTube video description based on the provided transcript or reference content. The description should be engaging, concise, and formatted for readability and viewer interaction. Tailor the description to the video's context, including only relevant elements (e.g., timestamps for long videos, GitHub links for coding tutorials, CTAs for engagement).

Follow these instructions to craft a description that enhances visibility and encourages engagement:

---

### Instructions

1. *Format for Readability*:
   - Use strict formatting rules (these are non-negotiable requirements):
     - CRITICAL: Use SINGLE asterisk (*) for section headers, for making text bold. Example: "*Features*"
       ❌ NEVER use double asterisks (**)
       ❌ NEVER use other formatting for headers
     - CRITICAL: Use single hyphen (-) for bullet points. Example:
       - First bullet point
       - Second bullet point
       ❌ NEVER use other characters for bullet points
   - Keep paragraphs short with line breaks for easy scanning.

2. *Analyze the Content*:
   - Identify the main topic (e.g., "Building a Chatbot," "Travel Vlog," "Product Update").
   - Extract 1-3 primary keywords relevant to the video (e.g., "AI Chatbot," "Travel Tips," "New Features").
   - Determine the video type and context:
     - *Long videos* (>10 minutes or with clear sections): Include timestamps.
     - *Coding-related videos* (e.g., tutorials, tech demos): Include GitHub links, code references, or other technical resources.
     - *Updates or announcements*: Highlight new features, changes, or links to relevant pages.
     - *Lifestyle or vlogs*: Focus on narrative and engagement, avoiding technical elements like timestamps or GitHub links.

3. *Write a Compelling Summary*:
   - Create a concise, keyword-rich summary (within 150 characters) to hook viewers (e.g., "🤖 Build an AI Chatbot with Next.js! 🚀").
   - Reflect the video's tone and purpose (e.g., technical, casual, informative).

4. *Integrate Keywords*:
   - Naturally weave the primary keywords throughout the description for SEO, avoiding overuse.

5. *Include Timestamps (if applicable)*:
   - *Only for long videos* (>10 minutes or with clear sections):
     - List key moments (e.g., "0:00 - Introduction," "5:00 - Setup").
     - Estimate timestamps based on content structure if exact times aren't provided.

6. *Add Links and References (if relevant)*:
   - *Only for coding-related videos*:
     - Include GitHub links or project URLs (e.g., "🔗 GitHub: https://github.com/user/repo").
     - Optionally include links to documentation, tools, or resources mentioned in the video.
   - For updates or announcements:
     - Include relevant links (e.g., "Upgrade now: https://app.example.com").
   - For other video types (e.g., vlogs, lifestyle):
     - Avoid technical links unless explicitly relevant.

7. *Use Emojis Sparingly*:
   - Include 1-2 relevant emojis (e.g., 🚀 for progress, 🌍 for travel) if they fit the tone and audience.
   - Avoid overuse, especially for technical or professional videos.

8. *Include Hashtags*:
   - Add 3-5 searchable hashtags at the end (e.g., #AI #TravelVlog #ProductUpdate) based on the video's topic.

9. *Add a Call to Action*:
   - Include a friendly CTA (e.g., "Like and subscribe for more!" or "Comment your thoughts below!").
   - Tailor the CTA to the video type (e.g., "Fork the repo and share your tweaks!" for coding videos).

10. *Check Length and Accuracy*:
    - Ensure the description is between 200-2,000 characters, with critical info in the first 100-150 characters.
    - Verify it accurately reflects the video content and excludes irrelevant elements (e.g., no timestamps for short vlogs, no GitHub links for non-coding videos).

---

### Output Requirements
- Return the description as plain text with structured formatting.
- Dynamically include or exclude elements like timestamps, links, or CTAs based on the video's context.
- Ensure it's engaging, SEO-optimized, and tailored to the video's audience.

---

### Example Outputs  

#### *1. Coding Tutorial (AI Chat Platform)*  

🤖 *Build Your Own AI Chat Platform! | Next.js, OpenAI, Gemini, Claude, LangChain* 🚀  

Learn how to create a *multi-model AI chatbot* from scratch! In this tutorial, we'll integrate OpenAI, Gemini, and Claude into a custom chat application using *Next.js, React, TypeScript, and Tailwind CSS*.  

*🔥 Features Covered:*  
- ✅ Multi-Model Chat: Use OpenAI, Gemini, Claude, and even local models! 🔄  
- ✅ Custom AI Assistants: Train AI to handle specific tasks 🦸‍♂️  
- ✅ Prompt Library: Save and reuse custom prompts 📚  
- ✅ Realtime Streaming: Get instant AI responses 💬  
- ✅ Dark Mode & Responsive UI 🌙  

*💻 Tech Stack:*  
- 🌐 Next.js & React  
- ⚡ TypeScript & Tailwind CSS  
- 🤖 OpenAI, Gemini, Claude APIs  
- ⛓️ LangChain for AI pipeline  

🔗 *GitHub Repo:* https://github.com/user/repo  

⏰ *Timestamps:*  
- 0:00 - Introduction  
- 5:45 - Setting Up Next.js & API Keys  
- 12:30 - Implementing AI Model Switching  
- 25:15 - Creating Custom AI Assistants  

👉 *Like, share & subscribe for more AI projects!* 💡  

#AI #Chatbot #NextJS #OpenAI #TypeScript  

#### *2. Product Update (Software Release)*  

🚀 *New Features in Open Studio ChatHub! | AI Models, Subscription Plans & More!*  

*🔥 What’s New:*  
- 🧠 *New AI Models:* GroK’s GR2, GR2 Vision & Perplexity’s Sonar  
- 📌 *Free Plan:* 100 messages/month, bring your own API key  
- ⚡ *Pro Plan:* 500 messages/month, no API key needed, early access  
- 💎 *Lifetime Access:* Unlimited messages & exclusive features  

🔗 *Upgrade Now & Be Part of Open Studio’s Future!* 👉 https://app.openstudio.tech  

*💡 Follow for More Updates:*  
- Twitter (X): https://x.com/user  
- LinkedIn: https://www.linkedin.com/in/user  
- Reddit Community: https://www.reddit.com/r/user/  

#AI #Chathub #OpenStudio #Tech  

#### *3. Travel Vlog*  

🌍 *Exploring Bali’s Hidden Gems | Travel Guide & Tips!* ✈️  

Join me on an adventure through *Bali’s most breathtaking spots* – from secret beaches 🏝️ to scenic rice terraces 🌾.  

*📍 Must-Visit Places:*  
- 🏝️ Crystal Bay – Hidden paradise with crystal-clear water  
- 🌋 Mount Batur – Sunrise hike with stunning views  
- 🐬 Lovina Beach – Dolphin watching at sunrise  
- 🌾 Tegalalang – Iconic rice terraces for the perfect photo 📸  

⏰ *Timestamps:*  
- 0:00 - Arrival in Bali  
- 3:45 - Exploring Uluwatu Cliffs  
- 8:15 - Nusa Penida Adventure  
- 14:30 - Sunset at Tanah Lot  

👉 *Like & Subscribe for More Travel Content!* 🚀  

#Bali #TravelVlog #HiddenGems #Adventure

---

### Output Requirements  
- Return the description as *plain text* with *structured formatting*.  
- Dynamically include/exclude elements (timestamps, links, CTAs) based on video context.  
- Ensure content is *engaging, structured, and optimized for searchability*.  
`;

export const generateYoutubeDescription: any = schemaTask({
  id: 'generate-youtube-description',
  schema: z.object({
    videoId: z.string(),
    userId: z.string(),
    organizationId: z.string(),
  }),
  run: async ({ videoId, userId, organizationId }) => {
    console.log('Generating description for video', videoId);

    // Step 1: Get the video

    const [video] = await database
      .select()
      .from(videos)
      .where(
        and(
          eq(videos.id, videoId),
          eq(videos.userId, userId),
          eq(videos.organizationId, organizationId)
        )
      );
    if (!video) {
      throw new Error('Video not found');
    }

    // Step 2: Get the video's transcript
    const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
    const response = await fetch(trackUrl);
    const text = await response.text();

    if (!text) {
      throw new Error('Transcript not found');
    }

    // Step 3: Generate the description
    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        description: z.string().describe('The description of the video'),
      }),
      messages: [
        { role: 'system', content: YOUTUBE_DESCRIPTION_PROMPT },
        { role: 'user', content: text },
      ],
    });

    if (!result.object.description) {
      throw new Error('Description not found');
    }

    // Step 4: Update the video with the new description
    await database
      .update(videos)
      .set({
        description: result.object.description || video.description,
      })
      .where(
        and(
          eq(videos.id, videoId),
          eq(videos.userId, userId),
          eq(videos.organizationId, organizationId)
        )
      );
  },
});
