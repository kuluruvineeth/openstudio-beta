'use client';

import type { Education } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/design-system/components/ui/accordion';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input-v2';
import { Label } from '@repo/design-system/components/ui/label';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

interface ProfileEducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export function ProfileEducationForm({
  education,
  onChange,
}: ProfileEducationFormProps) {
  const addEducation = () => {
    onChange([
      ...education,
      {
        school: '',
        degree: '',
        field: '',
        location: '',
        date: '',
        gpa: undefined,
        achievements: [],
      },
    ]);
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: Education[typeof field]
  ) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <Accordion
        type="multiple"
        className="space-y-3"
        defaultValue={education.map((_, index) => `education-${index}`)}
      >
        {education.map((edu, index) => (
          <AccordionItem
            key={index}
            value={`education-${index}`}
            className="overflow-hidden rounded-md border border-indigo-500/30 bg-gradient-to-r from-indigo-500/5 via-indigo-500/10 to-blue-500/5 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-indigo-500/40 hover:shadow-lg"
          >
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex flex-1 items-center justify-between gap-3">
                <div className="flex-1 text-left font-medium text-indigo-900 text-sm">
                  {edu.degree ? `${edu.degree} ` : ''}
                  {edu.field ? `in ${edu.field} ` : ''}
                  {edu.school ? `at ${edu.school}` : 'New Education'}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  {edu.date && <span>{edu.date}</span>}
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 px-4 pt-2 pb-4">
                {/* School Name and Delete Button Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="group relative flex-1">
                    <Input
                      value={edu.school}
                      onChange={(e) =>
                        updateEducation(index, 'school', e.target.value)
                      }
                      className="h-8 rounded-md border-gray-200 bg-white/50 text-base transition-colors placeholder:text-gray-400 hover:border-indigo-500/30 hover:bg-white/60 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20"
                      placeholder="Institution Name"
                    />
                    <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[9px] text-indigo-700">
                      INSTITUTION
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(index)}
                    className="h-8 w-8 text-gray-400 transition-colors duration-300 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Location */}
                <div className="group relative">
                  <Input
                    value={edu.location}
                    onChange={(e) =>
                      updateEducation(index, 'location', e.target.value)
                    }
                    className="h-8 rounded-md border-gray-200 bg-white/50 text-sm transition-colors placeholder:text-gray-400 hover:border-indigo-500/30 hover:bg-white/60 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20"
                    placeholder="City, Country"
                  />
                  <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[9px] text-indigo-700">
                    LOCATION
                  </div>
                </div>

                {/* Degree and Field Row */}
                <div className="flex flex-col gap-3 md:flex-row md:items-start">
                  <div className="group relative flex-1">
                    <Input
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(index, 'degree', e.target.value)
                      }
                      className="h-8 rounded-md border-gray-200 bg-white/50 text-sm transition-colors placeholder:text-gray-400 hover:border-indigo-500/30 hover:bg-white/60 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20"
                      placeholder="Bachelor's, Master's, etc."
                    />
                    <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[9px] text-indigo-700">
                      DEGREE
                    </div>
                  </div>
                  <div className="group relative flex-1">
                    <Input
                      value={edu.field}
                      onChange={(e) =>
                        updateEducation(index, 'field', e.target.value)
                      }
                      className="h-8 rounded-md border-gray-200 bg-white/50 text-sm transition-colors placeholder:text-gray-400 hover:border-indigo-500/30 hover:bg-white/60 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20"
                      placeholder="Field of Study"
                    />
                    <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[9px] text-indigo-700">
                      FIELD OF STUDY
                    </div>
                  </div>
                </div>

                {/* Date and GPA Row */}
                <div className="flex flex-col gap-3 md:flex-row md:items-start">
                  <div className="group relative flex-1">
                    <Input
                      type="text"
                      value={edu.date}
                      onChange={(e) =>
                        updateEducation(index, 'date', e.target.value)
                      }
                      className="h-8 rounded-md border-gray-200 bg-white/50 text-sm transition-colors placeholder:text-gray-400 hover:border-indigo-500/30 hover:bg-white/60 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20"
                      placeholder="e.g., '2019 - 2023' or '2020 - Present'"
                    />
                    <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[9px] text-indigo-700">
                      DATE
                    </div>
                  </div>
                  <div className="group relative md:w-1/3">
                    <Input
                      type="text"
                      value={edu.gpa || ''}
                      onChange={(e) =>
                        updateEducation(
                          index,
                          'gpa',
                          e.target.value || undefined
                        )
                      }
                      className="h-8 rounded-md border-gray-200 bg-white/50 text-sm transition-colors placeholder:text-gray-400 hover:border-indigo-500/30 hover:bg-white/60 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20"
                      placeholder="0.00"
                    />
                    <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[9px] text-indigo-700">
                      GPA (OPTIONAL)
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <Label className="font-medium text-indigo-700 text-xs">
                      Achievements & Activities
                    </Label>
                    <span className="text-[9px] text-gray-500">
                      One achievement per line
                    </span>
                  </div>
                  <Textarea
                    value={edu.achievements?.join('\n')}
                    onChange={(e) =>
                      updateEducation(
                        index,
                        'achievements',
                        e.target.value.split('\n').filter(Boolean)
                      )
                    }
                    placeholder="• Dean's List 2020-2021&#10;• President of Computer Science Club&#10;• First Place in Hackathon 2022"
                    className="min-h-[100px] rounded-md border-gray-200 bg-white/50 text-sm transition-colors placeholder:text-gray-400 hover:border-indigo-500/30 hover:bg-white/60 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button
        variant="outline"
        onClick={addEducation}
        className="h-8 w-full border-indigo-500/30 border-dashed bg-gradient-to-r from-indigo-500/5 via-indigo-500/10 to-blue-500/5 text-indigo-700 text-sm transition-all duration-300 hover:border-indigo-500/40 hover:from-indigo-500/10 hover:via-indigo-500/15 hover:to-blue-500/10 hover:text-indigo-800"
      >
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add Education
      </Button>
    </div>
  );
}
