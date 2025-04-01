'use client';

import Tiptap from '@/app/(organization)/resume/components/tiptap';
import type { Education, Profile } from '@/types';
import { Button } from '@repo/design-system/components/ui/button';
import { Card, CardContent } from '@repo/design-system/components/ui/card';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import { cn } from '@repo/design-system/lib/utils';
import { Plus, Trash2 } from 'lucide-react';
import { memo } from 'react';
import { ImportFromProfileDialog } from '../../management/dialogs/import-from-profile-dialog';

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
  profile: Profile;
}

function areEducationPropsEqual(
  prevProps: EducationFormProps,
  nextProps: EducationFormProps
) {
  return (
    JSON.stringify(prevProps.education) ===
      JSON.stringify(nextProps.education) &&
    prevProps.profile.id === nextProps.profile.id
  );
}

export const EducationForm = memo(function EducationFormComponent({
  education,
  onChange,
  profile,
}: EducationFormProps) {
  const addEducation = () => {
    onChange([
      {
        school: '',
        degree: '',
        field: '',
        location: '',
        date: '',
        gpa: undefined,
        achievements: [],
      },
      ...education,
    ]);
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: Education[keyof Education]
  ) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  const handleImportFromProfile = (importedEducation: Education[]) => {
    onChange([...importedEducation, ...education]);
  };

  return (
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
            className={cn(
              'h-9 min-w-[120px] flex-1',
              'bg-gradient-to-r from-indigo-500/5 via-indigo-500/10 to-blue-500/5',
              'hover:from-indigo-500/10 hover:via-indigo-500/15 hover:to-blue-500/10',
              'border-2 border-indigo-500/30 border-dashed hover:border-indigo-500/40',
              'text-indigo-700 hover:text-indigo-800',
              'transition-all duration-300',
              'rounded-xl',
              'whitespace-nowrap @[300px]:text-sm text-[11px]'
            )}
            onClick={addEducation}
          >
            <Plus className="mr-2 h-4 w-4 shrink-0" />
            Add Education
          </Button>

          <ImportFromProfileDialog<Education>
            profile={profile}
            onImport={handleImportFromProfile}
            type="education"
            buttonClassName={cn(
              'mb-0 h-9 min-w-[120px] flex-1',
              'whitespace-nowrap @[300px]:text-sm text-[11px]',
              'bg-gradient-to-r from-indigo-500/5 via-indigo-500/10 to-blue-500/5',
              'hover:from-indigo-500/10 hover:via-indigo-500/15 hover:to-blue-500/10',
              'border-2 border-indigo-500/30 border-dashed hover:border-indigo-500/40',
              'text-indigo-700 hover:text-indigo-800'
            )}
          />
        </div>
      </div>

      {education.map((edu, index) => (
        <Card
          key={index}
          className={cn(
            'group relative transition-all duration-300',
            'bg-gradient-to-r from-indigo-500/5 via-indigo-500/10 to-blue-500/5',
            'border-2 border-indigo-500/30 backdrop-blur-md',
            'shadow-sm'
          )}
        >
          <CardContent className="space-y-3 p-3 sm:space-y-4 sm:p-4">
            <div className="space-y-2 sm:space-y-3">
              {/* School Name and Delete Button Row */}
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <div className="group relative min-w-0 flex-1">
                  <Input
                    value={edu.school}
                    onChange={(e) =>
                      updateEducation(index, 'school', e.target.value)
                    }
                    className={cn(
                      'h-9 font-semibold text-sm',
                      'rounded-lg border-gray-200 bg-white/50',
                      'focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20',
                      'transition-colors hover:border-indigo-500/30 hover:bg-white/60',
                      'placeholder:text-gray-400'
                    )}
                    placeholder="Institution Name"
                  />
                  <div className="-top-2 absolute left-2 bg-white/80 px-1 font-medium text-[7px] text-indigo-700 sm:text-[9px]">
                    INSTITUTION
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEducation(index)}
                  className="text-gray-400 transition-colors duration-300 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Location */}
              <div className="group relative">
                <Input
                  value={edu.location}
                  onChange={(e) =>
                    updateEducation(index, 'location', e.target.value)
                  }
                  className={cn(
                    'h-9 rounded-lg border-gray-200 bg-white/50',
                    'focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20',
                    'transition-colors hover:border-indigo-500/30 hover:bg-white/60',
                    'placeholder:text-gray-400',
                    'text-[10px] sm:text-xs'
                  )}
                  placeholder="City, Country"
                />
                <div className="-top-2 absolute left-2 bg-white/80 px-1 font-medium text-[7px] text-indigo-700 sm:text-[9px]">
                  LOCATION
                </div>
              </div>

              {/* Degree and Field Row */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                <div className="group relative">
                  <Input
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(index, 'degree', e.target.value)
                    }
                    className={cn(
                      'h-9 rounded-lg border-gray-200 bg-white/50',
                      'focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20',
                      'transition-colors hover:border-indigo-500/30 hover:bg-white/60',
                      'placeholder:text-gray-400',
                      'text-[10px] sm:text-xs'
                    )}
                    placeholder="Bachelor's, Master's, etc."
                  />
                  <div className="-top-2 absolute left-2 bg-white/80 px-1 font-medium text-[7px] text-indigo-700 sm:text-[9px]">
                    DEGREE
                  </div>
                </div>
                <div className="group relative">
                  <Input
                    value={edu.field}
                    onChange={(e) =>
                      updateEducation(index, 'field', e.target.value)
                    }
                    className={cn(
                      'h-9 rounded-lg border-gray-200 bg-white/50',
                      'focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20',
                      'transition-colors hover:border-indigo-500/30 hover:bg-white/60',
                      'placeholder:text-gray-400',
                      'text-[10px] sm:text-xs'
                    )}
                    placeholder="Field of Study"
                  />
                  <div className="-top-2 absolute left-2 bg-white/80 px-1 font-medium text-[7px] text-indigo-700 sm:text-[9px]">
                    FIELD OF STUDY
                  </div>
                </div>
              </div>

              {/* Dates Row */}
              <div className="group relative">
                <Input
                  type="text"
                  value={edu.date}
                  onChange={(e) =>
                    updateEducation(index, 'date', e.target.value)
                  }
                  className={cn(
                    'h-9 w-full rounded-lg border-gray-200 bg-white/50',
                    'focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20',
                    'transition-colors hover:border-indigo-500/30 hover:bg-white/60',
                    'text-[10px] sm:text-xs'
                  )}
                  placeholder="e.g., &apos;2018 - 2022&apos; or &apos;2022 - Present&apos;"
                />
                <div className="-top-2 absolute left-2 bg-white/80 px-1 font-medium text-[7px] text-indigo-700 sm:text-[9px]">
                  DATE
                </div>
              </div>

              {/* Current Status Note */}
              <div className="-mt-1 flex items-center space-x-2">
                <span className="text-[8px] text-gray-500 sm:text-[10px]">
                  Use &apos;Present&apos; in the date field for current
                  education
                </span>
              </div>

              {/* GPA */}
              <div className="group relative w-full sm:w-1/2 lg:w-1/3">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  value={edu.gpa || ''}
                  onChange={(e) =>
                    updateEducation(
                      index,
                      'gpa',
                      e.target.value
                        ? Number.parseFloat(e.target.value)
                        : undefined
                    )
                  }
                  className={cn(
                    'h-9 rounded-lg border-gray-200 bg-white/50',
                    'focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20',
                    'transition-colors hover:border-indigo-500/30 hover:bg-white/60',
                    'placeholder:text-gray-400',
                    'text-[10px] sm:text-xs'
                  )}
                  placeholder="0.00"
                />
                <div className="-top-2 absolute left-2 bg-white/80 px-1 font-medium text-[7px] text-indigo-700 sm:text-[9px]">
                  GPA (OPTIONAL)
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <Label className="font-medium text-[10px] text-indigo-700 sm:text-xs">
                    Achievements & Activities
                  </Label>
                  <span className="text-[8px] text-gray-500 sm:text-[10px]">
                    One achievement per line
                  </span>
                </div>
                <Tiptap
                  content={(edu.achievements || []).join('\n')}
                  onChange={(newContent) =>
                    updateEducation(
                      index,
                      'achievements',
                      newContent.split('\n').filter(Boolean)
                    )
                  }
                  editorProps={{
                    attributes: {
                      placeholder:
                        "• Dean's List 2020-2021\n• President of Computer Science Club\n• First Place in Hackathon 2022",
                    },
                  }}
                  className={cn(
                    'min-h-[120px] rounded-lg border-gray-200 bg-white/50',
                    'focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20',
                    'transition-colors hover:border-indigo-500/30 hover:bg-white/60',
                    'placeholder:text-gray-400',
                    'text-[10px] sm:text-xs'
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}, areEducationPropsEqual);
