'use client';

import { Card } from '@repo/design-system/components/ui/card';
import { cn } from '@repo/design-system/lib/utils';
import { Sparkles } from 'lucide-react';

export function SuggestionSkeleton() {
  return (
    <Card
      className={cn(
        'group relative overflow-hidden',
        'p-4',
        'border-white/60 bg-gradient-to-br from-white/95 via-purple-50/30 to-indigo-50/40',
        'shadow-purple-500/10 shadow-xl',
        'backdrop-blur-xl'
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_14px] opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />

      {/* Floating Gradient Orbs */}
      <div className="-top-1/2 -right-1/2 absolute h-[150%] w-[150%] animate-float rounded-full bg-gradient-to-br from-purple-200/20 via-indigo-200/20 to-transparent opacity-60 blur-3xl" />
      <div className="-bottom-1/2 -left-1/2 absolute h-[150%] w-[150%] animate-float-delayed rounded-full bg-gradient-to-br from-indigo-200/20 via-purple-200/20 to-transparent opacity-60 blur-3xl" />

      {/* Content */}
      <div className="relative space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-gradient-to-br from-purple-100/90 to-indigo-100/90 p-1.5 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-purple-600" />
          </div>
          <div className="h-4 w-24 animate-pulse rounded bg-gradient-to-r from-purple-200/60 to-indigo-200/60" />
        </div>

        {/* Main Content */}
        <div className="space-y-3 rounded-lg border border-white/60 bg-gradient-to-br from-white/80 to-white/60 p-3 shadow-sm backdrop-blur-md">
          {/* Title Area */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-5 w-48 animate-pulse rounded bg-gradient-to-r from-gray-200 to-gray-100" />
              <div className="h-3 w-32 animate-pulse rounded bg-gradient-to-r from-gray-200 to-gray-100" />
            </div>
            <div className="h-3 w-16 animate-pulse rounded bg-gradient-to-r from-gray-200 to-gray-100" />
          </div>

          {/* Description Lines */}
          <div className="space-y-2 pt-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="mt-1.5 h-2 w-2 rounded-full bg-gray-200" />
                <div className="h-4 flex-1 animate-pulse rounded bg-gradient-to-r from-gray-200 to-gray-100" />
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-5 w-16 animate-pulse rounded-full bg-gradient-to-r from-gray-200 to-gray-100"
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-0.5">
          <div className="h-8 w-20 animate-pulse rounded-md bg-gradient-to-r from-rose-100 to-rose-50" />
          <div className="h-8 w-20 animate-pulse rounded-md bg-gradient-to-r from-emerald-100 to-emerald-50" />
        </div>
      </div>
    </Card>
  );
}
