'use client';

import type { Profile, Skill } from '@/types';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Card, CardContent } from '@repo/design-system/components/ui/card';
import { Input } from '@repo/design-system/components/ui/input';
import { cn } from '@repo/design-system/lib/utils';
import { Plus, Trash2 } from 'lucide-react';
import { type KeyboardEvent, useState } from 'react';
import { ImportFromProfileDialog } from '../../management/dialogs/import-from-profile-dialog';

interface SkillsFormProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
  profile: Profile;
}

export function SkillsForm({ skills, onChange, profile }: SkillsFormProps) {
  const [newSkills, setNewSkills] = useState<{ [key: number]: string }>({});

  const addSkillCategory = () => {
    onChange([
      {
        category: '',
        items: [],
      },
      ...skills,
    ]);
  };

  const updateSkillCategory = (
    index: number,
    field: keyof Skill,
    value: string | string[]
  ) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeSkillCategory = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const addSkill = (categoryIndex: number) => {
    const skillToAdd = newSkills[categoryIndex]?.trim();
    if (!skillToAdd) return;

    const updated = [...skills];
    const currentItems = updated[categoryIndex].items || [];
    if (!currentItems.includes(skillToAdd)) {
      updated[categoryIndex] = {
        ...updated[categoryIndex],
        items: [...currentItems, skillToAdd],
      };
      onChange(updated);
    }
    setNewSkills({ ...newSkills, [categoryIndex]: '' });
  };

  const handleKeyPress = (
    e: KeyboardEvent<HTMLInputElement>,
    categoryIndex: number
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(categoryIndex);
    }
  };

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    const updated = skills.map((skill, idx) => {
      if (idx === categoryIndex) {
        return {
          ...skill,
          items: skill.items.filter((_, i) => i !== skillIndex),
        };
      }
      return skill;
    });
    onChange(updated);
  };

  const handleImportFromProfile = (importedSkills: Skill[]) => {
    onChange([...importedSkills, ...skills]);
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
              'bg-gradient-to-r from-rose-500/5 via-rose-500/10 to-pink-500/5',
              'hover:from-rose-500/10 hover:via-rose-500/15 hover:to-pink-500/10',
              'border-2 border-rose-500/30 border-dashed hover:border-rose-500/40',
              'text-rose-700 hover:text-rose-800',
              'transition-all duration-300',
              'rounded-xl',
              'whitespace-nowrap @[300px]:text-sm text-[11px]'
            )}
            onClick={addSkillCategory}
          >
            <Plus className="mr-2 h-4 w-4 shrink-0" />
            Add Skill Category
          </Button>

          <ImportFromProfileDialog<Skill>
            profile={profile}
            onImport={handleImportFromProfile}
            type="skills"
            buttonClassName={cn(
              'mb-0 h-9 min-w-[120px] flex-1',
              'whitespace-nowrap @[300px]:text-sm text-[11px]',
              'bg-gradient-to-r from-rose-500/5 via-rose-500/10 to-pink-500/5',
              'hover:from-rose-500/10 hover:via-rose-500/15 hover:to-pink-500/10',
              'border-2 border-rose-500/30 border-dashed hover:border-rose-500/40',
              'text-rose-700 hover:text-rose-800'
            )}
          />
        </div>
      </div>

      {skills.map((skill, index) => (
        <Card
          key={index}
          className={cn(
            'group relative transition-all duration-300',
            'bg-gradient-to-r from-rose-500/5 via-rose-500/10 to-pink-500/5',
            'border-2 border-rose-500/30 backdrop-blur-md',
            'shadow-sm'
          )}
        >
          <CardContent className="space-y-3 p-3 sm:space-y-4 sm:p-4">
            <div className="space-y-2 sm:space-y-3">
              {/* Category Name and Delete Button Row */}
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <div className="group relative flex-1">
                  <Input
                    value={skill.category}
                    onChange={(e) =>
                      updateSkillCategory(index, 'category', e.target.value)
                    }
                    className={cn(
                      'h-9 font-medium text-sm',
                      'rounded-lg border-gray-200 bg-white/50',
                      'focus:border-rose-500/40 focus:ring-2 focus:ring-rose-500/20',
                      'transition-colors hover:border-rose-500/30 hover:bg-white/60',
                      'placeholder:text-gray-400'
                    )}
                    placeholder="Category Name"
                  />
                  <div className="-top-2 absolute left-2 bg-white/80 px-1 font-medium text-[7px] text-rose-700 sm:text-[9px]">
                    CATEGORY
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSkillCategory(index)}
                  className="text-gray-400 transition-colors duration-300 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Skills Display */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {skill.items.map((item, skillIndex) => (
                    <Badge
                      key={skillIndex}
                      variant="secondary"
                      className={cn(
                        'border border-rose-200 bg-white/60 py-0.5 text-rose-700 hover:bg-white/80',
                        'group/badge cursor-default text-[10px] transition-all duration-300 sm:text-xs'
                      )}
                    >
                      {item}
                      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                      <button
                        onClick={() => removeSkill(index, skillIndex)}
                        className="ml-1.5 opacity-50 transition-opacity hover:text-red-500 hover:opacity-100"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>

                {/* New Skill Input */}
                <div className="group relative flex gap-2">
                  <Input
                    value={newSkills[index] || ''}
                    onChange={(e) =>
                      setNewSkills({ ...newSkills, [index]: e.target.value })
                    }
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    className={cn(
                      'h-9 rounded-lg border-gray-200 bg-white/50',
                      'focus:border-rose-500/40 focus:ring-2 focus:ring-rose-500/20',
                      'transition-colors hover:border-rose-500/30 hover:bg-white/60',
                      'placeholder:text-gray-400',
                      'text-[10px] sm:text-xs'
                    )}
                    placeholder="Type a skill and press Enter or click +"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSkill(index)}
                    className="h-9 bg-white/50 px-2 hover:bg-white/60"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <div className="-top-2 absolute left-2 bg-white/80 px-1 font-medium text-[7px] text-rose-700 sm:text-[9px]">
                    ADD SKILL
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
