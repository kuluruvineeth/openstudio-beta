export * from '@/types/assistants';
export * from '@/types/messages';
export * from '@/types/models';
export * from '@/types/preferences';
export * from '@/types/sessions';
export * from '@/types/tools';
export * from '@/types/documents';
export * from '@/types/export';
export * from '@/types/prompt';
export * from '@/types/attachment';
import type { premium } from '@repo/backend/schema';
import type { jobs } from '@repo/backend/schema';
import type { InferSelectModel } from 'drizzle-orm';

export interface WorkExperience {
  company: string;
  position: string;
  location?: string;
  date: string;
  description: string[];
  technologies?: string[];
}

export interface Education {
  school: string;
  degree: string;
  field: string;
  location?: string;
  date: string;
  gpa?: number | string;
  achievements?: string[];
}

export interface Project {
  name: string;
  description: string[];
  date?: string;
  technologies?: string[];
  url?: string;
  github_url?: string;
}

export interface Skill {
  category: string;
  items: string[];
}

// Enum types for Job
export type WorkLocationType = 'remote' | 'in_person' | 'hybrid' | null;
export type EmploymentType =
  | 'full_time'
  | 'part_time'
  | 'co_op'
  | 'internship'
  | 'contract'
  | null;

// Job type based on our schema
export type Job = Omit<
  InferSelectModel<typeof jobs>,
  'workLocation' | 'employmentType'
> & {
  workLocation: WorkLocationType;
  employmentType: EmploymentType;
};

export interface SectionConfig {
  visible: boolean;
  max_items?: number | null;
  style?: 'grouped' | 'list' | 'grid';
}

export interface DocumentSettings {
  document_font_size: number;
  document_line_height: number;
  document_margin_vertical: number;
  document_margin_horizontal: number;
  header_name_size: number;
  header_name_bottom_spacing: number;
  skills_margin_top: number;
  skills_margin_bottom: number;
  skills_margin_horizontal: number;
  skills_item_spacing: number;
  experience_margin_top: number;
  experience_margin_bottom: number;
  experience_margin_horizontal: number;
  experience_item_spacing: number;
  projects_margin_top: number;
  projects_margin_bottom: number;
  projects_margin_horizontal: number;
  projects_item_spacing: number;
  education_margin_top: number;
  education_margin_bottom: number;
  education_margin_horizontal: number;
  education_item_spacing: number;
  show_osr_footer?: boolean;
  footer_width?: number;
}

export interface Resume {
  id: string;
  userId: string;
  jobId?: string | null;
  name: string;
  targetRole: string;
  isBaseResume: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  location?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  createdAt: string;
  updatedAt: string;
  documentSettings?: DocumentSettings;
  sectionOrder?: string[];
  sectionConfigs?: {
    [key: string]: { visible: boolean };
  };
  hasCoverLetter: boolean;
  coverLetter?: Record<string, unknown> | null;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}
export interface Profile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  location: string | null;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  workExperience: WorkExperience[] | unknown;
  education: Education[] | unknown;
  skills: Skill[] | unknown;
  projects: Project[] | unknown;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type TPremium = typeof premium.$inferSelect;

export enum TStopReason {
  Error = 'error',
  Cancel = 'cancel',
  ApiKey = 'apikey',
  Recursion = 'recursion',
  Finish = 'finish',
  RateLimit = 'rateLimit',
  Unauthorized = 'unauthorized',
  Length = 'length',
  Stop = 'stop',
  FunctionCall = 'function_call',
  ContentFilter = 'content_filter',
  ToolCalls = 'tool_calls',
}

export type ApiKey = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  provider: string;
  key: string;
  organizationId: string;
};
