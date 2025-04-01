'use client';

import type { Skill } from '@/types';
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

interface ProfileSkillsFormProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

export function ProfileSkillsForm({
  skills,
  onChange,
}: ProfileSkillsFormProps) {
  const addSkill = () => {
    onChange([
      ...skills,
      {
        category: '',
        items: [],
      },
    ]);
  };

  const updateSkill = (
    index: number,
    field: keyof Skill,
    value: Skill[typeof field]
  ) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const [skillInputs, setSkillInputs] = React.useState<{
    [key: number]: string;
  }>(Object.fromEntries(skills.map((s, i) => [i, s.items?.join(', ') || ''])));

  React.useEffect(() => {
    setSkillInputs(
      Object.fromEntries(skills.map((s, i) => [i, s.items?.join(', ') || '']))
    );
  }, [skills]);

  return (
    <div className="space-y-3">
      <Accordion
        type="multiple"
        className="space-y-3"
        defaultValue={skills.map((_, index) => `skill-${index}`)}
      >
        {skills.map((skill, index) => (
          <AccordionItem
            key={index}
            value={`skill-${index}`}
            className="overflow-hidden rounded-md border border-rose-500/30 bg-gradient-to-r from-rose-500/5 via-rose-500/10 to-pink-500/5 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-rose-500/40 hover:shadow-lg"
          >
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex flex-1 items-center justify-between gap-3">
                <div className="flex-1 text-left font-medium text-rose-900 text-sm">
                  {skill.category || 'New Skill Category'}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  {skill.items && skill.items.length > 0 && (
                    <span className="max-w-[300px] truncate">
                      {skill.items.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 px-4 pt-2 pb-4">
                {/* Category and Delete Button Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="group relative flex-1">
                    <Input
                      value={skill.category}
                      onChange={(e) =>
                        updateSkill(index, 'category', e.target.value)
                      }
                      className="h-8 rounded-md border-gray-200 bg-white/50 text-base transition-colors placeholder:text-gray-400 hover:border-rose-500/30 hover:bg-white/60 focus:border-rose-500/40 focus:ring-1 focus:ring-rose-500/20"
                      placeholder="e.g., Programming Languages, Frameworks, Tools"
                    />
                    <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[9px] text-rose-700">
                      CATEGORY
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(index)}
                    className="h-8 w-8 text-gray-400 transition-colors duration-300 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Skills */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <Label className="font-medium text-rose-700 text-xs">
                      Skills
                    </Label>
                    <span className="text-[9px] text-gray-500">
                      Separate with commas
                    </span>
                  </div>
                  <Input
                    value={skillInputs[index] || ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setSkillInputs((prev) => ({
                        ...prev,
                        [index]: newValue,
                      }));

                      if (newValue.endsWith(',')) {
                        const items = newValue
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean);
                        updateSkill(index, 'items', items);
                      } else {
                        const items = newValue
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean);
                        updateSkill(index, 'items', items);
                      }
                    }}
                    onBlur={(e) => {
                      const items = e.target.value
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean);
                      updateSkill(index, 'items', items);
                      setSkillInputs((prev) => ({
                        ...prev,
                        [index]: items.join(', '),
                      }));
                    }}
                    placeholder="e.g., TypeScript, React, Node.js, AWS"
                    className="h-8 rounded-md border-gray-200 bg-white/50 text-sm transition-colors placeholder:text-gray-400 hover:border-rose-500/30 hover:bg-white/60 focus:border-rose-500/40 focus:ring-1 focus:ring-rose-500/20"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button
        variant="outline"
        onClick={addSkill}
        className="h-8 w-full border-rose-500/30 border-dashed bg-gradient-to-r from-rose-500/5 via-rose-500/10 to-pink-500/5 text-rose-700 text-sm transition-all duration-300 hover:border-rose-500/40 hover:from-rose-500/10 hover:via-rose-500/15 hover:to-pink-500/10 hover:text-rose-800"
      >
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add Skill Category
      </Button>
    </div>
  );
}
