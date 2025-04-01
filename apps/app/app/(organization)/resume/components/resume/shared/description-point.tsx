'use client';

import Tiptap from '@/app/(organization)/resume/components/tiptap';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip';
import { cn } from '@repo/design-system/lib/utils';
import { Check, Loader2, Sparkles, Trash2, X } from 'lucide-react';
import { AIImprovementPrompt } from './ai-improvement-prompt';

interface DescriptionPointProps {
  value: string;
  onChange: (value: string) => void;
  onDelete: () => void;
  onImprove: () => void;
  onAcceptImprovement?: () => void;
  onUndoImprovement?: () => void;
  isImproved?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  improvementPrompt?: string;
  onImprovementPromptChange?: (value: string) => void;
  improvementPromptPlaceholder?: string;
}

export function DescriptionPoint({
  value,
  onChange,
  onDelete,
  onImprove,
  onAcceptImprovement,
  onUndoImprovement,
  isImproved,
  isLoading,
  placeholder = 'Start with a strong action verb',
  improvementPrompt = '',
  onImprovementPromptChange,
  improvementPromptPlaceholder = 'e.g., Focus on technical implementation details and performance metrics',
}: DescriptionPointProps) {
  return (
    <div className="group/item flex items-start gap-1">
      <div className="flex-1">
        <Tiptap
          content={value}
          onChange={onChange}
          editorProps={{
            attributes: {
              placeholder,
              class: cn(
                'min-h-[80px] rounded-lg border-gray-200 bg-white/50 text-xs md:text-sm',
                'focus:border-cyan-500/40 focus:ring-2 focus:ring-cyan-500/20',
                'transition-colors hover:border-cyan-500/30 hover:bg-white/60',
                'placeholder:text-gray-400',
                isImproved && [
                  'border-purple-400',
                  'bg-gradient-to-r from-purple-50/80 to-indigo-50/80',
                  'shadow-[0_0_15px_-3px_rgba(168,85,247,0.2)]',
                  'hover:bg-gradient-to-r hover:from-purple-50/90 hover:to-indigo-50/90',
                ]
              ),
            },
          }}
        />
        {isImproved && (
          <div className="-top-2.5 absolute right-12 rounded-full bg-purple-100 px-2 py-0.5">
            <span className="flex items-center gap-1 font-medium text-[10px] text-purple-600">
              <Sparkles className="h-3 w-3" />
              AI Suggestion
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        {isImproved ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={onAcceptImprovement}
              className={cn(
                'p-0 group-hover/item:opacity-100',
                'h-8 w-8 rounded-lg',
                'bg-green-50/80 hover:bg-green-100/80',
                'text-green-600 hover:text-green-700',
                'border border-green-200/60',
                'shadow-sm',
                'transition-all duration-300',
                'hover:scale-105 hover:shadow-md',
                'hover:-translate-y-0.5'
              )}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onUndoImprovement}
              className={cn(
                'p-0 group-hover/item:opacity-100',
                'h-8 w-8 rounded-lg',
                'bg-rose-50/80 hover:bg-rose-100/80',
                'text-rose-600 hover:text-rose-700',
                'border border-rose-200/60',
                'shadow-sm',
                'transition-all duration-300',
                'hover:scale-105 hover:shadow-md',
                'hover:-translate-y-0.5'
              )}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="p-0 text-gray-400 transition-all duration-300 hover:text-red-500 group-hover/item:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onImprove}
                    disabled={isLoading}
                    className={cn(
                      'p-0 group-hover/item:opacity-100',
                      'h-8 w-8 rounded-lg',
                      'bg-purple-50/80 hover:bg-purple-100/80',
                      'text-purple-600 hover:text-purple-700',
                      'border border-purple-200/60',
                      'shadow-sm',
                      'transition-all duration-300',
                      'hover:scale-105 hover:shadow-md',
                      'hover:-translate-y-0.5'
                    )}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                {onImprovementPromptChange && (
                  <TooltipContent
                    side="bottom"
                    align="start"
                    sideOffset={2}
                    className={cn(
                      'w-72 p-3.5',
                      'bg-purple-50',
                      'border-2 border-purple-300',
                      'shadow-lg shadow-purple-100/50',
                      'rounded-lg'
                    )}
                  >
                    <AIImprovementPrompt
                      value={improvementPrompt}
                      onChange={onImprovementPromptChange}
                      placeholder={improvementPromptPlaceholder}
                      onSubmit={onImprove}
                      isLoading={isLoading}
                    />
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>
    </div>
  );
}
