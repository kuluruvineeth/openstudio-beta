'use server';

import type { simplifiedJobSchema } from '@/lib/zod-schemas';
import { currentUser } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { jobs, resumes } from '@repo/backend/schema';
import { count, desc, eq, sql } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';
import type { JobListingParams } from './schema';

export async function createJob(
  jobListing: z.infer<typeof simplifiedJobSchema>
) {
  const user = await currentUser();
  if (!user) {
    throw new Error('User not found');
  }

  const jobData = {
    userId: user.id,
    companyName: jobListing.companyName,
    positionTitle: jobListing.positionTitle || '',
    jobUrl: jobListing.jobUrl,
    description: jobListing.description,
    location: jobListing.location,
    salaryRange: jobListing.salaryRange,
    keywords: jobListing.keywords,
    workLocation: jobListing.workLocation || 'in_person',
    employmentType: jobListing.employmentType || 'full_time',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [job] = await database.insert(jobs).values(jobData).returning();

  if (!job) {
    throw new Error('Failed to create job');
  }

  return job;
}

export async function deleteJob(jobId: string): Promise<void> {
  const user = await currentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const affectedResumes = await database
      .select({ id: resumes.id })
      .from(resumes)
      .where(and(eq(resumes.jobId, jobId), eq(resumes.userId, user.id)));

    const deleteResult = await database
      .delete(jobs)
      .where(and(eq(jobs.id, jobId), eq(jobs.userId, user.id)))
      .returning({ id: jobs.id });

    if (deleteResult.length === 0) {
      throw new Error('Job not found or access denied');
    }

    for (const resume of affectedResumes) {
      revalidatePath(`/resume/resumes/${resume.id}`);
    }

    revalidatePath('/resume', 'layout');
  } catch (error) {
    console.error('Error deleting job:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to delete job');
  }
}

export async function getJobListings({
  page = 1,
  pageSize = 10,
  filters,
}: JobListingParams) {
  const offset = (page - 1) * pageSize;

  const conditions = [eq(jobs.isActive, true)];

  if (filters) {
    if (filters.workLocation) {
      conditions.push(eq(jobs.workLocation, filters.workLocation));
    }
    if (filters.employmentType) {
      conditions.push(eq(jobs.employmentType, filters.employmentType));
    }
    if (filters.keywords && filters.keywords.length > 0) {
      conditions.push(
        sql`${jobs.keywords} @> ${JSON.stringify(filters.keywords)}::jsonb`
      );
    }
  }
  const whereClause = and(...conditions);

  try {
    const countResult = await database
      .select({ value: count() })
      .from(jobs)
      .where(whereClause);

    const totalCount = countResult[0]?.value ?? 0;

    const queryBuilder = database.select().from(jobs).where(whereClause);

    const jobData = await queryBuilder
      .orderBy(desc(jobs.createdAt))
      .limit(pageSize)
      .offset(offset);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      jobs: jobData,
      totalCount,
      currentPage: page,
      totalPages,
    };
  } catch (error) {
    console.error('Error fetching job listings:', error);
    // Re-throw or handle as appropriate
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch job listings');
  }
}

// delete job
export async function deleteTailoredJob(jobId: string) {
  const user = await currentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const job = await database
    .delete(jobs)
    .where(and(eq(jobs.id, jobId), eq(jobs.userId, user.id)));

  if (job.length === 0) {
    throw new Error('Job not found or access denied');
  }

  revalidatePath('/resume', 'layout');
}

// create empty job
export async function createEmptyJob() {
  const user = await currentUser();
  if (!user || !user.id) {
    throw new Error('User not authenticated');
  }

  const emptyJob = {
    userId: user.id,
    companyName: 'New Company',
    positionTitle: 'New Position',
    jobUrl: null,
    description: null,
    location: null,
    salaryRange: null,
    keywords: [],
    workLocation: null,
    employmentType: null,
    isActive: true,
  };

  const [job] = await database.insert(jobs).values(emptyJob).returning();

  revalidatePath('/resume', 'layout');

  return job;
}
