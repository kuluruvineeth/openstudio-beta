'use client';

import type {
  Education,
  Profile,
  Project,
  Skill,
  WorkExperience,
} from '@/types';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Checkbox } from '@repo/design-system/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/design-system/components/ui/dialog';
import { ScrollArea } from '@repo/design-system/components/ui/scroll-area';
import { cn } from '@repo/design-system/lib/utils';
import { Import } from 'lucide-react';
import { useState } from 'react';

type ImportItem = WorkExperience | Project | Education | Skill;

interface ImportFromProfileDialogProps<T extends ImportItem> {
  profile: Profile;
  onImport: (items: T[]) => void;
  type: 'workExperience' | 'projects' | 'education' | 'skills';
  buttonClassName?: string;
}

export function ImportFromProfileDialog<T extends ImportItem>({
  profile,
  onImport,
  type,
  buttonClassName,
}: ImportFromProfileDialogProps<T>) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const items =
    type === 'workExperience'
      ? profile.workExperience
      : // biome-ignore lint/nursery/noNestedTernary: <explanation>
        type === 'projects'
        ? profile.projects
        : // biome-ignore lint/nursery/noNestedTernary: <explanation>
          type === 'education'
          ? profile.education
          : profile.skills;

  const title =
    type === 'workExperience'
      ? 'Work Experience'
      : // biome-ignore lint/nursery/noNestedTernary: <explanation>
        type === 'projects'
        ? 'Projects'
        : // biome-ignore lint/nursery/noNestedTernary: <explanation>
          type === 'education'
          ? 'Education'
          : 'Skills';

  const handleImport = () => {
    const itemsToImport = (items as ImportItem[]).filter((item: ImportItem) => {
      const id = getItemId(item);
      return selectedItems.includes(id);
    }) as T[];

    onImport(itemsToImport);
    setOpen(false);
    setSelectedItems([]);
  };

  const getItemId = (item: ImportItem): string => {
    if (type === 'workExperience') {
      const exp = item as WorkExperience;
      return `${exp.company}-${exp.position}-${exp.date}`;
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else if (type === 'projects') {
      return (item as Project).name;
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else if (type === 'education') {
      const edu = item as Education;
      return `${edu.school}-${edu.degree}-${edu.field}`;
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      return (item as Skill).category;
    }
  };

  const getItemTitle = (item: ImportItem): string => {
    if (type === 'workExperience') {
      return (item as WorkExperience).position;
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else if (type === 'projects') {
      return (item as Project).name;
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else if (type === 'education') {
      const edu = item as Education;
      return `${edu.degree} in ${edu.field}`;
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      return (item as Skill).category;
    }
  };

  const getItemSubtitle = (item: ImportItem): string | null => {
    if (type === 'workExperience') {
      return (item as WorkExperience).company;
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else if (type === 'projects') {
      return ((item as Project).technologies || []).join(', ');
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else if (type === 'education') {
      return (item as Education).school;
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      return null;
    }
  };

  const getItemDate = (item: ImportItem): string => {
    if (type === 'workExperience') {
      const exp = item as WorkExperience;
      return exp.date;
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else if (type === 'projects') {
      const proj = item as Project;
      return proj.date || '';
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else if (type === 'education') {
      const edu = item as Education;
      return edu.date;
    }
    return '';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'mb-6 h-16 w-full',
            'bg-gradient-to-r from-teal-500/5 via-teal-500/10 to-cyan-500/5',
            'hover:from-teal-500/10 hover:via-teal-500/15 hover:to-cyan-500/10',
            'border-2 border-teal-500/30 border-dashed hover:border-teal-500/40',
            'text-teal-700 hover:text-teal-800',
            'transition-all duration-300',
            'rounded-xl',
            buttonClassName
          )}
        >
          <Import className="mr-2 h-5 w-5" />
          Import from Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import {title}</DialogTitle>
          <DialogDescription>
            Select the {title.toLowerCase()} you want to import from your
            profile
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[400px]">
          <div className="space-y-4">
            {(items as ImportItem[]).map((item: ImportItem) => {
              const id = getItemId(item);
              return (
                <div
                  key={id}
                  className="flex items-start space-x-3 rounded-lg border border-gray-200 bg-white/50 p-4 transition-colors hover:bg-white/80"
                >
                  <Checkbox
                    id={id}
                    checked={selectedItems.includes(id)}
                    onCheckedChange={(checked) => {
                      setSelectedItems((prev) =>
                        checked ? [...prev, id] : prev.filter((x) => x !== id)
                      );
                    }}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={id}
                      className="cursor-pointer font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <div className="mb-1 font-semibold text-base">
                        {getItemTitle(item)}
                      </div>
                      {getItemSubtitle(item) && (
                        <div className="text-muted-foreground text-sm">
                          {getItemSubtitle(item)}
                        </div>
                      )}
                      {getItemDate(item) && (
                        <div className="mt-1 text-muted-foreground text-xs">
                          {getItemDate(item)}
                        </div>
                      )}
                      {type === 'skills' && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(item as Skill).items.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="border border-rose-200 bg-white/60 text-rose-700"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-gray-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={selectedItems.length === 0}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700"
          >
            Import Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
