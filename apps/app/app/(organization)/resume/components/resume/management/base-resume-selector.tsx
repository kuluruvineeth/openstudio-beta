import type { Resume } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/components/ui/select';
import { cn } from '@repo/design-system/lib/utils';

interface BaseResumeSelectorProps {
  baseResumes: Resume[];
  selectedResumeId: string;
  onResumeSelect: (value: string) => void;
  isInvalid?: boolean;
}

export function BaseResumeSelector({
  baseResumes,
  selectedResumeId,
  onResumeSelect,
  isInvalid,
}: BaseResumeSelectorProps) {
  return (
    <Select value={selectedResumeId} onValueChange={onResumeSelect}>
      <SelectTrigger
        id="base-resume"
        className={cn(
          'h-10 border-gray-200 bg-white/80 text-sm focus:border-pink-500 focus:ring-pink-500/20',
          isInvalid && 'shake border-red-500'
        )}
      >
        <SelectValue placeholder="Select a base resume" />
      </SelectTrigger>
      <SelectContent>
        {baseResumes?.map((resume) => (
          <SelectItem
            key={resume.id}
            value={resume.id}
            className="text-sm focus:bg-pink-50"
          >
            {resume.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
