'use client';

import { LoadingDots } from '@repo/design-system/components/ui/loading-dots';
import { Progress } from '@repo/design-system/components/ui/progress';
import { cn } from '@repo/design-system/lib/utils';
import { CheckCircle2 } from 'lucide-react';

// Define the creation steps
export const CREATION_STEPS = [
  { id: 'analyzing', label: 'Analyzing Job Description' },
  { id: 'formatting', label: 'Formatting Requirements' },
  { id: 'tailoring', label: 'Tailoring Resume Content' },
  { id: 'finalizing', label: 'Finalizing Resume' },
] as const;

export type CreationStep = (typeof CREATION_STEPS)[number]['id'];

interface LoadingOverlayProps {
  currentStep: CreationStep;
}

export function LoadingOverlay({ currentStep }: LoadingOverlayProps) {
  const currentStepIndex = CREATION_STEPS.findIndex(
    (step) => step.id === currentStep
  );
  const progress = ((currentStepIndex + 1) / CREATION_STEPS.length) * 100;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="w-full max-w-md space-y-8 p-8">
        {/* Progress bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-muted-foreground text-sm">
            <span>Creating Resume</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {CREATION_STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = index < currentStepIndex;

            return (
              <div
                key={step.id}
                className={cn(
                  'flex items-center gap-3 rounded-lg p-3 transition-colors duration-300',
                  isActive && 'bg-pink-50 text-pink-900',
                  isCompleted && 'text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  // biome-ignore lint/nursery/noNestedTernary: <explanation>
                ) : isActive ? (
                  <div className="flex h-5 w-5 items-center justify-center">
                    <LoadingDots className="text-pink-600" />
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted" />
                )}
                <span
                  className={cn(
                    'font-medium text-sm',
                    isActive && 'text-pink-900',
                    !isActive && !isCompleted && 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Current action description */}
        <div className="text-center">
          <p className="animate-pulse text-muted-foreground text-sm">
            {currentStep === 'analyzing' &&
              'Reading and understanding the job requirements...'}
            {currentStep === 'formatting' &&
              'Structuring the job information...'}
            {currentStep === 'tailoring' &&
              'Optimizing your resume for the best match...'}
            {currentStep === 'finalizing' && 'Putting the final touches...'}
          </p>
        </div>
      </div>
    </div>
  );
}
