import { tool as createTool } from '@repo/ai';
import { z } from 'zod';

export const getResumeTool = createTool({
  description:
    'Get the user Resume. Can request specific sections or "all" for the entire resume.',
  parameters: z.object({
    sections: z
      .union([
        z.string(),
        z.array(
          z.enum([
            'all',
            'personalInfo',
            'workExperience',
            'education',
            'skills',
            'projects',
          ])
        ),
      ])
      .transform((val) => (Array.isArray(val) ? val : [val])),
  }),
});

export const suggestWorkExperienceTool = createTool({
  description: 'Suggest improvements for a specific work experience entry',
  parameters: z.object({
    index: z.number().describe('Index of the work experience entry to improve'),
    improvedExperience: z
      .object({
        date: z.string(),
        company: z.string(),
        location: z.string().optional(),
        position: z.string(),
        description: z.array(z.string()),
        technologies: z.array(z.string()).optional(),
      })
      .describe(
        'Improved version of the work experience entry. For important keywords, format them as bold, like this: **keyword**. Put two asterisks around the keyword or phrase.'
      ),
  }),
});

export const suggestProjectTool = createTool({
  description: 'Suggest improvements for a specific project entry',
  parameters: z.object({
    index: z.number().describe('Index of the project entry to improve'),
    improvedProject: z
      .object({
        name: z.string(),
        description: z.array(z.string()),
        date: z.string().optional(),
        technologies: z.array(z.string()).optional(),
        url: z.string().optional(),
        github_url: z.string().optional(),
      })
      .describe(
        'Improved version of the project entry. For important keywords, format them as bold, like this: **keyword**. Put two asterisks around the keyword or phrase.'
      ),
  }),
});

export const suggestSkillTool = createTool({
  description: 'Suggest improvements for a specific skill category',
  parameters: z.object({
    index: z.number().describe('Index of the skill category to improve'),
    improvedSkill: z
      .object({
        category: z.string(),
        items: z.array(z.string()),
      })
      .describe(
        'Improved version of the skill category. ONLY use this tool to add NEW skills or REMOVE existing skills, DO NOT ADD IN EXISTING SKILLS IN ANY WAY.'
      ),
  }),
});

export const suggestEducationTool = createTool({
  description: 'Suggest improvements for a specific education entry',
  parameters: z.object({
    index: z.number().describe('Index of the education entry to improve'),
    improvedEducation: z
      .object({
        school: z.string(),
        degree: z.string(),
        field: z.string(),
        location: z.string().optional(),
        date: z.string(),
        gpa: z.string().optional(),
        achievements: z.array(z.string()).optional(),
      })
      .describe(
        'Improved version of the education entry. For important keywords, format them as bold, like this: **keyword**. Put two asterisks around the keyword or phrase.'
      ),
  }),
});

export const modifyWholeResumeTool = createTool({
  description:
    'Modify multiple sections of the resume at once. For important keywords, format them as bold, like this: **keyword**. Put two asterisks around the keyword or phrase.',
  parameters: z.object({
    basicInfo: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().optional(),
        phoneNumber: z.string().optional(),
        location: z.string().optional(),
        website: z.string().optional(),
        linkedinUrl: z.string().optional(),
        githubUrl: z.string().optional(),
      })
      .optional(),
    workExperience: z
      .array(
        z.object({
          company: z.string(),
          position: z.string(),
          location: z.string().optional(),
          date: z.string(),
          description: z.array(z.string()),
          technologies: z.array(z.string()).optional(),
        })
      )
      .optional(),
    education: z
      .array(
        z.object({
          school: z.string(),
          degree: z.string(),
          field: z.string(),
          location: z.string().optional(),
          date: z.string(),
          gpa: z.string().optional(),
          achievements: z.array(z.string()).optional(),
        })
      )
      .optional(),
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
});

export const devTestTool = createTool({
  description:
    'This is a function to test in development. Please fill each string below with a 200 word sentance about resume building.',
  parameters: z.object({
    sentance1: z.string(),
    sentance2: z.string(),
    sentance3: z.string(),
  }),
});

// Export all tools in a single object for convenience
export const tools = {
  getResume: getResumeTool,
  suggest_work_experience_improvement: suggestWorkExperienceTool,
  suggest_project_improvement: suggestProjectTool,
  suggest_skill_improvement: suggestSkillTool,
  suggest_education_improvement: suggestEducationTool,
  modifyWholeResume: modifyWholeResumeTool,
  // devTestTool: devTestTool,
};
