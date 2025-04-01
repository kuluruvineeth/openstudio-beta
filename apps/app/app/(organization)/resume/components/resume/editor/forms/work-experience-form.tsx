'use client';

import type { Profile, WorkExperience } from '@/types';
import { Button } from '@repo/design-system/components/ui/button';
import { Card, CardContent } from '@repo/design-system/components/ui/card';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import { cn } from '@repo/design-system/lib/utils';
import {
  Check,
  GripVertical,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { ImportFromProfileDialog } from '../../management/dialogs/import-from-profile-dialog';

import {
  generateWorkExperiencePoints,
  improveWorkExperience,
} from '@/actions/ai';
import { AIGenerationSettingsTooltip } from '@/app/(organization)/resume/components/resume/editor/components/ai-generation-tooltip';
import { AIImprovementPrompt } from '@/app/(organization)/resume/components/resume/shared/ai-improvement-prompt';
import { AISuggestions } from '@/app/(organization)/resume/components/resume/shared/ai-suggestions';
import Tiptap from '@/app/(organization)/resume/components/tiptap';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip';
import { memo, useEffect, useRef, useState } from 'react';

interface AISuggestion {
  id: string;
  point: string;
}

interface WorkExperienceFormProps {
  experiences: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
  profile: Profile;
  targetRole?: string;
}

interface ImprovedPoint {
  original: string;
  improved: string;
}

interface ImprovementConfig {
  [key: number]: { [key: number]: string }; // expIndex -> pointIndex -> prompt
}

// Create a comparison function
function areWorkExperiencePropsEqual(
  prevProps: WorkExperienceFormProps,
  nextProps: WorkExperienceFormProps
) {
  return (
    prevProps.targetRole === nextProps.targetRole &&
    JSON.stringify(prevProps.experiences) ===
      JSON.stringify(nextProps.experiences) &&
    prevProps.profile.id === nextProps.profile.id
  );
}

// Export the memoized component
export const WorkExperienceForm = memo(function WorkExperienceFormComponent({
  experiences,
  onChange,
  profile,
  targetRole = 'Software Engineer',
}: WorkExperienceFormProps) {
  const [aiSuggestions, setAiSuggestions] = useState<{
    [key: number]: AISuggestion[];
  }>({});
  const [loadingAI, setLoadingAI] = useState<{ [key: number]: boolean }>({});
  const [loadingPointAI, setLoadingPointAI] = useState<{
    [key: number]: { [key: number]: boolean };
  }>({});
  const [aiConfig, setAiConfig] = useState<{
    [key: number]: { numPoints: number; customPrompt: string };
  }>({});
  const [popoverOpen, setPopoverOpen] = useState<{ [key: number]: boolean }>(
    {}
  );
  const textareaRefs = useRef<{ [key: number]: HTMLTextAreaElement }>({});
  const [improvedPoints, setImprovedPoints] = useState<{
    [key: number]: { [key: number]: ImprovedPoint };
  }>({});
  const [improvementConfig, setImprovementConfig] = useState<ImprovementConfig>(
    {}
  );
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    title: '',
    description: '',
  });

  // Effect to focus textarea when popover opens
  useEffect(() => {
    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.entries(popoverOpen).forEach(([index, isOpen]) => {
      if (isOpen && textareaRefs.current[Number(index)]) {
        // Small delay to ensure the popover is fully rendered
        setTimeout(() => {
          textareaRefs.current[Number(index)]?.focus();
        }, 100);
      }
    });
  }, [popoverOpen]);

  const addExperience = () => {
    onChange([
      {
        company: '',
        position: '',
        location: '',
        date: '',
        description: [],
        technologies: [],
      },
      ...experiences,
    ]);
  };

  const updateExperience = (
    index: number,
    field: keyof WorkExperience,
    value: string | string[]
  ) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeExperience = (index: number) => {
    onChange(experiences.filter((_, i) => i !== index));
  };

  const handleImportFromProfile = (importedExperiences: WorkExperience[]) => {
    onChange([...importedExperiences, ...experiences]);
  };

  const generateAIPoints = async (index: number) => {
    const exp = experiences[index];
    const config = aiConfig[index] || { numPoints: 3, customPrompt: '' };
    setLoadingAI((prev) => ({ ...prev, [index]: true }));
    setPopoverOpen((prev) => ({ ...prev, [index]: false }));

    try {
      const result = await generateWorkExperiencePoints(
        '',
        exp.position,
        exp.company,
        exp.technologies || [],
        targetRole,
        config.numPoints,
        config.customPrompt
      );

      const suggestions = result.points.map((point: string) => ({
        id: Math.random().toString(36).substr(2, 9),
        point,
      }));

      setAiSuggestions((prev) => ({
        ...prev,
        [index]: suggestions,
      }));
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      setErrorMessage({
        title: 'Error',
        description: 'Failed to generate AI points. Please try again.',
      });
      setShowErrorDialog(true);
    } finally {
      setLoadingAI((prev) => ({ ...prev, [index]: false }));
    }
  };

  const approveSuggestion = (expIndex: number, suggestion: AISuggestion) => {
    const updated = [...experiences];
    updated[expIndex].description = [
      ...updated[expIndex].description,
      suggestion.point,
    ];
    onChange(updated);

    // Remove the suggestion after approval
    setAiSuggestions((prev) => ({
      ...prev,
      [expIndex]: prev[expIndex].filter((s) => s.id !== suggestion.id),
    }));
  };

  const deleteSuggestion = (expIndex: number, suggestionId: string) => {
    setAiSuggestions((prev) => ({
      ...prev,
      [expIndex]: prev[expIndex].filter((s) => s.id !== suggestionId),
    }));
  };

  const rewritePoint = async (expIndex: number, pointIndex: number) => {
    const exp = experiences[expIndex];
    const point = exp.description[pointIndex];
    const customPrompt = improvementConfig[expIndex]?.[pointIndex];

    setLoadingPointAI((prev) => ({
      ...prev,
      [expIndex]: { ...(prev[expIndex] || {}), [pointIndex]: true },
    }));

    try {
      const improvedPoint = await improveWorkExperience(
        '',
        point,
        customPrompt
      );

      // Store both original and improved versions
      setImprovedPoints((prev) => ({
        ...prev,
        [expIndex]: {
          ...(prev[expIndex] || {}),
          [pointIndex]: {
            original: point,
            improved: improvedPoint,
          },
        },
      }));

      // Update the experience with the improved version
      const updated = [...experiences];
      updated[expIndex].description[pointIndex] = improvedPoint;
      onChange(updated);
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      setErrorMessage({
        title: 'Error',
        description: 'Failed to improve point. Please try again.',
      });
      setShowErrorDialog(true);
    } finally {
      setLoadingPointAI((prev) => ({
        ...prev,
        [expIndex]: { ...(prev[expIndex] || {}), [pointIndex]: false },
      }));
    }
  };

  const undoImprovement = (expIndex: number, pointIndex: number) => {
    const improvedPoint = improvedPoints[expIndex]?.[pointIndex];
    if (improvedPoint) {
      const updated = [...experiences];
      updated[expIndex].description[pointIndex] = improvedPoint.original;
      onChange(updated);

      // Remove the improvement from state
      setImprovedPoints((prev) => {
        const newState = { ...prev };
        if (newState[expIndex]) {
          delete newState[expIndex][pointIndex];
          if (Object.keys(newState[expIndex]).length === 0) {
            delete newState[expIndex];
          }
        }
        return newState;
      });
    }
  };

  return (
    <>
      <div className="space-y-2 sm:space-y-3">
        <div className="@container">
          <div
            className={cn(
              'flex @[400px]:flex-row flex-col gap-2',
              'transition-all duration-300 ease-in-out'
            )}
          >
            <Button
              variant="outline"
              onClick={addExperience}
              className={cn(
                'h-9 min-w-[120px] flex-1',
                'bg-gradient-to-r from-cyan-500/5 via-cyan-500/10 to-blue-500/5',
                'hover:from-cyan-500/10 hover:via-cyan-500/15 hover:to-blue-500/10',
                'border-2 border-cyan-500/30 border-dashed hover:border-cyan-500/40',
                'text-cyan-700 hover:text-cyan-800',
                'transition-all duration-300',
                'rounded-xl',
                'whitespace-nowrap @[300px]:text-sm text-[11px]'
              )}
            >
              <Plus className="mr-2 h-4 w-4 shrink-0" />
              Add Work Experience
            </Button>

            <ImportFromProfileDialog<WorkExperience>
              profile={profile}
              onImport={handleImportFromProfile}
              type="workExperience"
              buttonClassName={cn(
                'mb-0 h-9 min-w-[120px] flex-1',
                'whitespace-nowrap @[300px]:text-sm text-[11px]'
              )}
            />
          </div>
        </div>

        {experiences.map((exp, index) => (
          <Card
            key={index}
            className={cn(
              'group relative transition-all duration-300',
              'bg-gradient-to-r from-cyan-500/5 via-cyan-500/10 to-blue-500/5',
              'border-2 border-cyan-500/30 backdrop-blur-md',
              'shadow-sm'
            )}
          >
            <div className="-left-3 -translate-y-1/2 absolute top-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="cursor-move rounded-lg bg-cyan-100/80 p-1.5 shadow-sm">
                <GripVertical className="h-4 w-4 text-cyan-600" />
              </div>
            </div>

            <CardContent className="space-y-3 p-3 sm:space-y-4 sm:p-4">
              {/* Header with Delete Button */}
              <div className="space-y-2 sm:space-y-3">
                {/* Position Title - Full Width */}
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="relative flex-1">
                    <Input
                      value={exp.position}
                      onChange={(e) =>
                        updateExperience(index, 'position', e.target.value)
                      }
                      className={cn(
                        'h-9 font-semibold text-sm tracking-tight',
                        'rounded-lg border-gray-200 bg-white/50',
                        'focus:border-cyan-500/40 focus:ring-2 focus:ring-cyan-500/20',
                        'transition-colors hover:border-cyan-500/30 hover:bg-white/60',
                        'placeholder:text-gray-400'
                      )}
                      placeholder="Position Title"
                    />
                    <div className="-top-2 absolute left-2 bg-white/80 px-1 font-medium text-[7px] text-gray-500 sm:text-[9px]">
                      POSITION
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExperience(index)}
                    className="text-gray-400 transition-colors duration-300 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Company and Location Row */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                  <div className="relative">
                    <Input
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(index, 'company', e.target.value)
                      }
                      className={cn(
                        'h-9 rounded-lg border-gray-200 bg-white/50 font-medium text-sm',
                        'focus:border-cyan-500/40 focus:ring-2 focus:ring-cyan-500/20',
                        'transition-colors hover:border-cyan-500/30 hover:bg-white/60',
                        'placeholder:text-gray-400'
                      )}
                      placeholder="Company Name"
                    />
                    <div className="-top-2 absolute left-2 bg-white/80 px-1 font-medium text-[7px] text-gray-500 sm:text-[9px]">
                      COMPANY
                    </div>
                  </div>
                  <div className="relative">
                    <Input
                      value={exp.location}
                      onChange={(e) =>
                        updateExperience(index, 'location', e.target.value)
                      }
                      className={cn(
                        'h-9 rounded-lg border-gray-200 bg-white/50',
                        'focus:border-cyan-500/40 focus:ring-2 focus:ring-cyan-500/20',
                        'transition-colors hover:border-cyan-500/30 hover:bg-white/60',
                        'placeholder:text-gray-400'
                      )}
                      placeholder="Location"
                    />
                    <div className="-top-2 absolute left-2 bg-white/80 px-1 font-medium text-[7px] text-gray-500 sm:text-[9px]">
                      LOCATION
                    </div>
                  </div>
                </div>

                {/* Dates Row */}
                <div className="group relative">
                  <Input
                    type="text"
                    value={exp.date}
                    onChange={(e) =>
                      updateExperience(index, 'date', e.target.value)
                    }
                    className={cn(
                      'h-9 w-full rounded-lg border-gray-200 bg-white/50',
                      'focus:border-cyan-500/40 focus:ring-2 focus:ring-cyan-500/20',
                      'transition-colors hover:border-cyan-500/30 hover:bg-white/60'
                    )}
                    placeholder="e.g., &apos;Jan 2023 - Present&apos; or &apos;2020 - 2022&apos;"
                  />
                  <div className="-top-2 absolute left-2 bg-white/80 px-1 font-medium text-[7px] text-gray-500 sm:text-[9px]">
                    DATE
                  </div>
                  <span className="ml-2 text-[8px] text-gray-500 sm:text-[10px]">
                    Use &apos;Present&apos; in the date field for current
                    positions
                  </span>
                </div>

                {/* Description Section */}
                <div className="space-y-3">
                  <Label className="font-medium text-[11px] text-gray-600 md:text-xs">
                    Key Responsibilities & Achievements
                  </Label>
                  <div className="space-y-2 pl-0">
                    {exp.description.map((desc, descIndex) => (
                      <div
                        key={descIndex}
                        className="group/item flex items-start gap-1"
                      >
                        <div className="flex-1">
                          <Tiptap
                            content={desc}
                            onChange={(newContent) => {
                              const updated = [...experiences];
                              updated[index].description[descIndex] =
                                newContent;
                              onChange(updated);

                              if (improvedPoints[index]?.[descIndex]) {
                                setImprovedPoints((prev) => {
                                  const newState = { ...prev };
                                  if (newState[index]) {
                                    delete newState[index][descIndex];
                                    if (
                                      Object.keys(newState[index]).length === 0
                                    ) {
                                      delete newState[index];
                                    }
                                  }
                                  return newState;
                                });
                              }
                            }}
                            className={cn(
                              'min-h-[60px] rounded-lg border-gray-200 bg-white/50 text-xs md:text-sm',
                              'focus:border-cyan-500/40 focus:ring-2 focus:ring-cyan-500/20',
                              'transition-colors hover:border-cyan-500/30 hover:bg-white/60',
                              'placeholder:text-gray-400',
                              improvedPoints[index]?.[descIndex] && [
                                'border-purple-400',
                                'bg-gradient-to-r from-purple-50/80 to-indigo-50/80',
                                'shadow-[0_0_15px_-3px_rgba(168,85,247,0.2)]',
                                'hover:bg-gradient-to-r hover:from-purple-50/90 hover:to-indigo-50/90',
                              ]
                            )}
                          />

                          {improvedPoints[index]?.[descIndex] && (
                            <div className="-top-2.5 absolute right-12 rounded-full bg-purple-100 px-2 py-0.5">
                              <span className="flex items-center gap-1 font-medium text-[10px] text-purple-600">
                                <Sparkles className="h-3 w-3" />
                                AI Suggestion
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          {improvedPoints[index]?.[descIndex] ? (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  // Remove the improvement state after accepting
                                  setImprovedPoints((prev) => {
                                    const newState = { ...prev };
                                    if (newState[index]) {
                                      delete newState[index][descIndex];
                                      if (
                                        Object.keys(newState[index]).length ===
                                        0
                                      ) {
                                        delete newState[index];
                                      }
                                    }
                                    return newState;
                                  });
                                }}
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
                                onClick={() =>
                                  undoImprovement(index, descIndex)
                                }
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
                                onClick={() => {
                                  const updated = [...experiences];
                                  updated[index].description = updated[
                                    index
                                  ].description.filter(
                                    (_, i) => i !== descIndex
                                  );
                                  onChange(updated);
                                }}
                                className="p-0 text-gray-400 transition-all duration-300 hover:text-red-500 group-hover/item:opacity-100"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>

                              {/* AI IMPROVEMENT */}
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        rewritePoint(index, descIndex)
                                      }
                                      disabled={
                                        loadingPointAI[index]?.[descIndex]
                                      }
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
                                      {loadingPointAI[index]?.[descIndex] ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Sparkles className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
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
                                      value={
                                        improvementConfig[index]?.[descIndex] ||
                                        ''
                                      }
                                      onChange={(value) =>
                                        setImprovementConfig((prev) => ({
                                          ...prev,
                                          [index]: {
                                            ...(prev[index] || {}),
                                            [descIndex]: value,
                                          },
                                        }))
                                      }
                                      onSubmit={() =>
                                        rewritePoint(index, descIndex)
                                      }
                                      isLoading={
                                        loadingPointAI[index]?.[descIndex]
                                      }
                                    />
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* AI Suggestions */}
                    <AISuggestions
                      suggestions={aiSuggestions[index] || []}
                      onApprove={(suggestion) =>
                        approveSuggestion(index, suggestion)
                      }
                      onDelete={(suggestionId) =>
                        deleteSuggestion(index, suggestionId)
                      }
                    />

                    {exp.description.length === 0 &&
                      !aiSuggestions[index]?.length && (
                        <div className="rounded-lg bg-gray-50/50 px-4 py-3 text-[11px] text-gray-500 italic md:text-xs">
                          Add points to describe your responsibilities and
                          achievements
                        </div>
                      )}
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updated = [...experiences];
                        updated[index].description = [
                          ...updated[index].description,
                          '',
                        ];
                        onChange(updated);
                      }}
                      className={cn(
                        'flex-1 text-[10px] text-cyan-600 transition-colors hover:text-cyan-700 sm:text-xs',
                        'border-cyan-200 hover:border-cyan-300 hover:bg-cyan-50/50'
                      )}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add Point
                    </Button>

                    {/* AI GENERATION SETTINGS */}
                    <AIGenerationSettingsTooltip
                      index={index}
                      loadingAI={loadingAI[index]}
                      generateAIPoints={generateAIPoints}
                      aiConfig={
                        aiConfig[index] || { numPoints: 3, customPrompt: '' }
                      }
                      onNumPointsChange={(value) =>
                        setAiConfig((prev) => ({
                          ...prev,
                          [index]: { ...prev[index], numPoints: value },
                        }))
                      }
                      onCustomPromptChange={(value) =>
                        setAiConfig((prev) => ({
                          ...prev,
                          [index]: { ...prev[index], customPrompt: value },
                        }))
                      }
                      colorClass={{
                        button: 'text-purple-600',
                        border: 'border-purple-200',
                        hoverBorder: 'hover:border-purple-300',
                        hoverBg: 'hover:bg-purple-50/50',
                        tooltipBg: 'bg-purple-50',
                        tooltipBorder: 'border-2 border-purple-300',
                        tooltipShadow: 'shadow-lg shadow-purple-100/50',
                        text: 'text-purple-600',
                        hoverText: 'hover:text-purple-700',
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}, areWorkExperiencePropsEqual);
