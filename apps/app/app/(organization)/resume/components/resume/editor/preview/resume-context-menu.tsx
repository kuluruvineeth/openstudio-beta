'use client';

import type { Education, Project, Resume, WorkExperience } from '@/types';
import { pdf } from '@react-pdf/renderer';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@repo/design-system/components/ui/context-menu';
import { toast } from '@repo/design-system/hooks/use-toast';
import { Copy, Download } from 'lucide-react';
import { ResumePDFDocument } from '../preview/resume-pdf-document';

interface ResumeContextMenuProps {
  children: React.ReactNode;
  resume: Resume;
}

export function ResumeContextMenu({
  children,
  resume,
}: ResumeContextMenuProps) {
  const handleDownloadPDF = async () => {
    try {
      const blob = await pdf(<ResumePDFDocument resume={resume} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resume.firstName}_${resume.lastName}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: 'Download started',
        description: 'Your resume PDF is being downloaded.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Download failed',
        description: 'Unable to download your resume. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const formatWorkExperience = (exp: WorkExperience) => {
    const lines = [
      `${exp.position} at ${exp.company}`,
      exp.location ? `Location: ${exp.location}` : '',
      `Date: ${exp.date}`,
      '',
      ...exp.description.map((desc) => `• ${desc}`),
      exp.technologies ? `Technologies: ${exp.technologies.join(', ')}` : '',
    ];
    return lines.filter(Boolean).join('\n');
  };

  const formatEducation = (edu: Education) => {
    const lines = [
      `${edu.degree} in ${edu.field}`,
      edu.school,
      edu.location ? `Location: ${edu.location}` : '',
      `Date: ${edu.date}`,
      edu.gpa ? `GPA: ${edu.gpa}` : '',
      ...(edu.achievements || []).map(
        (achievement: string) => `• ${achievement}`
      ),
    ];
    return lines.filter(Boolean).join('\n');
  };

  const formatProject = (project: Project) => {
    const lines = [
      project.name,
      ...(project.description || []).map((desc: string) => `• ${desc}`),
      project.date ? `Date: ${project.date}` : '',
      project.technologies
        ? `Technologies: ${project.technologies.join(', ')}`
        : '',
      project.url ? `URL: ${project.url}` : '',
      project.github_url ? `GitHub: ${project.github_url}` : '',
    ];
    return lines.filter(Boolean).join('\n');
  };

  const handleCopyToClipboard = async () => {
    try {
      const sections: string[] = [];

      // Basic Info
      sections.push('BASIC INFORMATION');
      sections.push('-----------------');
      sections.push(`${resume.firstName} ${resume.lastName}`);
      sections.push(resume.email);
      if (resume.phoneNumber) sections.push(resume.phoneNumber);
      if (resume.location) sections.push(resume.location);
      if (resume.websiteUrl) sections.push(`Website: ${resume.websiteUrl}`);
      if (resume.linkedinUrl) sections.push(`LinkedIn: ${resume.linkedinUrl}`);
      if (resume.githubUrl) sections.push(`GitHub: ${resume.githubUrl}`);
      sections.push('\n');

      // Skills
      if (resume.skills.length > 0) {
        sections.push('SKILLS');
        sections.push('------');
        for (const skillGroup of resume.skills) {
          sections.push(`${skillGroup.category}:`);
          sections.push(skillGroup.items.join(', '));
        }
        sections.push('\n');
      }

      // Work Experience
      if (resume.workExperience.length > 0) {
        sections.push('WORK EXPERIENCE');
        sections.push('---------------');
        for (const exp of resume.workExperience) {
          sections.push(formatWorkExperience(exp));
          sections.push('');
        }
        sections.push('\n');
      }

      // Projects
      if (resume.projects.length > 0) {
        sections.push('PROJECTS');
        sections.push('--------');
        for (const project of resume.projects) {
          sections.push(formatProject(project));
          sections.push('');
        }
        sections.push('\n');
      }

      // Education
      if (resume.education.length > 0) {
        sections.push('EDUCATION');
        sections.push('---------');
        for (const edu of resume.education) {
          sections.push(formatEducation(edu));
          sections.push('');
        }
      }

      const formattedText = sections.join('\n');
      await navigator.clipboard.writeText(formattedText);

      toast({
        title: 'Copied to clipboard',
        description: 'Resume content has been copied to your clipboard.',
      });
    } catch (error: unknown) {
      void error;
      toast({
        title: 'Failed to copy',
        description: 'Could not copy resume content to clipboard.',
        variant: 'destructive',
      });
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="h-full w-full">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem
          onClick={handleDownloadPDF}
          className="flex cursor-pointer items-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span>Download as PDF</span>
        </ContextMenuItem>
        <ContextMenuItem
          onClick={handleCopyToClipboard}
          className="flex cursor-pointer items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          <span>Copy to Clipboard</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
