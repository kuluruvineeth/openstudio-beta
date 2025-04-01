'use server';

import type { simplifiedResumeSchema } from '@/lib/zod-schemas';
import type {
  Education,
  Profile,
  Project,
  Resume,
  Skill,
  WorkExperience,
} from '@/types';
import { currentUser } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { Profile as ProfileTable, jobs, resumes } from '@repo/backend/schema';
import { and, count, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';

export async function getResumeDashboardData() {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error('User not found');
    }
    const profile = await database.query.Profile.findFirst({
      where: eq(ProfileTable.id, user.id),
    });
    if (!profile) {
      throw new Error('Profile not found');
    }

    // Fetch resumes data
    const resumesData = await database.query.resumes.findMany({
      where: eq(resumes.userId, user.id),
    });

    if (!resumesData) {
      throw new Error('Resumes not found');
    }

    const baseResumes = resumesData.filter(
      (resume) => resume.isBaseResume === true
    );

    const tailoredResumes = resumesData.filter(
      (resume) => resume.isBaseResume === false
    );

    const baseResumesData = baseResumes.map((resume) => ({
      ...resume,
      type: 'base' as const,
    }));

    const tailoredResumesData = tailoredResumes.map((resume) => ({
      ...resume,
      type: 'tailored' as const,
    }));

    return {
      profile,
      baseResumes: baseResumesData,
      tailoredResumes: tailoredResumesData,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get resume dashboard data');
  }
}

