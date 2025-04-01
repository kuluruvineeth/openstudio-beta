import { Label } from '@repo/design-system/components/ui/label';
import { cn } from '@repo/design-system/lib/utils';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  isInvalid: boolean;
}

export function JobDescriptionInput({
  value,
  onChange,
  isInvalid,
}: JobDescriptionInputProps) {
  return (
    <div className="space-y-3">
      <Label
        htmlFor="job-description"
        className="font-medium text-base text-pink-950"
      >
        Job Description <span className="text-red-500">*</span>
      </Label>
      <textarea
        id="job-description"
        placeholder="Paste the job description here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'min-h-[120px] w-full rounded-md border-gray-200 bg-white/80 text-base',
          'placeholder:text-gray-400 focus:border-pink-500 focus:ring-pink-500/20',
          'resize-y p-4',
          isInvalid && 'shake border-red-500'
        )}
        required
      />
    </div>
  );
}
