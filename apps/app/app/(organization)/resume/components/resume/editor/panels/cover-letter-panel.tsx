import { generateCoverLetter as generate } from '@/actions/ai';
import { CreateTailoredResumeDialog } from '@/app/(organization)/resume/components/resume/management/dialogs/create-tailored-resume-dialog';
import type { Job, Resume } from '@/types';
import { readStreamableValue } from '@repo/ai';
import { Button } from '@repo/design-system/components/ui/button';
import { cn } from '@repo/design-system/lib/utils';
import { FileText, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AIImprovementPrompt } from '../../shared/ai-improvement-prompt';
import { useResumeContext } from '../resume-editor-context';

interface CoverLetterPanelProps {
  resume: Resume;
  job: Job | null;
}

export function CoverLetterPanel({ resume, job }: CoverLetterPanelProps) {
  const { dispatch } = useResumeContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    title: '',
    description: '',
  });

  const updateField = (field: keyof Resume, value: Resume[keyof Resume]) => {
    dispatch({
      type: 'UPDATE_FIELD',
      field,
      value,
    });
  };

  const generateCoverLetter = async () => {
    if (!job) return;

    setIsGenerating(true);

    try {
      // Prompt
      const prompt = `Write a professional cover letter for the following job using my resume information:
      ${JSON.stringify(job)}
      
      ${JSON.stringify(resume)}
      
      Today's date is ${new Date().toLocaleDateString()}.

      Please use my contact information in the letter:
      Full Name: ${resume.firstName} ${resume.lastName}
      Email: ${resume.email}
      ${resume.phoneNumber ? `Phone: ${resume.phoneNumber}` : ''}
      ${resume.linkedinUrl ? `LinkedIn: ${resume.linkedinUrl}` : ''}
      ${resume.githubUrl ? `GitHub: ${resume.githubUrl}` : ''}

      ${customPrompt ? `\nAdditional requirements: ${customPrompt}` : ''}`;

      // Call The Model
      const { output } = await generate('', prompt);

      // Generated Content
      let generatedContent = '';

      // Update Resume Context
      for await (const delta of readStreamableValue(output)) {
        generatedContent += delta;
        // Update resume context directly
        // console.log('Generated Content:', generatedContent);
        updateField('coverLetter', {
          content: generatedContent,
        });
      }
    } catch (error: unknown) {
      console.error('Generation error:', error);
      setErrorMessage({
        title: 'Error',
        description: 'Failed to generate cover letter. Please try again.',
      });
      setShowErrorDialog(true);
    } finally {
      setIsGenerating(false);
    }
  };

  if (resume.isBaseResume) {
    return (
      <div
        className={cn(
          'rounded-lg border border-purple-200 bg-purple-50/80 p-4 shadow-lg backdrop-blur-xl',
          'space-y-4 text-center'
        )}
      >
        <div className="flex items-center justify-center gap-2">
          <div className="rounded-md bg-purple-100/80 p-1.5">
            <FileText className="h-4 w-4 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg text-purple-900">
            Cover Letter
          </h3>
        </div>

        <p className="text-purple-700 text-sm">
          To generate a cover letter, please first tailor this base resume to a
          specific job.
        </p>

        <CreateTailoredResumeDialog baseResumes={[resume]}>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tailor This Resume
          </Button>
        </CreateTailoredResumeDialog>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-emerald-600/50 bg-white/80 p-4 shadow-lg backdrop-blur-xl',
        'space-y-6'
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-md bg-emerald-100/80 p-1.5">
          <FileText className="h-4 w-4 text-emerald-600" />
        </div>
        <h3 className="font-semibold text-emerald-900 text-lg">Cover Letter</h3>
      </div>

      {resume.hasCoverLetter ? (
        <div className="space-y-6">
          <div
            className={cn(
              'w-full p-4',
              'bg-emerald-50',
              'border-2 border-emerald-300',
              'shadow-sm',
              'rounded-lg'
            )}
          >
            <AIImprovementPrompt
              value={customPrompt}
              onChange={setCustomPrompt}
              isLoading={isGenerating}
              placeholder="e.g., Focus on leadership experience and technical skills"
              hideSubmitButton
            />
          </div>

          <div className="space-y-3">
            <Button
              variant="default"
              size="sm"
              className={cn(
                'w-full',
                'bg-emerald-600 hover:bg-emerald-700',
                'text-white',
                'border border-emerald-200/60',
                'shadow-sm',
                'transition-all duration-300',
                'hover:scale-[1.02] hover:shadow-md',
                'hover:-translate-y-0.5'
              )}
              onClick={generateCoverLetter}
              disabled={isGenerating || !job}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate with AI
                </>
              )}
            </Button>

            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => updateField('hasCoverLetter', false)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Cover Letter
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-muted bg-muted/50 p-4">
            <p className="text-muted-foreground text-sm">
              No cover letter has been created for this resume yet.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-emerald-600/50 text-emerald-700 hover:bg-emerald-50"
            onClick={() => updateField('hasCoverLetter', true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Cover Letter
          </Button>
        </div>
      )}
    </div>
  );
}