export async function updateResumeProfile(data: Partial<Profile>) {
  const user = await currentUser();
  if (!user) {
    throw new Error('User not found');
  }
  const profile = await database
    .update(ProfileTable)
    .set({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(ProfileTable.id, user.id));

  revalidatePath('/resume/profile');
  revalidatePath('/resume');
  return profile;
}

export async function importResume(data: Partial<Profile>) {
  const user = await currentUser();
  if (!user) {
    throw new Error('User not found');
  }

  const profileData = await database.query.Profile.findFirst({
    where: eq(ProfileTable.id, user.id),
  });

  if (!profileData) {
    throw new Error('Profile not found');
  }

  // Prepare the update data
  const updateData: Partial<Profile> = {};

  // Handle simple string fields - only update if current value is null/empty
  const simpleFields = [
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'location',
    'websiteUrl',
    'linkedinUrl',
    'githubUrl',
  ] as const;

  for (const field of simpleFields) {
    if (data[field] !== undefined) {
      // Only update if current value is null or empty string
      if (!profileData[field]) {
        updateData[field] = data[field];
      }
    }
  }

  // Handle array fields - append to existing arrays
  const arrayFields = [
    'workExperience',
    'education',
    'skills',
    'projects',
  ] as const;

  for (const field of arrayFields) {
    if (Array.isArray(data[field]) && data[field].length) {
      // Simply append new items to the existing array
      updateData[field] = [
        ...(Array.isArray(profileData[field]) ? profileData[field] : []),
        ...(Array.isArray(data[field]) ? data[field] : []),
      ];
    }
  }

  // Only proceed with update if there are changes
  if (Object.keys(updateData).length === 0) {
    return profileData;
  }

  const profile = await database
    .update(ProfileTable)
    .set({
      ...updateData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(ProfileTable.id, user.id));

  revalidatePath('/resume/profile');
  revalidatePath('/resume');

  return profile;
}

export async function createBaseResume(
  name: string,
  importOption: 'import-profile' | 'fresh' | 'import-resume' = 'import-profile',
  selectedContent?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    location?: string;
    website?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    workExperience?: WorkExperience[];
    education?: Education[];
    skills?: Skill[];
    projects?: Project[];
  }
) {
  const user = await currentUser();
  if (!user) {
    throw new Error('User not found');
  }

  const profile = await database.query.Profile.findFirst({
    where: eq(ProfileTable.id, user.id),
  });

  const newResume: Partial<Resume> = {
    userId: profile?.id,
    name,
    targetRole: name,
    isBaseResume: true,
    firstName:
      importOption === 'import-resume'
        ? selectedContent?.firstName || ''
        : importOption === 'fresh'
          ? ''
          : profile?.firstName || '',
    lastName:
      importOption === 'import-resume'
        ? selectedContent?.lastName || ''
        : importOption === 'fresh'
          ? ''
          : profile?.lastName || '',
    email:
      importOption === 'import-resume'
        ? selectedContent?.email || ''
        : importOption === 'fresh'
          ? ''
          : profile?.email || '',
    phoneNumber:
      importOption === 'import-resume'
        ? selectedContent?.phoneNumber || ''
        : importOption === 'fresh'
          ? ''
          : profile?.phoneNumber || '',
    location:
      importOption === 'import-resume'
        ? selectedContent?.location || ''
        : importOption === 'fresh'
          ? ''
          : profile?.location || '',
    websiteUrl:
      importOption === 'import-resume'
        ? selectedContent?.website || ''
        : importOption === 'fresh'
          ? ''
          : profile?.websiteUrl || '',
    linkedinUrl:
      importOption === 'import-resume'
        ? selectedContent?.linkedinUrl || ''
        : importOption === 'fresh'
          ? ''
          : profile?.linkedinUrl || '',
    githubUrl:
      importOption === 'import-resume'
        ? selectedContent?.githubUrl || ''
        : importOption === 'fresh'
          ? ''
          : profile?.githubUrl || '',
    workExperience:
      (importOption === 'import-profile' || importOption === 'import-resume') &&
      selectedContent
        ? selectedContent.workExperience
        : [],
    education:
      (importOption === 'import-profile' || importOption === 'import-resume') &&
      selectedContent
        ? selectedContent.education
        : [],
    skills:
      (importOption === 'import-profile' || importOption === 'import-resume') &&
      selectedContent
        ? selectedContent.skills
        : [],
    projects:
      (importOption === 'import-profile' || importOption === 'import-resume') &&
      selectedContent
        ? selectedContent.projects
        : [],
    sectionOrder: ['work_experience', 'education', 'skills', 'projects'],
    sectionConfigs: {
      work_experience: {
        visible: (selectedContent?.workExperience?.length ?? 0) > 0,
      },
      education: {
        visible: (selectedContent?.education?.length ?? 0) > 0,
      },
      skills: {
        visible: (selectedContent?.skills?.length ?? 0) > 0,
      },
      projects: {
        visible: (selectedContent?.projects?.length ?? 0) > 0,
      },
    },
    documentSettings: {
      footer_width: 0,
      show_osr_footer: false,
      header_name_size: 24,
      skills_margin_top: 0,
      document_font_size: 10,
      projects_margin_top: 0,
      skills_item_spacing: 0,
      document_line_height: 1.2,
      education_margin_top: 0,
      skills_margin_bottom: 2,
      experience_margin_top: 2,
      projects_item_spacing: 0,
      education_item_spacing: 0,
      projects_margin_bottom: 0,
      education_margin_bottom: 0,
      experience_item_spacing: 1,
      document_margin_vertical: 20,
      experience_margin_bottom: 0,
      skills_margin_horizontal: 0,
      document_margin_horizontal: 28,
      header_name_bottom_spacing: 16,
      projects_margin_horizontal: 0,
      education_margin_horizontal: 0,
      experience_margin_horizontal: 0,
    },
  };

  const validResumeData = {
    ...newResume,
    name: name || 'Untitled Resume',
    userId: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as const;

  const resume = await database
    .insert(resumes)
    .values(validResumeData)
    .returning();

  if (!resume) {
    throw new Error('Failed to create resume');
  }

  return resume[0];
}

export async function deleteResume(resumeId: string) {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error('User not found');
    }

    const resume = await database.query.resumes.findFirst({
      where: and(eq(resumes.id, resumeId), eq(resumes.userId, user.id)),
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    if (!resume.isBaseResume && resume.jobId) {
      await database
        .delete(jobs)
        .where(and(eq(jobs.id, resume.jobId), eq(jobs.userId, user.id)));
    }

    await database
      .delete(resumes)
      .where(and(eq(resumes.id, resumeId), eq(resumes.userId, user.id)));

    revalidatePath('/resume', 'layout');
    return resume;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete resume');
  }
}

export async function copyResume(resumeId: string) {
  const user = await currentUser();
  if (!user) {
    throw new Error('User not found');
  }

  const resume = await database.query.resumes.findFirst({
    where: and(eq(resumes.id, resumeId), eq(resumes.userId, user.id)),
  });

  if (!resume) {
    throw new Error('Resume not found');
  }

  const { id, ...resumeData } = resume;

  const newResume = {
    ...resumeData,
    name: `${resume.name} (Copy)`,
    userId: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [copiedResume] = await database
    .insert(resumes)
    .values(newResume)
    .returning();

  if (!copiedResume) {
    throw new Error('Failed to copy resume');
  }

  revalidatePath('/resume', 'layout');
  return copiedResume;
}

export async function countResumes(
  type: 'base' | 'tailored' | 'all'
): Promise<number> {
  const user = await currentUser();
  if (!user) {
    throw new Error('User not found');
  }

  // Build the where condition dynamically
  const whereCondition = and(
    eq(resumes.userId, user.id),
    type !== 'all' ? eq(resumes.isBaseResume, type === 'base') : undefined
  );

  try {
    const result = await database
      .select({
        value: count(),
      })
      .from(resumes)
      .where(whereCondition);

    return result[0]?.value ?? 0; // Return the count, defaulting to 0
  } catch (error) {
    console.error('Failed to count resumes:', error);
    return -1;
  }
}

export async function getResumeById(
  resumeId: string
): Promise<{ resume: Resume; profile: Profile }> {
  // 1. Get authenticated user
  const user = await currentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    // 2. Fetch resume and profile concurrently
    const [resumeResult, profileResult] = await Promise.all([
      database.query.resumes.findFirst({
        where: and(eq(resumes.id, resumeId), eq(resumes.userId, user.id)),
      }),
      database.query.Profile.findFirst({
        where: eq(ProfileTable.id, user.id),
      }),
    ]);

    // 3. Check if resume was found
    if (!resumeResult) {
      throw new Error('Resume not found or access denied');
    }

    // 4. Check if profile was found
    if (!profileResult) {
      throw new Error('Profile not found for authenticated user');
    }

    // 5. Return the results matching the expected types
    return {
      resume: {
        ...resumeResult,
        createdAt: resumeResult.createdAt.toISOString(),
        updatedAt: resumeResult.updatedAt.toISOString(),
      } as Resume,
      profile: {
        ...profileResult,
        createdAt: profileResult.createdAt.toISOString(),
        updatedAt: profileResult.updatedAt.toISOString(),
      } as Profile,
    };
  } catch (error) {
    console.error('Error fetching resume by ID:', error);
    if (error instanceof Error) {
      throw error; // Re-throw known errors
    }
    throw new Error('Failed to retrieve resume data'); // Throw a generic error
  }
}

export async function updateResume(resumeId: string, data: Partial<Resume>) {
  const user = await currentUser();
  if (!user) {
    throw new Error('User not found');
  }

  const resume = await database.query.resumes.findFirst({
    where: and(eq(resumes.id, resumeId), eq(resumes.userId, user.id)),
  });

  if (!resume) {
    throw new Error('Resume not found');
  }

  const updatedResume = await database
    .update(resumes)
    .set({
      ...data,
      updatedAt: new Date(),
      createdAt: resume.createdAt,
    })
    .where(eq(resumes.id, resumeId));

  return updatedResume;
}

export async function createTailoredResume(
  baseResume: Resume,
  jobId: string | null,
  jobTitle: string,
  companyName: string,
  tailoredContent: z.infer<typeof simplifiedResumeSchema>
) {
  const user = await currentUser();
  if (!user) {
    throw new Error('User not found');
  }

  const newResume = {
    ...tailoredContent,
    userId: user.id,
    jobId: jobId,
    isBaseResume: false,
    firstName: baseResume.firstName,
    lastName: baseResume.lastName,
    email: baseResume.email,
    phoneNumber: baseResume.phoneNumber,
    location: baseResume.location,
    websiteUrl: baseResume.websiteUrl,
    linkedinUrl: baseResume.linkedinUrl,
    githubUrl: baseResume.githubUrl,
    documentSettings: baseResume.documentSettings,
    sectionConfigs: baseResume.sectionConfigs,
    sectionOrder: baseResume.sectionOrder,
    resumeTitle: `${jobTitle} at ${companyName}`,
    name: `${jobTitle} at ${companyName}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [tailoredResume] = await database
    .insert(resumes)
    .values(newResume)
    .returning();

  if (!tailoredResume) {
    throw new Error('Failed to create tailored resume');
  }

  return tailoredResume;
}
