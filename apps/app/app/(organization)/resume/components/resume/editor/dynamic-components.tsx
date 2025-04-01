import { LoadingFallback } from '@/app/(organization)/resume/components/resume/editor/shared/LoadingFallback';
import type {
  DocumentSettings,
  Education,
  Project,
  Skill,
  WorkExperience,
} from '@/types';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

interface WorkExperienceFormProps {
  experiences: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
  profile: { workExperience: WorkExperience[] };
  targetRole?: string;
}

interface ProjectsFormProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
  profile: { projects: Project[] };
}

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
  profile: { education: Education[] };
}

interface SkillsFormProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
  profile: { skills: Skill[] };
}

export const WorkExperienceForm = dynamic(
  () =>
    //@ts-ignore
    import('./forms/work-experience-form').then((mod) => ({
      default: mod.WorkExperienceForm,
    })) as Promise<ComponentType<WorkExperienceFormProps>>,
  {
    loading: () => <LoadingFallback lines={2} />,
    ssr: false,
  }
);

export const EducationForm = dynamic(
  () =>
    //@ts-ignore
    import('./forms/education-form').then((mod) => ({
      default: mod.EducationForm,
    })) as Promise<ComponentType<EducationFormProps>>,
  {
    loading: () => <LoadingFallback lines={1} />,
    ssr: false,
  }
);

export const SkillsForm = dynamic(
  () =>
    //@ts-ignore
    import('./forms/skills-form').then((mod) => ({
      default: mod.SkillsForm,
    })) as Promise<ComponentType<SkillsFormProps>>,
  {
    loading: () => <LoadingFallback lines={1} />,
    ssr: false,
  }
);

export const ProjectsForm = dynamic(
  () =>
    //@ts-ignore
    import('./forms/projects-form').then((mod) => ({
      default: mod.ProjectsForm,
    })) as Promise<ComponentType<ProjectsFormProps>>,
  {
    loading: () => <LoadingFallback lines={1} />,
    ssr: false,
  }
);

export const DocumentSettingsForm = dynamic(
  () =>
    //@ts-ignore
    import('./forms/document-settings-form').then((mod) => ({
      default: mod.DocumentSettingsForm,
    })) as Promise<
      ComponentType<{
        documentSettings: DocumentSettings;
        onChange: (field: 'documentSettings', value: DocumentSettings) => void;
      }>
    >,
  {
    loading: () => <LoadingFallback lines={1} />,
    ssr: false,
  }
);
