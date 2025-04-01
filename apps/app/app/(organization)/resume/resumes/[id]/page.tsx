import { getResumeById } from '@/actions/resume';
import { ResumeEditorClient } from '@/app/(organization)/resume/components/resume/editor/resume-editor-client';
import type { Resume } from '@/types';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Helper function to normalize resume data
function normalizeResumeData(resume: Resume): Resume {
  return {
    ...resume,
    // Normalize work experience dates
    workExperience:
      resume.workExperience?.map((exp) => ({
        ...exp,
        date: exp.date || '',
      })) || [],
    // Normalize education dates
    education:
      resume.education?.map((edu) => ({
        ...edu,
        date: edu.date || '',
      })) || [],
    // Normalize project dates
    projects:
      resume.projects?.map((project) => ({
        ...project,
        date: project.date || '',
      })) || [],
    // Initialize document settings with defaults if not present
    documentSettings: resume.documentSettings || {
      document_font_size: 10,
      document_line_height: 1.5,
      document_margin_vertical: 36,
      document_margin_horizontal: 36,
      header_name_size: 24,
      header_name_bottom_spacing: 24,
      skills_margin_top: 2,
      skills_margin_bottom: 2,
      skills_margin_horizontal: 0,
      skills_item_spacing: 2,
      experience_margin_top: 2,
      experience_margin_bottom: 2,
      experience_margin_horizontal: 0,
      experience_item_spacing: 4,
      projects_margin_top: 2,
      projects_margin_bottom: 2,
      projects_margin_horizontal: 0,
      projects_item_spacing: 4,
      education_margin_top: 2,
      education_margin_bottom: 2,
      education_margin_horizontal: 0,
      education_item_spacing: 4,
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const { resume } = await getResumeById(id);
    return {
      title: `${resume.name} | Open Studio Resume`,
      description: `Editing ${resume.name} - ${resume.targetRole} resume`,
    };
  } catch (error) {
    void error;
    return {
      title: 'Resume Editor | Open Studio Resume',
      description: 'AI-powered resume editor',
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const { resume: rawResume, profile } = await getResumeById(id);
    const normalizedResume = normalizeResumeData(rawResume);
    const component = (
      <div
        className="flex h-full flex-col "
        data-page-title={normalizedResume.name}
        data-resume-type={
          normalizedResume.isBaseResume ? 'Base Resume' : 'Tailored Resume'
        }
      >
        <ResumeEditorClient
          initialResume={normalizedResume}
          profile={profile}
        />
      </div>
    );

    return component;
  } catch (error) {
    console.timeEnd('🔍 [Page] Total Load Time');
    console.error('❌ [Error]:', error);
    if (error instanceof Error && error.message === 'User not authenticated') {
      redirect('/auth/login');
    }
    redirect('/');
  }
}
