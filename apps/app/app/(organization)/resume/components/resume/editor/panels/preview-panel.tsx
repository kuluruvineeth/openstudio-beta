'use client';

import CoverLetter from '@/app/(organization)/resume/components/cover-letter/cover-letter';
import { ResumeContextMenu } from '@/app/(organization)/resume/components/resume/editor/preview/resume-context-menu';
import { ResumePreview } from '@/app/(organization)/resume/components/resume/editor/preview/resume-preview';
import type { Resume } from '@/types';
import { ScrollArea } from '@repo/design-system/components/ui/scroll-area';
import { cn } from '@repo/design-system/lib/utils';

interface PreviewPanelProps {
  resume: Resume;
  onResumeChange: (field: keyof Resume, value: Resume[keyof Resume]) => void;
  width: number;
  // percentWidth: number;
}

export function PreviewPanel({
  resume,
  // onResumeChange,
  width,
}: PreviewPanelProps) {
  return (
    <ScrollArea
      className={cn(
        ' z-50 h-full bg-red-500',
        resume.isBaseResume
          ? 'bg-purple-50/30'
          : 'bg-pink-50/60 shadow-pink-200/20 shadow-sm'
      )}
    >
      <div className="">
        <ResumeContextMenu resume={resume}>
          <ResumePreview resume={resume} containerWidth={width} />
        </ResumeContextMenu>
      </div>

      <CoverLetter
        // resumeId={resume.id}
        // hasCoverLetter={resume.has_cover_letter}
        // coverLetterData={resume.cover_letter}
        containerWidth={width}
        // onCoverLetterChange={(data: Record<string, unknown>) => {
        //   if ('has_cover_letter' in data) {
        //     onResumeChange('has_cover_letter', data.has_cover_letter as boolean);
        //   }
        //   if ('cover_letter' in data) {
        //     onResumeChange('cover_letter', data.cover_letter as Record<string, unknown>);
        //   }
        // }}
      />
    </ScrollArea>
  );
}
