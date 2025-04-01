'use server';

import {
  PROJECT_GENERATOR_MESSAGE,
  PROJECT_IMPROVER_MESSAGE,
  RESUME_IMPORTER_SYSTEM_MESSAGE,
  TEXT_ANALYZER_SYSTEM_MESSAGE,
  WORK_EXPERIENCE_GENERATOR_MESSAGE,
  WORK_EXPERIENCE_IMPROVER_MESSAGE,
} from '@/lib/prompts';
import { sanitizeUnknownStrings } from '@/lib/utils';
import {
  type Job,
  projectAnalysisSchema,
  resumeScoreSchema,
  simplifiedJobSchema,
  simplifiedResumeSchema,
  textImportSchema,
  workExperienceBulletPointsSchema,
  workExperienceItemsSchema,
} from '@/lib/zod-schemas';
import type { Resume, WorkExperience } from '@/types';
import { createStreamableValue, openai } from '@repo/ai';
import { streamText } from '@repo/ai';
import { chatCompletionObject } from '@repo/ai/llms';
import { z } from 'zod';

// TEXT RESUME -> PROFILE
export async function formatProfileWithAI(
  userMessages: string,
  userEmail: string
) {
  try {
    const { object } = await chatCompletionObject({
      userAi: {
        aiProvider: 'openai',
        aiModel: 'gpt-4o-mini',
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        aiApiKey: process.env.OPENAI_API_KEY!,
      },
      schema: z.object({
        content: z.object({
          firstName: z.string(),
          lastName: z.string(),
          email: z.string(),
          phoneNumber: z.string(),
          location: z.string(),
          websiteUrl: z.string(),
          linkedinUrl: z.string(),
          githubUrl: z.string(),
          workExperience: z.array(
            z.object({
              company: z.string(),
              position: z.string(),
              location: z.string(),
              date: z.string().optional(),
              description: z.array(z.string()),
              technologies: z.array(z.string()).optional(),
            })
          ),
          education: z.array(
            z.object({
              school: z.string(),
              degree: z.string(),
              field: z.string(),
              location: z.string().optional(),
              date: z.string(),
              gpa: z.number().optional(),
              achievements: z.array(z.string()).optional(),
            })
          ),
          skills: z
            .array(
              z.object({
                category: z.string(),
                items: z.array(z.string()),
              })
            )
            .optional(),
          projects: z
            .array(
              z.object({
                name: z.string(),
                description: z.array(z.string()),
                date: z.string().optional(),
                technologies: z.array(z.string()).optional(),
                url: z.string().optional(),
                github_url: z.string().optional(),
              })
            )
            .optional(),
        }),
      }),
      prompt: `Please analyze this resume text and extract all relevant information into a structured profile format. 
                Include all sections (personal info, work experience, education, skills, projects) if present.
                Ensure all arrays (like description, technologies, achievements) are properly formatted as arrays.
                For any missing or unclear information, use optional fields rather than making assumptions.
  
                Resume Text:
  ${userMessages}`,
      system: RESUME_IMPORTER_SYSTEM_MESSAGE.content as string,
      userEmail,
      usageLabel: 'formatProfileWithAI',
    });

    return sanitizeUnknownStrings(object);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Base Resume Creation
// TEXT CONTENT -> RESUME
export async function convertTextToResume(
  prompt: string,
  existingResume: Resume,
  targetRole: string,
  userEmail: string
) {
  const { object } = await chatCompletionObject({
    userAi: {
      aiProvider: 'openai',
      aiModel: 'gpt-4o-mini',
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      aiApiKey: process.env.OPENAI_API_KEY!,
    },
    schema: z.object({
      content: textImportSchema,
    }),
    system: `You are ResumeFormatter, an expert system specialized in analyzing complete resumes and converting them into a structured JSON object tailored for targeted job applications.

        Your task is to transform the complete resume text into a JSON object according to the provided schema. You will identify and extract the most relevant experiences, skills, projects, and educational background based on the target role. While doing so, you are allowed to make minimal formatting changes only to enhance clarity and highlight relevance—**do not reword, summarize, or alter the core details of any content.**

        CRITICAL DIRECTIVES:
        1. **Analysis & Selection:**
          - Analyze the full resume text that includes all user experiences, skills, projects, and education.
          - Identify the items that best match the target role: ${targetRole}.
          - Always include the education section:
            - If only one educational entry exists, include it.
            - If multiple entries exist, select the one(s) most relevant to the target role.

        2. **Formatting & Emphasis:**
          - Transform the resume into a JSON object following the schema, with sections such as basic information, professional experience, projects, skills, and education.
          - Preserve all original details, dates, and descriptions. Only modify the text for formatting purposes.
          - **Enhance relevance by marking keywords** within work experience descriptions, project details, achievements, and education details with bold formatting (i.e., wrap them with two asterisks like **this**). Apply this only to keywords or phrases that are highly relevant to the target role.
          - Do not add any formatting to section titles or headers.
          - Use empty arrays ([]) for any sections that do not contain relevant items.

        3. **Output Requirements:**
          - The final output must be a valid JSON object that adheres to the specified schema.
          - Include only the most relevant items, optimized for the target role.
          - Do not add any new information or rephrase the provided content—only apply minor formatting (like bolding) to emphasize key points.`,
    prompt: `INPUT:
    Extract and transform the resume information from the following text:
    ${prompt}
    Now, format this information into the JSON object according to the schema, ensuring it is optimized for the target role: ${targetRole}.
        `,
    userEmail,
    usageLabel: 'convertTextToResume',
  });

  const updatedResume = {
    ...existingResume,
    ...(object.content.firstName && { firstName: object.content.firstName }),
    ...(object.content.lastName && { lastName: object.content.lastName }),
    ...(object.content.email && { email: object.content.email }),
    ...(object.content.phoneNumber && {
      phoneNumber: object.content.phoneNumber,
    }),
    ...(object.content.location && { location: object.content.location }),
    ...(object.content.websiteUrl && { websiteUrl: object.content.websiteUrl }),
    ...(object.content.linkedinUrl && {
      linkedinUrl: object.content.linkedinUrl,
    }),
    ...(object.content.githubUrl && { githubUrl: object.content.githubUrl }),

    workExperience: [
      ...existingResume.workExperience,
      ...(object.content.workExperience || []),
    ],
    education: [
      ...existingResume.education,
      ...(object.content.education || []),
    ],
    skills: [...existingResume.skills, ...(object.content.skills || [])],
    projects: [...existingResume.projects, ...(object.content.projects || [])],
  };

  return updatedResume;
}

// ADDING TEXT CONTENT TO RESUME
export async function addTextToResume(
  prompt: string,
  existingResume: Resume,
  userEmail: string
) {
  const { object } = await chatCompletionObject({
    userAi: {
      aiProvider: 'openai',
      aiModel: 'gpt-4o-mini',
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      aiApiKey: process.env.OPENAI_API_KEY!,
    },
    schema: z.object({
      content: textImportSchema,
    }),
    prompt: `Extract relevant resume information from the following text, including basic information (name, contact details, etc) and professional experience. Format them according to the schema:\n\n${prompt}`,
    system: TEXT_ANALYZER_SYSTEM_MESSAGE.content as string,
    userEmail,
    usageLabel: 'addTextToResume',
  });

  const updatedResume = {
    ...existingResume,
    ...(object.content.firstName && { firstName: object.content.firstName }),
    ...(object.content.lastName && { lastName: object.content.lastName }),
    ...(object.content.email && { email: object.content.email }),
    ...(object.content.phoneNumber && {
      phoneNumber: object.content.phoneNumber,
    }),
    ...(object.content.location && { location: object.content.location }),
    ...(object.content.websiteUrl && { websiteUrl: object.content.websiteUrl }),
    ...(object.content.linkedinUrl && {
      linkedinUrl: object.content.linkedinUrl,
    }),
    ...(object.content.githubUrl && { githubUrl: object.content.githubUrl }),

    workExperience: [
      ...existingResume.workExperience,
      ...(object.content.workExperience || []),
    ],
    education: [
      ...existingResume.education,
      ...(object.content.education || []),
    ],
    skills: [...existingResume.skills, ...(object.content.skills || [])],
    projects: [...existingResume.projects, ...(object.content.projects || [])],
  };

  return updatedResume;
}

// NEW WORK EXPERIENCE BULLET POINTS
export async function generateWorkExperiencePoints(
  userEmail: string,
  position: string,
  company: string,
  technologies: string[],
  targetRole: string,
  // biome-ignore lint/style/noInferrableTypes: <explanation>
  numPoints: number = 3,
  // biome-ignore lint/style/noInferrableTypes: <explanation>
  customPrompt: string = ''
) {
  const { object } = await chatCompletionObject({
    userAi: {
      aiProvider: 'openai',
      aiModel: 'gpt-4o-mini',
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      aiApiKey: process.env.OPENAI_API_KEY!,
    },
    schema: z.object({
      content: workExperienceBulletPointsSchema,
    }),
    prompt: `Position: ${position}
      Company: ${company}
      Technologies: ${technologies.join(', ')}
      Target Role: ${targetRole}
      Number of Points: ${numPoints}${customPrompt ? `\nCustom Focus: ${customPrompt}` : ''}`,
    system: WORK_EXPERIENCE_GENERATOR_MESSAGE.content as string,
    userEmail,
    usageLabel: 'generateWorkExperiencePoints',
  });

  return object.content;
}

// WORK EXPERIENCE BULLET POINTS IMPROVEMENT
export async function improveWorkExperience(
  userEmail: string,
  point: string,
  customPrompt?: string
) {
  const { object } = await chatCompletionObject({
    userAi: {
      aiProvider: 'openai',
      aiModel: 'gpt-4o-mini',
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      aiApiKey: process.env.OPENAI_API_KEY!,
    },
    schema: z.object({
      content: z.string().describe('The improved work experience bullet point'),
    }),
    prompt: `Please improve this work experience bullet point while maintaining its core message and truthfulness${customPrompt ? `. Additional requirements: ${customPrompt}` : ''}:\n\n"${point}"`,
    system: WORK_EXPERIENCE_IMPROVER_MESSAGE.content as string,
    userEmail,
    usageLabel: 'improveWorkExperience',
  });

  return object.content;
}

// PROJECT BULLET POINTS IMPROVEMENT
export async function improveProject(
  userEmail: string,
  point: string,
  customPrompt?: string
) {
  const { object } = await chatCompletionObject({
    userAi: {
      aiProvider: 'openai',
      aiModel: 'gpt-4o-mini',
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      aiApiKey: process.env.OPENAI_API_KEY!,
    },
    schema: z.object({
      content: z.string().describe('The improved project bullet point'),
    }),
    prompt: `Please improve this project bullet point while maintaining its core message and truthfulness${customPrompt ? `. Additional requirements: ${customPrompt}` : ''}:\n\n"${point}"`,
    system: PROJECT_IMPROVER_MESSAGE.content as string,
    userEmail,
    usageLabel: 'improveProject',
  });

  return object.content;
}

// NEW PROJECT BULLET POINTS
export async function generateProjectPoints(
  userEmail: string,
  projectName: string,
  technologies: string[],
  targetRole: string,
  // biome-ignore lint/style/noInferrableTypes: <explanation>
  numPoints: number = 3,
  // biome-ignore lint/style/noInferrableTypes: <explanation>
  customPrompt: string = ''
) {
  const { object } = await chatCompletionObject({
    userAi: {
      aiProvider: 'openai',
      aiModel: 'gpt-4o-mini',
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      aiApiKey: process.env.OPENAI_API_KEY!,
    },
    schema: z.object({
      content: projectAnalysisSchema,
    }),
    prompt: `Project Name: ${projectName}
      Technologies: ${technologies.join(', ')}
      Target Role: ${targetRole}
      Number of Points: ${numPoints}${customPrompt ? `\nCustom Focus: ${customPrompt}` : ''}`,
    system: PROJECT_GENERATOR_MESSAGE.content as string,
    userEmail,
    usageLabel: 'generateProjectPoints',
  });

  return object.content;
}

// Text import for profile
export async function processTextImport(userEmail: string, text: string) {
  const { object } = await chatCompletionObject({
    userAi: {
      aiProvider: 'openai',
      aiModel: 'gpt-4o-mini',
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      aiApiKey: process.env.OPENAI_API_KEY!,
    },
    schema: z.object({
      content: textImportSchema,
    }),
    prompt: text,
    system: TEXT_ANALYZER_SYSTEM_MESSAGE.content as string,
    userEmail,
    usageLabel: 'processTextImport',
  });

  return object.content;
}

// WORK EXPERIENCE MODIFICATION
export async function modifyWorkExperience(
  userEmail: string,
  experience: WorkExperience[],
  prompt: string
) {
  const { object } = await chatCompletionObject({
    userAi: {
      aiProvider: 'openai',
      aiModel: 'gpt-4o-mini',
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      aiApiKey: process.env.OPENAI_API_KEY!,
    },
    schema: z.object({
      content: workExperienceItemsSchema,
    }),
    prompt: `Please modify this work experience entry according to these instructions: ${prompt}\n\nCurrent work experience:\n${JSON.stringify(experience, null, 2)}`,
    system: `You are a professional resume writer. Modify the given work experience based on the user's instructions. 
          Maintain professionalism and accuracy while implementing the requested changes. 
          Keep the same company and dates, but modify other fields as requested.
          Use strong action verbs and quantifiable achievements where possible.`,
    userEmail,
    usageLabel: 'modifyWorkExperience',
  });

  return object.content;
}

export async function generateResumeScore(userEmail: string, resume: Resume) {
  try {
    const { object } = await chatCompletionObject({
      userAi: {
        aiProvider: 'openai',
        aiModel: 'gpt-4o-mini',
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        aiApiKey: process.env.OPENAI_API_KEY!,
      },
      schema: resumeScoreSchema,
      prompt: `
      Generate a score for this resume: ${JSON.stringify(resume)}
      MUST include a 'miscellaneous' field with 2-3 metrics following this format:
      {
        "metricName": {
          "score": number,
          "reason": "string explanation"
        }
      }
      Example: 
      "keywordOptimization": {
        "score": 85,
        "reason": "Good use of industry keywords but could add more variation"
      }
      `,
      userEmail,
      usageLabel: 'generateResumeScore',
    });

    return object;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function formatJobListing(userEmail: string, jobListing: string) {
  try {
    const { object } = await chatCompletionObject({
      userAi: {
        aiProvider: 'openai',
        aiModel: 'gpt-4o-mini',
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        aiApiKey: process.env.OPENAI_API_KEY!,
      },
      schema: z.object({
        content: simplifiedJobSchema,
      }),
      system: `You are an AI assistant specializing in structured data extraction from job listings. You have been provided with a schema
              and must adhere to it strictly. When processing the given job listing, follow these steps:
              IMPORTANT: For any missing or uncertain information, you must return an empty string ("") - never return "<UNKNOWN>" or similar placeholders.

            Read the entire job listing thoroughly to understand context, responsibilities, requirements, and any other relevant details.
            Perform the analysis as described in each TASK below.
            Return your final output in a structured format (e.g., JSON or the prescribed schema), using the exact field names you have been given.
            Do not guess or fabricate information that is not present in the listing; instead, return an empty string for missing fields.
            Do not include chain-of-thought or intermediate reasoning in the final output; provide only the structured results.
            
            For the description field:
            1. Start with 3-5 bullet points highlighting the most important responsibilities of the role.
               - Format these bullet points using markdown, with each point on a new line starting with "• "
               - These should be the most critical duties mentioned in the job listing
            2. After the bullet points, include the full job description stripped of:
               - Any non-job-related content
            3. Format the full description as a clean paragraph, maintaining proper grammar and flow.`,
      prompt: `Analyze this job listing carefully and extract structured information.

              TASK 1 - ESSENTIAL INFORMATION:
              Extract the basic details (company, position, URL, location, salary).
              For the description, include 3-5 key responsibilities as bullet points.

              TASK 2 - KEYWORD ANALYSIS:
              1. Technical Skills: Identify all technical skills, programming languages, frameworks, and tools
              2. Soft Skills: Extract interpersonal and professional competencies
              3. Industry Knowledge: Capture domain-specific knowledge requirements
              4. Required Qualifications: List education, and experience levels
              5. Responsibilities: Key job functions and deliverables

              Format the output according to the schema, ensuring:
              - Keywords as they are (e.g., "React.js" → "React.js")
              - Skills are deduplicated and categorized
              - Seniority level is inferred from context
              - Description contains 3-5 bullet points of key responsibilities
              Usage Notes:

              - If certain details (like salary or location) are missing, return "" (an empty string).
              - Adhere to the schema you have been provided, and format your response accordingly (e.g., JSON fields must match exactly).
              - Avoid exposing your internal reasoning.
              - DO NOT RETURN "<UNKNOWN>", if you are unsure of a piece of data, return an empty string.
              - FORMAT THE FOLLOWING JOB LISTING AS A JSON OBJECT: ${jobListing}`,
      userEmail,
      usageLabel: 'formatJobListing',
    });

    const content = object.content;

    return {
      ...content,
      workLocation: content.workLocation as
        | 'remote'
        | 'in_person'
        | 'hybrid'
        | null
        | undefined,
      employmentType: content.employmentType as
        | 'full_time'
        | 'part_time'
        | 'co_op'
        | 'internship'
        | 'contract'
        | undefined,
    } satisfies Partial<Job>;
  } catch (error) {
    console.error('Error formatting job listing:', error);
    throw error;
  }
}

export async function tailorResumeToJob(
  userEmail: string,
  resume: Resume,
  jobListing: z.infer<typeof simplifiedJobSchema>
) {
  try {
    const { object } = await chatCompletionObject({
      userAi: {
        aiProvider: 'openai',
        aiModel: 'gpt-4o-mini',
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        aiApiKey: process.env.OPENAI_API_KEY!,
      },
      schema: z.object({
        content: simplifiedResumeSchema,
      }),
      system: `

You are Open Studio Resume, an advanced AI resume transformer that specializes in optimizing technical resumes for software engineering roles using machine-learning-driven ATS strategies. Your mission is to transform the provided resume into a highly targeted, ATS-friendly document that precisely aligns with the job description.

**Core Objectives:**

1. **Integrate Job-Specific Terminology & Reorder Content:**  
   - Replace generic descriptions with precise, job-specific technical terms drawn from the job description (e.g., "Generative AI," "Agentic AI," "LLMOps," "Azure OpenAI," "Azure Machine Learning Studio," etc.).
   - Reorder or emphasize sections and bullet points to prioritize experiences that most closely match the role's requirements.
   - Use strong, active language that mirrors the job description's vocabulary and focus.
   - Ensure all modifications are strictly based on the resume's original data—never invent new tools, versions, or experiences.

2. **STAR Framework for Technical Storytelling:**  
   For every bullet point describing work experience, structure the content as follows (using reasonable assumptions when needed without hallucinating details):
   - **Situation:** Briefly set the technical or business context (e.g., "During a cloud migration initiative…" or "When addressing the need for advanced generative AI solutions…").
   - **Task:** Define the specific responsibility or challenge aligned with the job's requirements (e.g., "To design and implement scalable AI models using Azure OpenAI…").
   - **Action:** Describe the technical actions taken, using job-specific verbs and detailed technology stack information (e.g., "Leveraged containerization with Docker and orchestrated microservices via Kubernetes to deploy models in a secure, scalable environment").
   - **Result:** Quantify the impact with clear, job-relevant metrics (e.g., "Achieved a 3.2x throughput increase" or "Reduced processing time by 80%").

3. **Enhanced Technical Detailing:**  
   - Convert simple technology lists into detailed, hierarchical representations that include versions and relevant frameworks (e.g., "Python → Python 3.10 (NumPy, PyTorch 2.0, FastAPI)").
   - Enrich work experience descriptions with architectural context and measurable performance metrics (e.g., "Designed event-driven microservices handling 25k RPS").
   - Use internal annotations (e.g., [JD: ...]) during processing solely as references. These annotations must be completely removed from the final output.

4. **Strict Transformation Constraints:**  
   - Preserve the original employment chronology and all factual details.
   - Maintain a 1:1 mapping between the job description requirements and the resume content.
   - If a direct match is missing, map the resume content to a relevant job description concept (e.g., "Legacy system modernization" → "Cloud migration patterns").
   - Every claim of improvement must be supported with a concrete, quantifiable metric.
   - Eliminate all internal transformation annotations (e.g., [JD: ...]) from the final output.

**Your Task:**  
Transform the resume according to these principles, ensuring the final output is a polished, ATS-optimized document that accurately reflects the candidate's technical expertise and directly addresses the job description—without any internal annotations.


    `,
      prompt: `
    This is the Resume:
    ${JSON.stringify(resume, null, 2)}
    
    This is the Job Description:
    ${JSON.stringify(jobListing, null, 2)}
    `,
      userEmail,
      usageLabel: 'tailorResumeToJob',
    });

    return object.content satisfies z.infer<typeof simplifiedResumeSchema>;
  } catch (error) {
    console.error('Error tailoring resume:', error);
    throw error;
  }
}

export async function generateCoverLetter(userEmail: string, input: string) {
  const stream = createStreamableValue('');
  try {
    const system = `
   
   You are a professional cover letter writer with expertise in crafting compelling, personalized cover letters. Your goal is to produce a cover letter that is clear, concise, and tailored to the job and candidate data provided. The final cover letter should be between 600-700 words and written in a consistent, professional tone that seamlessly blends technical details with personal enthusiasm.

   Focus on:
   - Clear, concise, and professional writing.
   - Highlighting relevant experience with unique insights in each section.
   - Matching the candidate’s qualifications to the job requirements.
   - Maintaining authenticity by using only the information available in the job or resume data.
   - Enforcing the target word count without omitting key details.
   - **Distinctly separating each section as its own paragraph** — output each paragraph with exactly one <br /> tag at the end, with no extra spacing or additional line breaks.

   Ensure your output is in HTML format (do NOT start with HTML tags) and strictly follow these formatting rules:

   CRITICAL FORMATTING REQUIREMENTS – YOU MUST FOLLOW THESE EXACTLY:
   1. Do NOT use any square brackets [] in the output.
   2. Only include information that is available in the job or resume data.
   3. Each piece of information MUST be on its own separate line using <br /> tags.
   4. Use actual values directly, not placeholders.
   5. Format the header EXACTLY like this (but without the brackets, using real data):

      <p>
      [Date]<br />
      [Company Name]<br />
      [Company Address]<br />
      [City, Province/State, Country]<br />
      </p>
      - If certain data (like company address) is missing, adjust the header accordingly without leaving placeholders.
   6. Format the signature EXACTLY like this (but without the brackets, using real data):
      <p>
      Sincerely,<br /><br />
      [Full Name]<br />
      </p>
      
      <p>
      [Email Address]<br />
      [Phone Number]<br />
      [LinkedIn URL]<br />
      </p>
   7. NEVER combine multiple pieces of information on the same line; ALWAYS use <br /> tags between each piece.
   8. Add an extra <br /> after the date and after "Sincerely,".

   Divide the cover letter into the following sections, ensuring **each section is output as a separate paragraph** (use <p> tags or <br /> for clear breaks):

   1. **Opening Paragraph:**  
      Start with a strong hook that demonstrates your understanding of the company's mission and challenges. Express genuine enthusiasm for the position and how it aligns with your career goals. Mention any personal connection to the company or industry. (4-5 sentences)

   2. **Value Proposition Paragraph:**  
      Clearly articulate what makes you uniquely qualified for the role. Highlight 2-3 key achievements that demonstrate your ability to deliver results in similar positions. Use metrics and specific outcomes where possible. (5-6 sentences)  
      *Ensure this section provides unique insights without repeating content from other sections.*

   3. **Technical Expertise Paragraph:**  
      Detail your relevant technical skills and tools, focusing on those mentioned in the job description. Provide concrete examples of projects where you successfully applied these skills. (5-6 sentences)  
      *Maintain a consistent professional tone while describing technical details.*

   4. **Leadership & Collaboration Paragraph:**  
      Showcase your ability to work in teams and lead projects. Provide examples of successful collaborations, cross-functional initiatives, or mentorship experiences. Highlight soft skills like communication and problem-solving. (4-5 sentences)

   5. **Company-Specific Contribution Paragraph:**  
      Demonstrate your understanding of the company's current initiatives and challenges. Propose specific ways you could contribute to their success based on your experience and skills. (4-5 sentences)

   6. **Closing Paragraph:**  
      Reiterate your enthusiasm for the role and the value you would bring. Mention your availability for an interview and include a call to action. (3-4 sentences)

   Additional Guidelines:
   - Ensure each paragraph offers unique insights and does not repeat content from other sections.
   - Maintain a consistent, professional tone throughout the letter.
   - Use only the information provided in the job and resume data; do not introduce unsupported details.
   - **Each section must be distinctly separated from the others. Do not output the cover letter as one continuous block.**
   - If any data fields (like company address or LinkedIn URL) are missing, adjust the output accordingly without leaving placeholders.

   Generate the cover letter as specified above, ensuring that each section is clearly separated into distinct paragraphs.
   `;

    (async () => {
      const { textStream } = streamText({
        model: openai('gpt-4o-mini'),
        system,
        prompt: input,
        onFinish: ({ usage }) => {
          const { promptTokens, completionTokens, totalTokens } = usage;

          // your own logic, e.g. for saving the chat history or recording usage
          console.log('----------Usage:----------');
          console.log('Prompt tokens:', promptTokens);
          console.log('Completion tokens:', completionTokens);
          console.log('Total tokens:', totalTokens);
        },
      });

      for await (const delta of textStream) {
        stream.update(delta);
      }

      stream.done();
    })();

    return { output: stream.value };
  } catch (error) {
    console.error('Error generating cover letter:', error);
    throw error;
  }
}
