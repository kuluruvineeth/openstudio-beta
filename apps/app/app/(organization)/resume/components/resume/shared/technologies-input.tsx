'use client';

import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import { cn } from '@repo/design-system/lib/utils';

interface TechnologiesInputProps {
  value: string[];
  onChange: (technologies: string[]) => void;
  label?: string;
  placeholder?: string;
}

export function TechnologiesInput({
  value,
  onChange,
  label = 'Technologies & Tools Used',
  placeholder = 'GoLang, PyTorch, React, etc.',
}: TechnologiesInputProps) {
  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-baseline justify-between">
        <Label className="font-medium text-[11px] text-gray-600 md:text-xs">
          {label}
        </Label>
        <span className="text-[7px] text-gray-500 md:text-[9px]">
          Separate with commas
        </span>
      </div>
      <Input
        value={value.join(', ')}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          )
        }
        placeholder={placeholder}
        className={cn(
          'rounded-lg border-gray-200 bg-white/50',
          'focus:border-cyan-500/40 focus:ring-2 focus:ring-cyan-500/20',
          'transition-colors hover:border-cyan-500/30 hover:bg-white/60',
          'placeholder:text-gray-400'
        )}
      />
    </div>
  );
}
