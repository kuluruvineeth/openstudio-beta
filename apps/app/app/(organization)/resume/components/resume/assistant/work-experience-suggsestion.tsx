'use client';

import type { WorkExperience } from '@/types';
import { Card } from '@repo/design-system/components/ui/card';
import { cn } from '@repo/design-system/lib/utils';
import { useState } from 'react';

const DIFF_HIGHLIGHT_CLASSES = 'bg-green-300 px-1 rounded-sm';

interface WorkExperienceSuggestionProps {
  currentWork: WorkExperience;
  modifiedField: keyof WorkExperience;
  newValue: WorkExperience[keyof WorkExperience];
}

function getHighlightClass<T>(
  currentValue: T,
  newValue: T,
  fieldValue: T
): string {
  return JSON.stringify(currentValue) !== JSON.stringify(newValue) &&
    fieldValue === newValue
    ? DIFF_HIGHLIGHT_CLASSES
    : '';
}

export function WorkExperienceSuggestion({
  currentWork,
  modifiedField,
  newValue,
}: WorkExperienceSuggestionProps) {
  const [isExpanded] = useState(true);

  // Merge the modification with original work experience
  const suggestedWork = {
    ...currentWork,
    [modifiedField]: newValue,
  };

  // Safe description comparison
  const descriptionComparison = (
    current: string[] = [],
    suggested: string[] = []
  ) => {
    // Handle undefined/null cases and ensure arrays
    const safeCurrent = Array.isArray(current) ? current : [];
    const safeSuggested = Array.isArray(suggested) ? suggested : [];

    // biome-ignore lint/style/useDefaultParameterLast: <explanation>
    return safeSuggested.map((point = '', index) => {
      // Add default for point
      const currentPoint = safeCurrent[index] || '';
      const isNew = point !== currentPoint;

      return isNew
        ? `<span class="${DIFF_HIGHLIGHT_CLASSES}">${point}</span>`
        : point;
    });
  };

  const highlightedDescription =
    modifiedField === 'description'
      ? descriptionComparison(
          currentWork?.description ?? [],
          newValue as string[] // Type assertion since we know modifiedField='description'
        )
      : (currentWork.description ?? []);

  return (
    <Card
      className={cn(
        'group relative overflow-hidden',
        'border border-white/60',
        'bg-gradient-to-br from-white/95 via-purple-50/30 to-indigo-50/40',
        'shadow-purple-500/10 shadow-xl',
        'transition-all duration-500 ease-in-out',
        'hover:shadow-2xl hover:shadow-purple-500/20',
        'backdrop-blur-xl'
      )}
    >
      <div className="relative p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3
              className={cn(
                'font-bold text-base text-gray-900',
                getHighlightClass(
                  currentWork.position,
                  suggestedWork.position,
                  suggestedWork.position
                )
              )}
            >
              {suggestedWork.position}
            </h3>
            <p
              className={cn(
                'text-gray-700 text-xs',
                getHighlightClass(
                  currentWork.company,
                  suggestedWork.company,
                  suggestedWork.company
                )
              )}
            >
              {suggestedWork.company}
            </p>
          </div>
          <span
            className={cn(
              'text-[10px] text-gray-600',
              getHighlightClass(
                currentWork.date,
                suggestedWork.date,
                suggestedWork.date
              )
            )}
          >
            {suggestedWork.date}
          </span>
        </div>

        {/* Location */}
        {suggestedWork.location && (
          <p
            className={cn(
              'mt-1 text-gray-600 text-xs',
              getHighlightClass(
                currentWork.location,
                suggestedWork.location,
                suggestedWork.location
              )
            )}
          >
            {suggestedWork.location}
          </p>
        )}

        {/* Description */}
        {isExpanded && highlightedDescription && (
          <div className="mt-2 space-y-1.5">
            {highlightedDescription.map((point, index) => (
              <div key={index} className="flex items-start gap-1.5">
                <span className="mt-0.5 text-gray-800 text-xs">•</span>
                <p
                  className="text-gray-800 text-xs"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                  dangerouslySetInnerHTML={{
                    __html: point || 'No description provided',
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
