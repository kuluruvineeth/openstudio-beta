'use client';

import { formatJobListing } from '@/actions/ai';
import { createJob, deleteJob } from '@/actions/job';
import { updateResume } from '@/actions/resume';
import type { Job, Resume } from '@/types';
import { createClient } from '@repo/backend/auth/client';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/design-system/components/ui/accordion';
import {
  Alert,
  AlertDescription,
} from '@repo/design-system/components/ui/alert';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Card } from '@repo/design-system/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@repo/design-system/components/ui/dialog';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { toast } from '@repo/design-system/hooks/use-toast';
import { cn } from '@repo/design-system/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Briefcase,
  Clock,
  DollarSign,
  Loader2,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { BriefcaseIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useResumeContext } from '../../editor/resume-editor-context';

interface TailoredJobCardProps {
  jobId: string | null;
  // onJobDelete?: () => void;
  job?: Job | null;
  isLoading?: boolean;
}

export function TailoredJobCard({
  jobId,
  job: externalJob,
  isLoading: externalIsLoading,
}: TailoredJobCardProps) {
  const router = useRouter();
  const { state, dispatch } = useResumeContext();

  // Only use internal state if external job is not provided
  const [internalJob, setInternalJob] = useState<Job | null>(null);
  const [internalIsLoading, setInternalIsLoading] = useState(true);

  const effectiveJob = externalJob ?? internalJob;
  const effectiveIsLoading = externalIsLoading ?? internalIsLoading;

  // Only fetch if external job is not provided
  useEffect(() => {
    if (externalJob !== undefined) return;

    async function fetchJob() {
      if (!jobId) {
        setInternalJob(null);
        setInternalIsLoading(false);
        return;
      }

      try {
        setInternalIsLoading(true);
        //TODO: Later move this to server action
        const supabase = createClient();
        const { data: jobData, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();

        if (error) {
          if (error.code !== 'PGRST116') {
            throw error;
          }
          setInternalJob(null);
          return;
        }

        setInternalJob(jobData);
      } catch (error) {
        console.error('Error fetching job:', error);
        if (error instanceof Error && error.message !== 'No rows returned') {
          setInternalJob(null);
        }
      } finally {
        setInternalIsLoading(false);
      }
    }

    fetchJob();
  }, [jobId, externalJob]);

  const [isCreating, setIsCreating] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [isFormatting, setIsFormatting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    jobDescription?: string;
  }>({});

  const formatWorkLocation = (workLocation: Job['workLocation']) => {
    if (!workLocation) return 'Not specified';
    return workLocation.replace('_', ' ');
  };

  const validateJobDescription = (value: string) => {
    const errors: { jobDescription?: string } = {};
    if (!value.trim()) {
      errors.jobDescription = 'Job description is required';
    } else if (value.trim().length < 50) {
      errors.jobDescription =
        'Job description should be at least 50 characters';
    }
    return errors;
  };

  const handleJobDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setJobDescription(value);
    setValidationErrors(validateJobDescription(value));
  };

  const handleCreateJobWithAI = async () => {
    const errors = validateJobDescription(jobDescription);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast({
        title: 'Validation Error',
        description: errors.jobDescription,
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsFormatting(true);

      // Format job listing using AI
      const formattedJob = await formatJobListing('', jobDescription);

      setIsFormatting(false);
      setIsCreating(true);

      // Create job in database
      const newJob = await createJob(formattedJob);

      // Update resume with new job ID using context
      dispatch({ type: 'UPDATE_FIELD', field: 'jobId', value: newJob.id });

      // Save the changes to the database
      await updateResume(state.resume.id, {
        ...state.resume,
        jobId: newJob.id,
      });

      // Close dialog and refresh
      setCreateDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to create job',
        variant: 'destructive',
      });
    } finally {
      setIsFormatting(false);
      setIsCreating(false);
      setJobDescription('');
    }
  };

  // Enhanced loading skeleton with proper ARIA and animations
  const LoadingSkeleton = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
      // biome-ignore lint/a11y/useSemanticElements: <explanation>
      role="status"
      aria-label="Loading job details"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="w-3/4 space-y-3">
          <div className="h-6 animate-pulse rounded-xl bg-gradient-to-r from-pink-200/50 via-rose-200/50 to-pink-200/50" />
          <div className="h-4 w-2/3 animate-pulse rounded-lg bg-gradient-to-r from-pink-100/50 via-rose-100/50 to-pink-100/50" />
        </div>
        <div className="h-8 w-8 animate-pulse rounded-xl bg-gradient-to-r from-pink-200/50 via-rose-200/50 to-pink-200/50" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded-full bg-gradient-to-r from-pink-200/50 via-rose-200/50 to-pink-200/50" />
            <div className="h-4 flex-1 animate-pulse rounded-lg bg-gradient-to-r from-pink-100/50 via-rose-100/50 to-pink-100/50" />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-6 w-20 animate-pulse rounded-full bg-gradient-to-r from-pink-100/50 via-rose-100/50 to-pink-100/50"
          />
        ))}
      </div>
    </motion.div>
  );

  // Enhanced error state with proper ARIA and animations
  const ErrorState = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center space-y-4 p-8"
      role="alert"
      aria-live="polite"
    >
      <div className="rounded-xl border border-red-100 bg-red-50/80 p-3 backdrop-blur-sm">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </div>
      <div className="space-y-2 text-center">
        <h3 className="font-semibold text-red-900">Unable to Load Job</h3>
        <p className="text-red-600/90 text-sm">
          This job listing is no longer available or there was an error loading
          it.
        </p>
        <Button
          variant="outline"
          onClick={() => router.refresh()}
          className="mt-4 border-red-200 bg-white/80 text-red-700 hover:border-red-300 hover:bg-red-50/80"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 0.5 }}
          >
            Try Again
          </motion.div>
        </Button>
      </div>
    </motion.div>
  );

  if (!jobId) {
    return (
      <Card className="group relative">
        <div className="relative flex flex-col items-center justify-center space-y-6 p-8 text-center">
          <div className="rounded-2xl border border-pink-200/20 bg-gradient-to-br from-pink-500/5 to-rose-500/5 p-4 transition-transform duration-500 group-hover:scale-110">
            <Plus className="h-8 w-8 text-pink-500" />
          </div>

          <div className="space-y-2">
            <h3 className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text font-semibold text-transparent text-xl">
              No Job Currently Linked
            </h3>
            <p className="max-w-sm text-gray-500/90 text-sm">
              Create a new job listing to track the position you&apos;re
              applying for and tailor your resume accordingly.
            </p>
          </div>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className={cn(
                  'relative overflow-hidden',
                  'bg-gradient-to-r from-pink-500 to-rose-500',
                  'font-medium text-white',
                  'border border-pink-400/20',
                  'shadow-lg shadow-pink-500/10',
                  'hover:shadow-pink-500/20 hover:shadow-xl',
                  'hover:scale-105',
                  'transition-all duration-500'
                )}
                aria-label="Create new job listing"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Job Listing
              </Button>
            </DialogTrigger>

            <DialogContent
              className={cn(
                'sm:max-w-[600px]',
                'bg-gradient-to-b from-white/95 to-white/90',
                'backdrop-blur-xl',
                'border-pink-200/40',
                'shadow-pink-500/10 shadow-xl'
              )}
            >
              <DialogTitle className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text font-semibold text-transparent text-xl">
                Create New Job Listing
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Paste the job description below and let our AI format it
                automatically.
              </DialogDescription>

              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={handleJobDescriptionChange}
                    className={cn(
                      'min-h-[200px]',
                      'bg-white/80 backdrop-blur-sm',
                      'border transition-all duration-300',
                      'placeholder:text-gray-400',
                      validationErrors.jobDescription
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-200 focus:border-pink-500 focus:ring-pink-500/20'
                    )}
                    aria-invalid={!!validationErrors.jobDescription}
                    aria-describedby="job-description-error"
                  />
                  {validationErrors.jobDescription && (
                    <Alert variant="destructive" className="mt-2" role="alert">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription id="job-description-error">
                        {validationErrors.jobDescription}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <DialogFooter className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setCreateDialogOpen(false)}
                    className={cn(
                      'border-gray-200',
                      'hover:bg-gray-50',
                      'transition-colors duration-300'
                    )}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateJobWithAI}
                    disabled={
                      isFormatting ||
                      isCreating ||
                      !!validationErrors.jobDescription
                    }
                    className={cn(
                      'relative overflow-hidden',
                      'bg-gradient-to-r from-pink-500 to-rose-500',
                      'hover:from-pink-600 hover:to-rose-600',
                      'font-medium text-white',
                      'shadow-lg hover:shadow-xl',
                      'disabled:cursor-not-allowed disabled:opacity-50',
                      'disabled:hover:from-pink-500 disabled:hover:to-rose-500',
                      'transition-all duration-300'
                    )}
                    aria-busy={isFormatting || isCreating}
                  >
                    {isFormatting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Formatting...
                      </>
                      // biome-ignore lint/nursery/noNestedTernary: <explanation>
                    ) : isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Create with AI
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('group relative border-none px-8')}>
      <div className="relative">
        <AnimatePresence mode="wait">
          {effectiveIsLoading ? (
            <LoadingSkeleton />
            // biome-ignore lint/nursery/noNestedTernary: <explanation>
          ) : effectiveJob ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 p-4"
            >
              {/* Job Details Grid */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                {[
                  {
                    icon: MapPin,
                    text: effectiveJob.location || 'Location not specified',
                    color: 'pink',
                  },
                  {
                    icon: Briefcase,
                    text: formatWorkLocation(effectiveJob.workLocation),
                    color: 'rose',
                  },
                  {
                    icon: DollarSign,
                    text: effectiveJob.salaryRange || 'Salary not specified',
                    color: 'pink',
                  },
                  {
                    icon: Clock,
                    text:
                      effectiveJob.employmentType?.replace('_', ' ') ||
                      'Employment type not specified',
                    color: 'rose',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className={cn(
                      'flex items-center gap-2',
                      'text-gray-600 text-sm',
                      `group-hover:text-${item.color}-600`,
                      'transition-colors duration-300'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="truncate capitalize">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Description */}
              {effectiveJob.description && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700 text-sm">
                    Description
                  </h4>
                  <p className="whitespace-pre-wrap text-gray-600 text-sm">
                    {effectiveJob.description}
                  </p>
                </div>
              )}

              {/* Keywords */}
              <div className="flex flex-wrap gap-2 ">
                {effectiveJob.keywords?.map((keyword, index) => (
                  <motion.div
                    key={keyword}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Badge
                      variant="secondary"
                      className={cn(
                        'py-0.5 text-xs',
                        'bg-gradient-to-r from-pink-50/50 to-rose-50/50',
                        'hover:from-pink-100/50 hover:to-rose-100/50',
                        'text-pink-700',
                        'border border-pink-100/20',
                        'transition-all duration-300',
                        'cursor-default'
                      )}
                    >
                      {keyword}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <ErrorState />
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

interface TailoredJobAccordionProps {
  resume: Resume;
  job: Job | null;
  isLoading?: boolean;
}

export function TailoredJobAccordion({
  resume,
  job,
  isLoading,
}: TailoredJobAccordionProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  if (resume.isBaseResume) return null;

  const title = job?.positionTitle || 'Target Job';
  const company = job?.companyName;

  const handleDelete = async () => {
    if (!resume.jobId) return;

    try {
      setIsDeleting(true);
      await deleteJob(resume.jobId);
      router.refresh();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete job',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AccordionItem
      value="job"
      className="mb-4 rounded-lg border-2 border-pink-600/50 bg-white shadow-lg backdrop-blur-xl"
    >
      <div className="px-4">
        <AccordionTrigger className="group hover:no-underline">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'rounded-md p-1 transition-transform duration-300 group-data-[state=open]:scale-105',
                'bg-pink-100/80'
              )}
            >
              <BriefcaseIcon className={cn('h-3.5 w-3.5', 'text-pink-600')} />
            </div>
            <div className="flex flex-col items-start">
              <span className={cn('font-medium text-sm', 'text-pink-900')}>
                {title}
              </span>
              {company && (
                <span className="text-pink-600/80 text-xs">{company}</span>
              )}
            </div>
          </div>
        </AccordionTrigger>
      </div>
      <AccordionContent className=" ">
        <div className="">
          <TailoredJobCard
            jobId={resume.jobId || null}
            job={job}
            isLoading={isLoading}
          />
          {job && (
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                disabled={isDeleting}
                className={cn(
                  'text-gray-400',
                  'hover:text-red-500',
                  'hover:bg-red-50/50',
                  'transition-all duration-300',
                  'rounded-lg',
                  'gap-2'
                )}
              >
                {isDeleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                Delete Job
              </Button>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
