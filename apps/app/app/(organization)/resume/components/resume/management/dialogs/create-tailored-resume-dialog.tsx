'use client';

import { tailorResumeToJob } from '@/actions/ai';
import { formatJobListing } from '@/actions/ai';
import { createJob } from '@/actions/job';
import { createTailoredResume } from '@/actions/resume';
import type { Profile, Resume } from '@/types';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@repo/design-system/components/ui/dialog';
import { Label } from '@repo/design-system/components/ui/label';
import { toast } from '@repo/design-system/hooks/use-toast';
import { cn } from '@repo/design-system/lib/utils';
import { ArrowRight, Loader2, Plus, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MiniResumePreview } from '../../shared/mini-resume-preview';
import { BaseResumeSelector } from '../base-resume-selector';
import { ImportMethodRadioGroup } from '../import-method-radio-group';
import { JobDescriptionInput } from '../job-description-input';
import { type CreationStep, LoadingOverlay } from '../loading-overlay';
import { CreateBaseResumeDialog } from './create-base-resume-dialog';

interface CreateTailoredResumeDialogProps {
  children: React.ReactNode;
  baseResumes?: Resume[];
  profile?: Profile;
}

export function CreateTailoredResumeDialog({
  children,
  baseResumes,
  profile,
}: CreateTailoredResumeDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedBaseResume, setSelectedBaseResume] = useState<string>(
    baseResumes?.[0]?.id || ''
  );
  const [jobDescription, setJobDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState<CreationStep>('analyzing');
  const [importOption, setImportOption] = useState<'import-profile' | 'ai'>(
    'ai'
  );
  const [isBaseResumeInvalid, setIsBaseResumeInvalid] = useState(false);
  const [isJobDescriptionInvalid, setIsJobDescriptionInvalid] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    title: '',
    description: '',
  });
  const router = useRouter();

  const handleCreate = async () => {
    // Validate required fields
    if (!selectedBaseResume) {
      setIsBaseResumeInvalid(true);
      toast({
        title: 'Error',
        description: 'Please select a base resume',
        variant: 'destructive',
      });
      return;
    }

    if (!jobDescription.trim() && importOption === 'ai') {
      setIsJobDescriptionInvalid(true);
      toast({
        title: 'Error',
        description: 'Please enter a job description',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsCreating(true);
      setCurrentStep('analyzing');

      // Reset validation states
      setIsBaseResumeInvalid(false);
      setIsJobDescriptionInvalid(false);

      if (importOption === 'import-profile') {
        // Direct copy logic
        const baseResume = baseResumes?.find(
          (r) => r.id === selectedBaseResume
        );
        if (!baseResume) throw new Error('Base resume not found');

        let jobId: string | null = null;
        let jobTitle = 'Copied Resume';
        let companyName = '';

        if (jobDescription.trim()) {
          try {
            setCurrentStep('analyzing');
            const formattedJobListing = await formatJobListing(
              profile?.email || '',
              jobDescription
            );

            setCurrentStep('formatting');
            const jobEntry = await createJob(formattedJobListing);
            if (!jobEntry?.id) throw new Error('Failed to create job entry');

            jobId = jobEntry.id;
            jobTitle = formattedJobListing.positionTitle || 'Copied Resume';
            companyName = formattedJobListing.companyName || '';
          } catch (error: unknown) {
            setErrorMessage({
              title: 'Error',
              description:
                'Failed to process job description. Please try again.',
            });
            setShowErrorDialog(true);
            setIsCreating(false);
            return;
          }
        }

        const resume = await createTailoredResume(
          baseResume,
          jobId,
          jobTitle,
          companyName,
          {
            workExperience: baseResume.workExperience,
            education: baseResume.education.map((edu) => ({
              ...edu,
              gpa: edu.gpa?.toString(),
            })),
            skills: baseResume.skills,
            projects: baseResume.projects,
            targetRole: baseResume.targetRole,
          }
        );

        toast({
          title: 'Success',
          description: 'Resume created successfully',
        });

        router.push(`/resume/resumes/${resume.id}`);
        setOpen(false);
        return;
      }

      // 1. Format the job listing
      // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
      // biome-ignore lint/suspicious/noEvolvingTypes: <explanation>
      let formattedJobListing;
      try {
        formattedJobListing = await formatJobListing(
          profile?.email || '',
          jobDescription
        );
      } catch (error: unknown) {
        setErrorMessage({
          title: 'Error',
          description: 'Failed to analyze job description. Please try again.',
        });
        setShowErrorDialog(true);
        setIsCreating(false);
        return;
      }

      setCurrentStep('formatting');

      // 2. Create job in database and get ID
      const jobEntry = await createJob(formattedJobListing);
      if (!jobEntry?.id) throw new Error('Failed to create job entry');

      // 3. Get the base resume object
      const baseResume = baseResumes?.find((r) => r.id === selectedBaseResume);
      if (!baseResume) throw new Error('Base resume not found');

      setCurrentStep('tailoring');

      // 4. Tailor the resume using the formatted job listing
      // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
      // biome-ignore lint/suspicious/noEvolvingTypes: <explanation>
      let tailoredContent;

      try {
        tailoredContent = await tailorResumeToJob(
          profile?.email || '',
          baseResume,
          formattedJobListing
        );
      } catch (error: unknown) {
        setErrorMessage({
          title: 'Error',
          description: 'Failed to tailor resume. Please try again.',
        });
        setShowErrorDialog(true);
        setIsCreating(false);
        return;
      }

      setCurrentStep('finalizing');

      // 5. Create the tailored resume with job reference
      const resume = await createTailoredResume(
        baseResume,
        jobEntry.id,
        formattedJobListing.positionTitle || '',
        formattedJobListing.companyName || '',
        tailoredContent
      );

      toast({
        title: 'Success',
        description: 'Resume created successfully',
      });

      router.push(`/resume/resumes/${resume.id}`);
      setOpen(false);
    } catch (error: unknown) {
      console.error('Failed to create resume:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to create resume',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Reset form when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setJobDescription('');
      setImportOption('ai');
      setSelectedBaseResume(baseResumes?.[0]?.id || '');
    }
  };

  if (!baseResumes || baseResumes.length === 0) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className={cn(
            'max-h-[90vh] overflow-y-auto p-0 sm:max-w-[800px]',
            'border-white/40 bg-gradient-to-b shadow-2xl backdrop-blur-2xl',
            'border-pink-200/40 from-pink-50/95 to-rose-50/90',
            'rounded-xl'
          )}
        >
          <div className="flex flex-col items-center justify-center space-y-4 p-8">
            <div className="rounded-2xl border border-pink-100 bg-pink-50/50 p-4">
              <Sparkles className="h-8 w-8 text-pink-600" />
            </div>
            <div className="max-w-sm space-y-2 text-center">
              <h3 className="font-semibold text-base text-pink-950">
                No Base Resumes Found
              </h3>
              <p className="text-muted-foreground text-xs">
                You need to create a base resume first before you can create a
                tailored version.
              </p>
            </div>
            {profile ? (
              <CreateBaseResumeDialog profile={profile}>
                <Button
                  className={cn(
                    'mt-2 text-white shadow-lg transition-all duration-500 hover:shadow-xl',
                    'bg-gradient-to-r from-purple-600 to-indigo-600',
                    'hover:from-purple-700 hover:to-indigo-700'
                  )}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Base Resume
                </Button>
              </CreateBaseResumeDialog>
            ) : (
              <Button disabled className="mt-2">
                No profile available to create base resume
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className={cn(
            'max-h-[90vh] overflow-y-auto p-0 sm:max-w-[800px]',
            'border-white/40 bg-gradient-to-b shadow-2xl backdrop-blur-2xl',
            'border-pink-200/40 from-pink-50/95 to-rose-50/90',
            'rounded-xl'
          )}
        >
          <style jsx global>{`
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
              20%, 40%, 60%, 80% { transform: translateX(2px); }
            }
            .shake {
              animation: shake 0.8s cubic-bezier(.36,.07,.19,.97) both;
            }
          `}</style>
          {/* Header Section with Icon */}
          <div
            className={cn(
              'relative top-0 z-10 border-b bg-white/50 px-8 pt-6 pb-4 backdrop-blur-xl',
              'border-pink-200/20'
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  'rounded-xl p-3 transition-all duration-300',
                  'border border-pink-200/60 bg-gradient-to-br from-pink-100/80 to-rose-100/80'
                )}
              >
                <Sparkles className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <DialogTitle className="font-semibold text-pink-950 text-xl">
                  Create Tailored Resume
                </DialogTitle>
                <DialogDescription className="mt-1 text-muted-foreground text-sm">
                  Create a tailored resume based on an existing base resume
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="relative space-y-6 bg-gradient-to-b from-pink-50/30 to-rose-50/30 px-8 py-6">
            {isCreating && <LoadingOverlay currentStep={currentStep} />}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="base-resume"
                  className="font-medium text-base text-pink-950"
                >
                  Select Base Resume <span className="text-red-500">*</span>
                </Label>

                {/* Base Resume Selector */}
                <BaseResumeSelector
                  baseResumes={baseResumes}
                  selectedResumeId={selectedBaseResume}
                  onResumeSelect={setSelectedBaseResume}
                  isInvalid={isBaseResumeInvalid}
                />
              </div>

              {/* Resume Selection Visualization */}
              <div className="flex items-center justify-center gap-4">
                {selectedBaseResume && baseResumes ? (
                  <>
                    <MiniResumePreview
                      name={
                        baseResumes.find((r) => r.id === selectedBaseResume)
                          ?.name || ''
                      }
                      type="base"
                      className="hover:-translate-y-1 w-24 transition-transform duration-300"
                    />
                    <div className="flex flex-col items-center gap-1">
                      <ArrowRight className="h-6 w-6 animate-pulse text-pink-600" />
                      <span className="font-medium text-muted-foreground text-xs">
                        Tailored For Job
                      </span>
                    </div>
                    <MiniResumePreview
                      name="Tailored Resume"
                      type="tailored"
                      className="hover:-translate-y-1 w-24 transition-transform duration-300"
                    />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-pink-100 border-dashed p-4">
                    <div className="font-medium text-muted-foreground text-sm">
                      Select a base resume to see preview
                    </div>
                  </div>
                )}
              </div>

              <JobDescriptionInput
                value={jobDescription}
                onChange={setJobDescription}
                isInvalid={isJobDescriptionInvalid}
              />

              <ImportMethodRadioGroup
                value={importOption}
                onChange={setImportOption}
              />
            </div>
          </div>

          {/* Footer Section */}
          <div
            className={cn(
              'sticky bottom-0 z-10 border-t bg-white/50 px-8 py-4 backdrop-blur-xl',
              'border-pink-200/20 bg-white/40'
            )}
          >
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className={cn(
                  'border-gray-200 text-gray-600',
                  'hover:bg-white/60',
                  'hover:border-pink-200'
                )}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={isCreating}
                className={cn(
                  'text-white shadow-lg transition-all duration-500 hover:shadow-xl',
                  'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700'
                )}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Resume'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
