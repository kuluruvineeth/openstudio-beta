'use client';

import type { DocumentSettings, Job, Profile, Resume } from '@/types';
import { Accordion } from '@repo/design-system/components/ui/accordion';
import { ScrollArea } from '@repo/design-system/components/ui/scroll-area';
import { Tabs, TabsContent } from '@repo/design-system/components/ui/tabs';
import { cn } from '@repo/design-system/lib/utils';
import { Suspense, useRef } from 'react';
import ChatBot from '../../assistant/chatbot';
import { TailoredJobAccordion } from '../../management/cards/tailored-job-card';
import { ResumeEditorActions } from '../actions/resume-editor-actions';
import {
  DocumentSettingsForm,
  EducationForm,
  ProjectsForm,
  SkillsForm,
  WorkExperienceForm,
} from '../dynamic-components';
import { BasicInfoForm } from '../forms/basic-info-form';
import { ResumeEditorTabs } from '../header/resume-editor-tabs';
import { CoverLetterPanel } from './cover-letter-panel';
import ResumeScorePanel from './resume-score-panel';

interface EditorPanelProps {
  resume: Resume;
  profile: Profile;
  job: Job | null;
  isLoadingJob: boolean;
  onResumeChange: (field: keyof Resume, value: Resume[keyof Resume]) => void;
}

export function EditorPanel({
  resume,
  profile,
  job,
  isLoadingJob,
  onResumeChange,
}: EditorPanelProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative flex h-full max-h-full flex-col sm:mr-4 ">
      <div className="flex flex-1 flex-col overflow-scroll">
        <ScrollArea className="flex-1 sm:pr-2" ref={scrollAreaRef}>
          <div className="relative pb-12">
            <div
              className={cn(
                'sticky top-0 z-20 backdrop-blur-sm',
                resume.isBaseResume
                  ? 'bg-purple-50/80'
                  : 'bg-pink-100/90 shadow-pink-200/50 shadow-sm'
              )}
            >
              <div className="flex flex-col gap-4">
                <ResumeEditorActions onResumeChange={onResumeChange} />
              </div>
            </div>

            {/* Tailored Job Accordion */}
            <Accordion
              type="single"
              collapsible
              defaultValue="basic"
              className="mt-6"
            >
              <TailoredJobAccordion
                resume={resume}
                job={job}
                isLoading={isLoadingJob}
              />
            </Accordion>

            {/* Tabs */}
            <Tabs defaultValue="basic" className="mb-4">
              <ResumeEditorTabs />

              {/* Basic Info Form */}
              <TabsContent value="basic">
                <BasicInfoForm profile={profile} />
              </TabsContent>

              {/* Work Experience Form */}
              <TabsContent value="work">
                <Suspense
                  fallback={
                    <div className="animate-pulse space-y-4">
                      <div className="h-8 w-1/3 rounded-md bg-muted" />
                      <div className="h-24 rounded-md bg-muted" />
                      <div className="h-24 rounded-md bg-muted" />
                    </div>
                  }
                >
                  <WorkExperienceForm
                    experiences={resume.workExperience}
                    onChange={(experiences) =>
                      onResumeChange('workExperience', experiences)
                    }
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    profile={profile as any}
                    targetRole={resume.targetRole}
                  />
                </Suspense>
              </TabsContent>

              {/* Projects Form */}
              <TabsContent value="projects">
                <Suspense
                  fallback={
                    <div className="animate-pulse space-y-4">
                      <div className="h-8 w-1/3 rounded-md bg-muted" />
                      <div className="h-24 rounded-md bg-muted" />
                    </div>
                  }
                >
                  <ProjectsForm
                    projects={resume.projects}
                    onChange={(projects) =>
                      onResumeChange('projects', projects)
                    }
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    profile={profile as any}
                  />
                </Suspense>
              </TabsContent>

              {/* Education Form */}
              <TabsContent value="education">
                <Suspense
                  fallback={
                    <div className="animate-pulse space-y-4">
                      <div className="h-8 w-1/3 rounded-md bg-muted" />
                      <div className="h-24 rounded-md bg-muted" />
                    </div>
                  }
                >
                  <EducationForm
                    education={resume.education}
                    onChange={(education) =>
                      onResumeChange('education', education)
                    }
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    profile={profile as any}
                  />
                </Suspense>
              </TabsContent>

              {/* Skills Form */}
              <TabsContent value="skills">
                <Suspense
                  fallback={
                    <div className="animate-pulse space-y-4">
                      <div className="h-8 w-1/3 rounded-md bg-muted" />
                      <div className="h-24 rounded-md bg-muted" />
                    </div>
                  }
                >
                  <SkillsForm
                    skills={resume.skills}
                    onChange={(skills) => onResumeChange('skills', skills)}
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    profile={profile as any}
                  />
                </Suspense>
              </TabsContent>

              {/* Document Settings Form */}
              <TabsContent value="settings">
                <Suspense
                  fallback={
                    <div className="animate-pulse space-y-4">
                      <div className="h-8 w-1/3 rounded-md bg-muted" />
                      <div className="h-24 rounded-md bg-muted" />
                    </div>
                  }
                >
                  <DocumentSettingsForm
                    // biome-ignore lint/style/noNonNullAssertion: <explanation>
                    documentSettings={resume.documentSettings!}
                    onChange={(
                      _field: 'documentSettings',
                      value: DocumentSettings
                    ) => {
                      onResumeChange('documentSettings', value);
                    }}
                  />
                </Suspense>
              </TabsContent>

              {/* Cover Letter Form */}
              <TabsContent value="cover-letter">
                <CoverLetterPanel resume={resume} job={job} />
              </TabsContent>

              {/* Resume Score Form */}
              <TabsContent value="resume-score">
                <ResumeScorePanel
                  resume={resume}
                  // job={job}
                />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>

      <div
        className={cn(
          'border` absolute bottom-0 w-full rounded-lg',
          resume.isBaseResume
            ? 'border-purple-200/40 bg-purple-50/50'
            : 'border-pink-300/50 bg-pink-50/80 shadow-pink-200/20 shadow-sm'
        )}
      >
        <ChatBot resume={resume} onResumeChange={onResumeChange} job={job} />
      </div>
    </div>
  );
}
