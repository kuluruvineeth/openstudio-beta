'use client';

import type { Project } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/design-system/components/ui/accordion';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input-v2';
import { Label } from '@repo/design-system/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import React from 'react';

interface ProfileProjectsFormProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export function ProfileProjectsForm({
  projects,
  onChange,
}: ProfileProjectsFormProps) {
  const [techInputs, setTechInputs] = React.useState<{ [key: number]: string }>(
    Object.fromEntries(
      projects.map((p, i) => [i, p.technologies?.join(', ') || ''])
    )
  );

  React.useEffect(() => {
    setTechInputs(
      Object.fromEntries(
        projects.map((p, i) => [i, p.technologies?.join(', ') || ''])
      )
    );
  }, [projects]);

  const addProject = () => {
    onChange([
      ...projects,
      {
        name: '',
        description: [],
        technologies: [],
        url: '',
        github_url: '',
        date: '',
      },
    ]);
  };

  const updateProject = (
    index: number,
    field: keyof Project,
    value: string | string[]
  ) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeProject = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <Accordion
        type="multiple"
        className="space-y-3"
        defaultValue={projects.map((_, index) => `project-${index}`)}
      >
        {projects.map((project, index) => (
          <AccordionItem
            key={index}
            value={`project-${index}`}
            className="overflow-hidden rounded-md border border-violet-500/30 bg-gradient-to-r from-violet-500/5 via-violet-500/10 to-purple-500/5 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-violet-500/40 hover:shadow-lg"
          >
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex flex-1 items-center justify-between gap-3">
                <div className="flex-1 text-left font-medium text-sm text-violet-900">
                  {project.name || 'Untitled Project'}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  {project.date && <span>{project.date}</span>}
                  {project.technologies && project.technologies.length > 0 && (
                    <span className="max-w-[200px] truncate">
                      {project.technologies.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 px-4 pt-2 pb-4">
                {/* Project Name and Delete Button Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="group relative flex-1">
                    <Input
                      value={project.name}
                      onChange={(e) =>
                        updateProject(index, 'name', e.target.value)
                      }
                      className="h-8 rounded-md border-gray-200 bg-white/50 text-base transition-colors placeholder:text-gray-400 hover:border-violet-500/30 hover:bg-white/60 focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20"
                      placeholder="Project Name"
                    />
                    <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[9px] text-violet-700">
                      PROJECT NAME
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProject(index)}
                    className="h-8 w-8 text-gray-400 transition-colors duration-300 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* URLs Row */}
                <div className="flex flex-col gap-3 text-gray-600 md:flex-row md:items-start">
                  <div className="group relative flex-1">
                    <Input
                      type="url"
                      value={project.url || ''}
                      onChange={(e) =>
                        updateProject(index, 'url', e.target.value)
                      }
                      className="h-8 rounded-md border-gray-200 bg-white/50 text-sm transition-colors placeholder:text-gray-400 hover:border-violet-500/30 hover:bg-white/60 focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20"
                      placeholder="https://your-project.com"
                    />
                    <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[9px] text-violet-700">
                      LIVE URL
                    </div>
                  </div>
                  <div className="group relative flex-1">
                    <Input
                      type="url"
                      value={project.github_url || ''}
                      onChange={(e) =>
                        updateProject(index, 'github_url', e.target.value)
                      }
                      className="h-8 rounded-md border-gray-200 bg-white/50 text-sm transition-colors placeholder:text-gray-400 hover:border-violet-500/30 hover:bg-white/60 focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20"
                      placeholder="https://github.com/username/project"
                    />
                    <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[9px] text-violet-700">
                      GITHUB URL
                    </div>
                  </div>
                </div>

                {/* Technologies */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <Label className="font-medium text-violet-700 text-xs">
                      Technologies & Tools Used
                    </Label>
                    <span className="text-[9px] text-gray-500">
                      Separate with commas
                    </span>
                  </div>
                  <Input
                    value={techInputs[index] || ''}
                    onChange={(e) => {
                      // Just update the input value directly - no processing
                      const newValue = e.target.value;
                      setTechInputs((prev) => ({ ...prev, [index]: newValue }));
                    }}
                    onKeyDown={(e) => {
                      // Process only when user hits Enter or Tab
                      if (e.key === 'Enter' || e.key === 'Tab') {
                        const technologies = e.currentTarget.value
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean);
                        updateProject(index, 'technologies', technologies);
                        setTechInputs((prev) => ({
                          ...prev,
                          [index]: technologies.join(', '),
                        }));
                      }
                    }}
                    onBlur={(e) => {
                      // Process on blur (when leaving the input)
                      const technologies = e.target.value
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean);
                      updateProject(index, 'technologies', technologies);
                      setTechInputs((prev) => ({
                        ...prev,
                        [index]: technologies.join(', '),
                      }));
                    }}
                    placeholder="React, TypeScript, Node.js, etc."
                    className="h-8 rounded-md border-gray-200 bg-white/50 text-sm transition-colors placeholder:text-gray-400 hover:border-violet-500/30 hover:bg-white/60 focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20"
                  />
                </div>

                {/* Dates Row */}
                <div className="group relative">
                  <Input
                    type="text"
                    value={project.date || ''}
                    onChange={(e) =>
                      updateProject(index, 'date', e.target.value)
                    }
                    className="h-8 w-full rounded-md border-gray-200 bg-white/50 text-sm transition-colors hover:border-violet-500/30 hover:bg-white/60 focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20"
                    placeholder="e.g., &apos;Jan 2023 - Present&apos; or &apos;Summer 2023&apos;"
                  />
                  <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[9px] text-violet-700">
                    DATE
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <Label className="font-medium text-violet-700 text-xs">
                      Description
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updated = [...projects];
                        updated[index].description = [
                          ...updated[index].description,
                          '',
                        ];
                        onChange(updated);
                      }}
                      className="h-7 text-violet-600 text-xs transition-colors hover:text-violet-700"
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" />
                      Add Point
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {project.description.map((desc, descIndex) => (
                      <div key={descIndex} className="flex items-start gap-2">
                        <div className="flex-1">
                          <Input
                            value={desc}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[index].description[descIndex] =
                                e.target.value;
                              onChange(updated);
                            }}
                            placeholder="Describe a key feature or achievement"
                            className="h-8 rounded-md border-gray-200 bg-white/50 text-sm transition-colors placeholder:text-gray-400 hover:border-violet-500/30 hover:bg-white/60 focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated = [...projects];
                            updated[index].description = updated[
                              index
                            ].description.filter((_, i) => i !== descIndex);
                            onChange(updated);
                          }}
                          className="h-8 w-8 text-gray-400 transition-colors duration-300 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                    {project.description.length === 0 && (
                      <div className="text-gray-500 text-xs italic">
                        Add points to describe your project&apos;s features and
                        achievements
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button
        variant="outline"
        className="h-8 w-full border-violet-500/30 border-dashed bg-gradient-to-r from-violet-500/5 via-violet-500/10 to-purple-500/5 text-sm text-violet-700 transition-all duration-300 hover:border-violet-500/40 hover:from-violet-500/10 hover:via-violet-500/15 hover:to-purple-500/10 hover:text-violet-800"
        onClick={addProject}
      >
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add Project
      </Button>
    </div>
  );
}
