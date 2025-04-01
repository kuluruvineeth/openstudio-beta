'use client';

import { generateProjectPoints, improveProject } from '@/actions/ai';
import { AIGenerationSettingsTooltip } from '@/app/(organization)/resume/components/resume/editor/components/ai-generation-tooltip';
import { ImportFromProfileDialog } from '@/app/(organization)/resume/components/resume/management/dialogs/import-from-profile-dialog';
import { AIImprovementPrompt } from '@/app/(organization)/resume/components/resume/shared/ai-improvement-prompt';
import { AISuggestions } from '@/app/(organization)/resume/components/resume/shared/ai-suggestions';
import Tiptap from '@/app/(organization)/resume/components/tiptap';
import type { Profile, Project } from '@/types';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Card, CardContent } from '@repo/design-system/components/ui/card';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip';
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
import { memo, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface AISuggestion {
  id: string;
  point: string;
}

interface ImprovedPoint {
  original: string;
  improved: string;
}

interface ImprovementConfig {
  [key: number]: { [key: number]: string }; // projectIndex -> pointIndex -> prompt
}

interface ProjectsFormProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
  profile: Profile;
}

function areProjectsPropsEqual(
  prevProps: ProjectsFormProps,
  nextProps: ProjectsFormProps
) {
  return (
    JSON.stringify(prevProps.projects) === JSON.stringify(nextProps.projects) &&
    prevProps.profile.id === nextProps.profile.id
  );
}

