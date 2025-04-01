'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Label } from '@repo/design-system/components/ui/label';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { cn } from '@repo/design-system/lib/utils';
import { Loader2, Sparkles } from 'lucide-react';

interface AIImprovementPromptProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  hideSubmitButton?: boolean;
}

export function AIImprovementPrompt({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder = 'e.g., Make it more impactful and quantifiable',
  hideSubmitButton = false,
}: AIImprovementPromptProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label className="font-medium text-[11px] text-purple-700">
          Prompt for AI (Optional)
        </Label>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'mt-0.5 h-14 text-xs',
            'bg-white',
            'border-purple-200',
            'focus:border-purple-400 focus:ring-1 focus:ring-purple-300',
            'hover:bg-white',
            'resize-none',
            'text-purple-900 placeholder:text-purple-400'
          )}
        />
      </div>
      {!hideSubmitButton && onSubmit && (
        <Button
          variant="outline"
          size="sm"
          onClick={onSubmit}
          disabled={isLoading}
          className={cn(
            'h-8 w-full',
            'bg-purple-50/80 hover:bg-purple-100/80',
            'text-purple-600 hover:text-purple-700',
            'border border-purple-200/60',
            'shadow-sm',
            'transition-all duration-300',
            'hover:scale-[1.02] hover:shadow-md',
            'hover:-translate-y-0.5',
            'text-xs'
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Improving...
            </>
          ) : (
            <>
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Improve with AI
            </>
          )}
        </Button>
      )}
    </div>
  );
}
