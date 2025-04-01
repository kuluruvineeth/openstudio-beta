'use client';

import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { cn } from '@repo/design-system/lib/utils';
import { Sparkles } from 'lucide-react';

interface AIGenerationSettingsProps {
  numPoints: number;
  customPrompt: string;
  onNumPointsChange: (value: number) => void;
  onCustomPromptChange: (value: string) => void;
  promptPlaceholder?: string;
}

export function AIGenerationSettings({
  numPoints,
  customPrompt,
  onNumPointsChange,
  onCustomPromptChange,
  promptPlaceholder = 'e.g., Focus on leadership and team management achievements',
}: AIGenerationSettingsProps) {
  return (
    <div className="space-y-2.5">
      {/* Header */}
      <div className="flex items-center gap-2 pb-0.5">
        <div className="rounded-md bg-purple-100 p-1 text-purple-600">
          <Sparkles className="h-3 w-3" />
        </div>
        <span className="font-medium text-purple-700 text-xs">
          AI Generation Settings
        </span>
      </div>

      {/* Number of Suggestions */}
      <div>
        <Label className="font-medium text-[11px] text-purple-700">
          Points to Generate
        </Label>
        <Input
          type="number"
          min={1}
          max={8}
          value={numPoints}
          onChange={(e) =>
            onNumPointsChange(Number.parseInt(e.target.value) || 3)
          }
          className={cn(
            'mt-0.5 h-7',
            'bg-white',
            'border-purple-200',
            'focus:border-purple-400 focus:ring-1 focus:ring-purple-300',
            'hover:bg-white',
            'text-purple-900 text-xs'
          )}
        />
      </div>

      {/* Custom Focus */}
      <div>
        <Label className="font-medium text-[11px] text-purple-700">
          Prompt for AI (Optional)
        </Label>
        <Textarea
          value={customPrompt}
          onChange={(e) => onCustomPromptChange(e.target.value)}
          placeholder={promptPlaceholder}
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
    </div>
  );
}
