'use client';

import { AIGenerationSettings } from '@/app/(organization)/resume/components/resume/shared/ai-generation-settings';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip';
import { cn } from '@repo/design-system/lib/utils';
import { Loader2, Sparkles } from 'lucide-react';

interface AIGenerationTooltipProps {
  index: number;
  loadingAI: boolean;
  generateAIPoints: (index: number) => void;
  aiConfig: { numPoints: number; customPrompt: string };
  onNumPointsChange: (value: number) => void;
  onCustomPromptChange: (value: string) => void;
  colorClass: {
    button: string;
    border: string;
    hoverBorder: string;
    hoverBg: string;
    tooltipBg: string;
    tooltipBorder: string;
    tooltipShadow: string;
    text: string;
    hoverText: string;
  };
}

export function AIGenerationSettingsTooltip({
  index,
  loadingAI,
  generateAIPoints,
  aiConfig,
  onNumPointsChange,
  onCustomPromptChange,
  colorClass,
}: AIGenerationTooltipProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateAIPoints(index)}
            disabled={loadingAI}
            className={cn(
              'flex-1 text-[10px] transition-colors sm:text-xs',
              colorClass.button,
              colorClass.border,
              colorClass.hoverBorder,
              colorClass.hoverBg,
              colorClass.hoverText
            )}
          >
            {loadingAI ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-1 h-4 w-4" />
            )}
            {loadingAI ? 'Generating...' : 'Write points with AI'}
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="start"
          sideOffset={2}
          className={cn(
            'w-72 rounded-lg p-3.5',
            colorClass.tooltipBg,
            colorClass.tooltipBorder,
            colorClass.tooltipShadow
          )}
        >
          <AIGenerationSettings
            numPoints={aiConfig?.numPoints || 3}
            customPrompt={aiConfig?.customPrompt || ''}
            onNumPointsChange={onNumPointsChange}
            onCustomPromptChange={onCustomPromptChange}
          />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
