'use client';

import { ResumePDFDocument } from '@/app/(organization)/resume/components/resume/editor/preview/resume-pdf-document';
import { useResumeContext } from '@/app/(organization)/resume/components/resume/editor/resume-editor-context';
import { TextImport } from '@/app/(organization)/resume/components/text-import';
import type { Resume } from '@/types';
import { pdf } from '@react-pdf/renderer';
import { Button } from '@repo/design-system/components/ui/button';
import { Checkbox } from '@repo/design-system/components/ui/checkbox';
import { toast } from '@repo/design-system/hooks/use-toast';
import { cn } from '@repo/design-system/lib/utils';
import { Download, Loader2, Save } from 'lucide-react';

import { updateResume } from '@/actions/resume';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip';
import { useState } from 'react';

interface ResumeEditorActionsProps {
  onResumeChange: (field: keyof Resume, value: Resume[keyof Resume]) => void;
}

export function ResumeEditorActions({
  onResumeChange,
}: ResumeEditorActionsProps) {
  const { state, dispatch } = useResumeContext();
  const { resume, isSaving } = state;
  const [downloadOptions, setDownloadOptions] = useState({
    resume: true,
    coverLetter: true,
  });

  // Save Resume
  const handleSave = async () => {
    try {
      dispatch({ type: 'SET_SAVING', value: true });
      await updateResume(state.resume.id, state.resume);
      toast({
        title: 'Changes saved',
        description: 'Your resume has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Save failed',
        description:
          error instanceof Error
            ? error.message
            : 'Unable to save your changes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      dispatch({ type: 'SET_SAVING', value: false });
    }
  };

  // Dynamic color classes based on resume type
  const colors = resume.isBaseResume
    ? {
        // Import button colors
        importBg: 'bg-indigo-600',
        importHover: 'hover:bg-indigo-700',
        importShadow: 'shadow-indigo-400/20',
        // Action buttons colors (download & save)
        actionBg: 'bg-purple-600',
        actionHover: 'hover:bg-purple-700',
        actionShadow: 'shadow-purple-400/20',
      }
    : {
        // Import button colors
        importBg: 'bg-rose-600',
        importHover: 'hover:bg-rose-700',
        importShadow: 'shadow-rose-400/20',
        // Action buttons colors (download & save)
        actionBg: 'bg-pink-600',
        actionHover: 'hover:bg-pink-700',
        actionShadow: 'shadow-pink-400/20',
      };

  const buttonBaseStyle = cn(
    'transition-all duration-300',
    'relative overflow-hidden',
    'h-8 px-3 font-medium text-[11px]',
    'rounded-md border-none',
    'text-white shadow-sm',
    'hover:-translate-y-[1px] hover:shadow-md',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none'
  );

  const importButtonClasses = cn(
    buttonBaseStyle,
    colors.importBg,
    colors.importHover,
    colors.importShadow
  );

  const actionButtonClasses = cn(
    buttonBaseStyle,
    colors.actionBg,
    colors.actionHover,
    colors.actionShadow
  );

  return (
    <div className="@container px-1 py-2">
      <div className="grid grid-cols-3 gap-2">
        {/* Text Import Button */}
        <TextImport
          resume={resume}
          onResumeChange={onResumeChange}
          className={importButtonClasses}
        />

        {/* Download Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={async () => {
                  try {
                    // Download Resume if selected
                    if (downloadOptions.resume) {
                      const blob = await pdf(
                        <ResumePDFDocument resume={resume} />
                      ).toBlob();
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `${resume.firstName}_${resume.lastName}_Resume.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }

                    // Download Cover Letter if selected and exists
                    if (downloadOptions.coverLetter && resume.hasCoverLetter) {
                      // Dynamically import html2pdf only when needed
                      //@ts-ignore
                      const html2pdf = (await import('html2pdf.js')).default;

                      const coverLetterElement = document.getElementById(
                        'cover-letter-content'
                      );
                      if (!coverLetterElement) {
                        throw new Error('Cover letter content not found');
                      }

                      const opt = {
                        margin: [0, 0, -0.5, 0],
                        filename: `${resume.firstName}_${resume.lastName}_Cover_Letter.pdf`,
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: {
                          backgroundColor: 'red',
                          useCORS: true,
                          letterRendering: true,
                          // width: 700,
                          // height: 1000,
                          // windowWidth: 700,
                          logging: true,
                          // windowHeight: 2000
                          allowTaint: true,
                          foreignObjectRendering: false,
                          scale: 2,
                        },
                        jsPDF: {
                          unit: 'in',
                          format: 'letter',
                          orientation: 'portrait',
                        },
                      };

                      await html2pdf().set(opt).from(coverLetterElement).save();
                    }

                    toast({
                      title: 'Download started',
                      description: 'Your documents are being downloaded.',
                    });
                  } catch (error) {
                    console.error(error);
                    toast({
                      title: 'Download failed',
                      description:
                        error instanceof Error
                          ? error.message
                          : 'Unable to download your documents. Please try again.',
                      variant: 'destructive',
                    });
                  }
                }}
                className={actionButtonClasses}
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Download
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              align="start"
              sideOffset={5}
              className={cn(
                'w-48 p-3',
                resume.isBaseResume
                  ? 'border-2 border-indigo-200 bg-indigo-50'
                  : 'border-2 border-rose-200 bg-rose-50',
                'rounded-lg shadow-lg'
              )}
            >
              <div className="space-y-3">
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={downloadOptions.resume}
                    onCheckedChange={(checked) =>
                      setDownloadOptions((prev) => ({
                        ...prev,
                        resume: checked as boolean,
                      }))
                    }
                    className={cn(
                      resume.isBaseResume
                        ? 'border-indigo-400 data-[state=checked]:border-indigo-600 data-[state=checked]:bg-indigo-600'
                        : 'border-rose-400 data-[state=checked]:border-rose-600 data-[state=checked]:bg-rose-600'
                    )}
                  />
                  <span className="font-medium text-foreground text-sm">
                    Resume
                  </span>
                </label>
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={downloadOptions.coverLetter}
                    onCheckedChange={(checked) =>
                      setDownloadOptions((prev) => ({
                        ...prev,
                        coverLetter: checked as boolean,
                      }))
                    }
                    className={cn(
                      resume.isBaseResume
                        ? 'border-indigo-400 data-[state=checked]:border-indigo-600 data-[state=checked]:bg-indigo-600'
                        : 'border-rose-400 data-[state=checked]:border-rose-600 data-[state=checked]:bg-rose-600'
                    )}
                  />
                  <span className="font-medium text-foreground text-sm">
                    Cover Letter
                  </span>
                </label>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className={actionButtonClasses}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Save
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
