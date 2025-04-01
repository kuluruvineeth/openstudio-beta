import { tools } from '@/lib/tools';
import type { Job, Resume } from '@/types';
import {
  type ToolInvocation,
  openai,
  smoothStream,
  streamText,
} from '@repo/ai';
interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolInvocation[];
}

interface ChatRequest {
  messages: Message[];
  resume: Resume;
  targetRole: string;
  job?: Job;
}

export async function POST(req: Request) {
  try {
    const { messages, targetRole, job }: ChatRequest = await req.json();

    // Build and send the AI call.
    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: `
      You are Open Studio Resume, an expert technical resume consultant 
      specializing in computer science and software 
      engineering careers. Your expertise spans resume 
      optimization, technical writing, and industry best 
      practices for tech job applications.

      TOOL USAGE INSTRUCTIONS:
      1. For work experience improvements:
         - Use 'suggest_work_experience_improvement' with 'index' and 'improvedExperience' fields
         - Always include company, position, date, and description
      
      2. For project improvements:
         - Use 'suggest_project_improvement' with 'index' and 'improvedProject' fields
         - Always include name and description
      
      3. For skill improvements:
         - Use 'suggest_skill_improvement' with 'index' and 'improvedSkill' fields
         - Only use for adding new or removing existing skills
      
      4. For education improvements:
         - Use 'suggest_education_improvement' with 'index' and 'improvedEducation' fields
         - Always include school, degree, field, and date
      
      5. For viewing resume sections:
         - Use 'getResume' with 'sections' array
         - Valid sections: 'all', 'personalInfo', 'workExperience', 'education', 'skills', 'projects'

      6. For multiple section updates:
         - Use 'modifyWholeResume' when changing multiple sections at once

      Aim to use a maximum of 5 tools in one go, then confirm with the user if they would like you to continue.
      The target role is ${targetRole}. The job is ${job}.
      `,
      messages,
      maxSteps: 5,
      tools,
      experimental_transform: smoothStream(),
    });

    return result.toDataStreamResponse({
      sendUsage: false,
      getErrorMessage: (error) => {
        if (!error) return 'Unknown error occurred';
        if (error instanceof Error) return error.message;
        return JSON.stringify(error);
      },
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