export const ProjectsForm = memo(function ProjectsFormComponent({
  projects,
  onChange,
  profile,
}: ProjectsFormProps) {
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
  const textareaRefs = useRef<{ [key: number]: HTMLTextAreaElement }>({});
  const [newTechnologies, setNewTechnologies] = useState<{
    [key: number]: string;
  }>({});

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

  const addProject = () => {
    onChange([
      {
        name: '',
        description: [],
        technologies: [],
        date: '',
        url: '',
        github_url: '',
      },
      ...projects,
    ]);
  };

  const updateProject = (
    index: number,
    field: keyof Project,
    value: Project[keyof Project]
  ) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeProject = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  const handleImportFromProfile = (importedProjects: Project[]) => {
    onChange([...importedProjects, ...projects]);
  };

  const generateAIPoints = async (index: number) => {
    const project = projects[index];
    const config = aiConfig[index] || { numPoints: 3, customPrompt: '' };
    setLoadingAI((prev) => ({ ...prev, [index]: true }));
    setPopoverOpen((prev) => ({ ...prev, [index]: false }));

    try {
      const result = await generateProjectPoints(
        profile.email ?? '',
        project.name,
        project.technologies || [],
        'Software Engineer',
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
    } catch (error: unknown) {
      setErrorMessage({
        title: 'Error',
        description: 'Failed to generate AI points. Please try again.',
      });
      setShowErrorDialog(true);
    } finally {
      setLoadingAI((prev) => ({ ...prev, [index]: false }));
    }
  };

  const approveSuggestion = (
    projectIndex: number,
    suggestion: AISuggestion
  ) => {
    const updated = [...projects];
    updated[projectIndex].description = [
      ...updated[projectIndex].description,
      suggestion.point,
    ];
    onChange(updated);

    // Remove the suggestion after approval
    setAiSuggestions((prev) => ({
      ...prev,
      [projectIndex]: prev[projectIndex].filter((s) => s.id !== suggestion.id),
    }));
  };

  const deleteSuggestion = (projectIndex: number, suggestionId: string) => {
    setAiSuggestions((prev) => ({
      ...prev,
      [projectIndex]: prev[projectIndex].filter((s) => s.id !== suggestionId),
    }));
  };

  const rewritePoint = async (projectIndex: number, pointIndex: number) => {
    const project = projects[projectIndex];
    const point = project.description[pointIndex];
    const customPrompt = improvementConfig[projectIndex]?.[pointIndex];

    setLoadingPointAI((prev) => ({
      ...prev,
      [projectIndex]: { ...(prev[projectIndex] || {}), [pointIndex]: true },
    }));

    try {
      const improvedPoint = await improveProject(
        profile.email ?? '',
        point,
        customPrompt
      );

      setImprovedPoints((prev) => ({
        ...prev,
        [projectIndex]: {
          ...(prev[projectIndex] || {}),
          [pointIndex]: {
            original: point,
            improved: improvedPoint,
          },
        },
      }));

      const updated = [...projects];
      updated[projectIndex].description[pointIndex] = improvedPoint;
      onChange(updated);
    } catch (error: unknown) {
      setErrorMessage({
        title: 'Error',
        description: 'Failed to improve point. Please try again.',
      });
      setShowErrorDialog(true);
    } finally {
      setLoadingPointAI((prev) => ({
        ...prev,
        [projectIndex]: { ...(prev[projectIndex] || {}), [pointIndex]: false },
      }));
    }
  };

  const undoImprovement = (projectIndex: number, pointIndex: number) => {
    const improvedPoint = improvedPoints[projectIndex]?.[pointIndex];
    if (improvedPoint) {
      const updated = [...projects];
      updated[projectIndex].description[pointIndex] = improvedPoint.original;
      onChange(updated);

      // Remove the improvement from state
      setImprovedPoints((prev) => {
        const newState = { ...prev };
        if (newState[projectIndex]) {
          delete newState[projectIndex][pointIndex];
          if (Object.keys(newState[projectIndex]).length === 0) {
            delete newState[projectIndex];
          }
        }
        return newState;
      });
    }
  };

  const addTechnology = (projectIndex: number) => {
    const techToAdd = newTechnologies[projectIndex]?.trim();
    if (!techToAdd) return;

    const updated = [...projects];
    const currentTechnologies = updated[projectIndex].technologies || [];

    if (!currentTechnologies.includes(techToAdd)) {
      updated[projectIndex] = {
        ...updated[projectIndex],
        technologies: [...currentTechnologies, techToAdd],
      };
      onChange(updated);
    }
    setNewTechnologies({ ...newTechnologies, [projectIndex]: '' });
  };

  const handleTechKeyPress = (
    e: KeyboardEvent<HTMLInputElement>,
    projectIndex: number
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology(projectIndex);
    }
  };

  const removeTechnology = (projectIndex: number, techIndex: number) => {
    const updated = [...projects];
    updated[projectIndex].technologies = (
      updated[projectIndex].technologies || []
    ).filter((_, i) => i !== techIndex);
    onChange(updated);
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
              onClick={addProject}
              className={cn(
                'h-9 min-w-[120px] flex-1',
                'bg-gradient-to-r from-violet-500/5 via-violet-500/10 to-purple-500/5',
                'hover:from-violet-500/10 hover:via-violet-500/15 hover:to-purple-500/10',
                'border-2 border-violet-500/30 border-dashed hover:border-violet-500/40',
                'text-violet-700 hover:text-violet-800',
                'transition-all duration-300',
                'rounded-xl',
                'whitespace-nowrap @[300px]:text-sm text-[11px]'
              )}
            >
              <Plus className="mr-2 h-4 w-4 shrink-0" />
              Add Project
            </Button>

            <ImportFromProfileDialog<Project>
              profile={profile}
              onImport={handleImportFromProfile}
              type="projects"
              buttonClassName={cn(
                'mb-0 h-9 min-w-[120px] flex-1',
                'bg-gradient-to-r from-violet-500/5 via-violet-500/10 to-purple-500/5',
                'hover:from-violet-500/10 hover:via-violet-500/15 hover:to-purple-500/10',
                'border-2 border-violet-500/30 border-dashed hover:border-violet-500/40',
                'text-violet-700 hover:text-violet-800',
                'transition-all duration-300',
                'rounded-xl',
                'whitespace-nowrap @[300px]:text-sm text-[11px]'
              )}
            />
          </div>
        </div>

        {projects.map((project, index) => (
          <Card
            key={index}
            className={cn(
              'group relative transition-all duration-300',
              'bg-gradient-to-r from-violet-500/5 via-violet-500/10 to-purple-500/5',
              'border-2 border-violet-500/30 backdrop-blur-md',
              'shadow-sm'
            )}
          >
            <div className="-left-3 -translate-y-1/2 absolute top-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="cursor-move rounded-lg bg-violet-100/80 p-1.5 shadow-sm">
                <GripVertical className="h-4 w-4 text-violet-600" />
              </div>
            </div>

            <CardContent className="space-y-3 p-3 sm:space-y-4 sm:p-4">
              {/* Header with Delete Button */}
              <div className="space-y-2 sm:space-y-3">
                {/* Project Name - Full Width */}
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="relative flex-1">
                    <Input
                      value={project.name}
                      onChange={(e) =>
                        updateProject(index, 'name', e.target.value)
                      }
                      className={cn(
                        'h-9 font-semibold text-sm tracking-tight',
                        'rounded-lg border-gray-200 bg-white/50',
                        'focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/20',
                        'transition-colors hover:border-violet-500/30 hover:bg-white/60',
                        'placeholder:text-gray-400'
                      )}
                      placeholder="Project Name"
                    />
                    <div className="-top-2 absolute left-2 bg-white/80 px-1 font-medium text-[7px] text-violet-700 sm:text-[9px]">
                      PROJECT NAME
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProject(index)}
                    className="text-gray-400 transition-colors duration-300 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* URLs Row */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                  <div className="relative">
                    <Input
                      value={project.url || ''}
                      onChange={(e) =>
                        updateProject(index, 'url', e.target.value)
                      }
                      className={cn(
                        'h-9 rounded-lg border-gray-200 bg-white/50 font-medium text-sm',
                        'focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/20',
                        'transition-colors hover:border-violet-500/30 hover:bg-white/60',
                        'placeholder:text-gray-400'
                      )}
                      placeholder="Live URL"
                    />
                    <div className="-top-2 absolute left-2 bg-white/80 px-1 font-medium text-[7px] text-violet-700 sm:text-[9px]">
                      LIVE URL
                    </div>
                  </div>
                  <div className="relative">
                    <Input
                      value={project.github_url || ''}
                      onChange={(e) =>
                        updateProject(index, 'github_url', e.target.value)
                      }
                      className={cn(
                        'h-9 rounded-lg border-gray-200 bg-white/50',
                        'focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/20',
                        'transition-colors hover:border-violet-500/30 hover:bg-white/60',
                        'placeholder:text-gray-400'
                      )}
                      placeholder="GitHub URL"
                    />
                    <div className="-top-2 absolute left-2 bg-white/80 px-1 font-medium text-[7px] text-violet-700 sm:text-[9px]">
                      GITHUB URL
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="group relative">
                  <Input
                    type="text"
                    value={project.date || ''}
                    onChange={(e) =>
                      updateProject(index, 'date', e.target.value)
                    }
                    className={cn(
                      'h-9 w-full rounded-lg border-gray-200 bg-white/50',
                      'focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/20',
                      'transition-colors hover:border-violet-500/30 hover:bg-white/60'
                    )}
                    placeholder="e.g., &apos;Jan 2023 - Present&apos; or &apos;2020 - 2022&apos;"
                  />
                  <div className="-top-2 absolute left-2 bg-white/80 px-1 font-medium text-[7px] text-violet-700 sm:text-[9px]">
                    DATE
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-2 sm:space-y-3">
                  <Label className="font-medium text-[10px] text-violet-700 sm:text-xs">
                    Key Features & Technical Achievements
                  </Label>
                  <div className="space-y-2 pl-0">
                    {project.description.map((desc, descIndex) => (
                      <div
                        key={descIndex}
                        className="group/item flex items-start gap-1"
                      >
                        <div className="flex-1">
                          <Tiptap
                            content={desc}
                            onChange={(newContent) => {
                              const updated = [...projects];
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
                              'focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/20',
                              'transition-colors hover:border-violet-500/30 hover:bg-white/60',
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
                                  const updated = [...projects];
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

                    {project.description.length === 0 &&
                      !aiSuggestions[index]?.length && (
                        <div className="rounded-lg bg-gray-50/50 px-4 py-3 text-[10px] text-gray-500 italic sm:text-xs">
                          Add points to describe your project&apos;s features
                          and achievements
                        </div>
                      )}
                  </div>

                  <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updated = [...projects];
                        updated[index].description = [
                          ...updated[index].description,
                          '',
                        ];
                        onChange(updated);
                      }}
                      className={cn(
                        'flex-1 text-[10px] text-violet-600 transition-colors hover:text-violet-700 sm:text-xs',
                        'border-violet-200 hover:border-violet-300 hover:bg-violet-50/50'
                      )}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add Point
                    </Button>

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
                        button: 'text-violet-600',
                        border: 'border-violet-200',
                        hoverBorder: 'hover:border-violet-300',
                        hoverBg: 'hover:bg-violet-50/50',
                        tooltipBg: 'bg-violet-50',
                        tooltipBorder: 'border-2 border-violet-300',
                        tooltipShadow: 'shadow-lg shadow-violet-100/50',
                        text: 'text-violet-600',
                        hoverText: 'hover:text-violet-700',
                      }}
                    />
                  </div>
                </div>

                {/* Technologies Section */}
                <div className="space-y-2 sm:space-y-3">
                  <Label className="font-medium text-[10px] text-violet-700 sm:text-xs">
                    Technologies & Tools Used
                  </Label>

                  <div className="space-y-2">
                    {/* Technologies Display */}
                    <div className="flex flex-wrap gap-1.5">
                      {(project.technologies || []).map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="secondary"
                          className={cn(
                            'border border-violet-200 bg-white/60 py-0.5 text-violet-700 hover:bg-white/80',
                            'group/badge cursor-default text-[10px] transition-all duration-300 sm:text-xs'
                          )}
                        >
                          {tech}
                          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                          <button
                            onClick={() => removeTechnology(index, techIndex)}
                            className="ml-1.5 opacity-50 transition-opacity hover:text-red-500 hover:opacity-100"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>

                    {/* New Technology Input */}
                    <div className="group relative flex gap-2">
                      <Input
                        value={newTechnologies[index] || ''}
                        onChange={(e) =>
                          setNewTechnologies({
                            ...newTechnologies,
                            [index]: e.target.value,
                          })
                        }
                        onKeyPress={(e) => handleTechKeyPress(e, index)}
                        className={cn(
                          'h-9 rounded-lg border-gray-200 bg-white/50',
                          'focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/20',
                          'transition-colors hover:border-violet-500/30 hover:bg-white/60',
                          'placeholder:text-gray-400',
                          'text-[10px] sm:text-xs'
                        )}
                        placeholder="Type a technology and press Enter or click +"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addTechnology(index)}
                        className="h-9 bg-white/50 px-2 hover:bg-white/60"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <div className="-top-2 absolute left-2 bg-white/80 px-1 font-medium text-[7px] text-violet-700 sm:text-[9px]">
                        ADD TECHNOLOGY
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}, areProjectsPropsEqual);
