'use client';

import type { WorkExperience } from '@/types';
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

interface ProfileWorkExperienceFormProps {
  experiences: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
}

export function ProfileWorkExperienceForm({
  experiences,
  onChange,
}: ProfileWorkExperienceFormProps) {
  const addExperience = () => {
    onChange([
      ...experiences,
      {
        company: '',
        position: '',
        location: '',
        date: '',
        description: [],
        technologies: [],
      },
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

  const [techInputs, setTechInputs] = React.useState<{ [key: number]: string }>(
    Object.fromEntries(
      experiences.map((exp, i) => [i, exp.technologies?.join(', ') || ''])
    )
  );

  React.useEffect(() => {
    setTechInputs(
      Object.fromEntries(
        experiences.map((exp, i) => [i, exp.technologies?.join(', ') || ''])
      )
    );
  }, [experiences]);

  return (
    <div className="space-y-3">
      <Accordion
        type="multiple"
        className="space-y-3"
        defaultValue={experiences.map((_, index) => `experience-${index}`)}
      >
        {experiences.map((exp, index) => (
          <AccordionItem
            key={index}
            value={`experience-${index}`}
            className="overflow-hidden rounded-md border border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 via-cyan-500/10 to-blue-500/5 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-cyan-500/40 hover:shadow-lg"
          >
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex flex-1 items-center justify-between gap-3">
                <div className="flex-1 text-left font-medium text-cyan-900 text-sm">
                  {exp.position || 'Untitled Position'}{' '}
                  {exp.company && `at ${exp.company}`}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  {exp.date && <span>{exp.date}</span>}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <span className="max-w-[200px] truncate">
                      {exp.technologies.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 px-4 pt-2 pb-4">
                {/* Position and Delete Button Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="group relative flex-1">
                    <Input
                      value={exp.position}
                      onChange={(e) =>
                        updateExperience(index, 'position', e.target.value)
                      }
                      className="h-8 rounded-md border-gray-200 bg-white/50 text-base transition-colors placeholder:text-gray-400 hover:border-cyan-500/30 hover:bg-white/60 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
                      placeholder="Position Title"
                    />
                    <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[9px] text-cyan-700">
                      POSITION
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(index)}
                    className="h-8 w-8 text-gray-400 transition-colors duration-300 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Company */}
                <div className="group relative">
                  <Input
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(index, 'company', e.target.value)
                    }
                    className="h-8 rounded-md border-gray-200 bg-white/50 text-sm transition-colors placeholder:text-gray-400 hover:border-cyan-500/30 hover:bg-white/60 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
                    placeholder="Company Name"
                  />
                  <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[9px] text-cyan-700">
                    COMPANY
                  </div>
                </div>

                {/* Date and Location Row */}
                <div className="flex flex-col gap-3 text-gray-600 md:flex-row md:items-start">
                  <div className="group relative md:w-1/3">
                    <Input
                      type="text"
                      value={exp.date}
                      onChange={(e) =>
                        updateExperience(index, 'date', e.target.value)
                      }
                      className="h-8 rounded-md border-gray-200 bg-white/50 text-sm transition-colors placeholder:text-gray-400 hover:border-cyan-500/30 hover:bg-white/60 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
                      placeholder="e.g., Jan 2024 - Present"
                    />
                    <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[9px] text-cyan-700">
                      DATE
                    </div>
                  </div>
                  <div className="group relative flex-1">
                    <Input
                      value={exp.location}
                      onChange={(e) =>
                        updateExperience(index, 'location', e.target.value)
                      }
                      className="h-8 rounded-md border-gray-200 bg-white/50 text-sm transition-colors placeholder:text-gray-400 hover:border-cyan-500/30 hover:bg-white/60 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
                      placeholder="e.g., Bengaluru, India"
                    />
                    <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[9px] text-cyan-700">
                      LOCATION
                    </div>
                  </div>
                </div>

                {/* Technologies */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <Label className="font-medium text-cyan-700 text-xs">
                      Technologies & Skills Used
                    </Label>
                    <span className="text-[9px] text-gray-500">
                      Separate with commas
                    </span>
                  </div>
                  <Input
                    value={techInputs[index] || ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setTechInputs((prev) => ({ ...prev, [index]: newValue }));

                      if (newValue.endsWith(',')) {
                        const technologies = newValue
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean);
                        updateExperience(index, 'technologies', technologies);
                      } else {
                        const technologies = newValue
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean);
                        updateExperience(index, 'technologies', technologies);
                      }
                    }}
                    onBlur={(e) => {
                      const technologies = e.target.value
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean);
                      updateExperience(index, 'technologies', technologies);
                      setTechInputs((prev) => ({
                        ...prev,
                        [index]: technologies.join(', '),
                      }));
                    }}
                    placeholder="Golang, Python, PyTorch, etc."
                    className="h-8 rounded-md border-gray-200 bg-white/50 text-sm transition-colors placeholder:text-gray-400 hover:border-cyan-500/30 hover:bg-white/60 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <Label className="font-medium text-cyan-700 text-xs">
                      Key Responsibilities & Achievements
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updated = [...experiences];
                        updated[index].description = [
                          ...updated[index].description,
                          '',
                        ];
                        onChange(updated);
                      }}
                      className="h-7 text-cyan-600 text-xs transition-colors hover:text-cyan-700"
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" />
                      Add Point
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {exp.description.map((desc, descIndex) => (
                      <div key={descIndex} className="flex items-start gap-2">
                        <div className="flex-1">
                          <Input
                            value={desc}
                            onChange={(e) => {
                              const updated = [...experiences];
                              updated[index].description[descIndex] =
                                e.target.value;
                              onChange(updated);
                            }}
                            placeholder="Start with a strong action verb"
                            className="h-8 rounded-md border-gray-200 bg-white/50 text-sm transition-colors placeholder:text-gray-400 hover:border-cyan-500/30 hover:bg-white/60 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated = [...experiences];
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
                    {exp.description.length === 0 && (
                      <div className="text-gray-500 text-xs italic">
                        Add points to describe your responsibilities and
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
        onClick={addExperience}
        className="h-8 w-full border-cyan-500/30 border-dashed bg-gradient-to-r from-cyan-500/5 via-cyan-500/10 to-blue-500/5 text-cyan-700 text-sm transition-all duration-300 hover:border-cyan-500/40 hover:from-cyan-500/10 hover:via-cyan-500/15 hover:to-blue-500/10 hover:text-cyan-800"
      >
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add Work Experience
      </Button>
    </div>
  );
}
