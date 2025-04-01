'use client';

import type { Education, Profile, Project, WorkExperience } from '@/types';
import { Button } from '@repo/design-system/components/ui/button';
import { cn } from '@repo/design-system/lib/utils';
import { Briefcase, Code, GraduationCap, Pencil, User } from 'lucide-react';
import Link from 'next/link';

interface ProfileRowProps {
  profile: Profile;
}

export function ProfileRow({ profile }: ProfileRowProps) {
  return (
    <div className="group relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-100/20 via-rose-100/20 to-teal-100/20 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

      <div className="group-hover:-translate-y-0.5 relative rounded-xl border border-white/40 bg-gradient-to-br from-white/60 to-white/30 shadow-lg backdrop-blur-xl transition-all duration-500 hover:from-white/70 hover:to-white/40 group-hover:shadow-xl">
        <div className="px-4 py-3 sm:px-6">
          {/* Main container - stack on mobile, row on desktop */}
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            {/* Left section with avatar, name and stats */}
            <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-center">
              {/* Avatar and Name group */}
              <div className="flex items-center gap-4">
                {/* Enhanced Avatar Circle */}
                <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 p-[2px] shadow-xl transition-all duration-500 group-hover:shadow-teal-500/25">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-white to-white/90 p-1.5">
                    <User className="h-5 w-5 text-teal-600/80" />
                  </div>
                </div>

                {/* Name with enhanced gradient */}
                <h3 className="whitespace-nowrap bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600 bg-clip-text font-semibold text-lg text-transparent">
                  {profile.firstName} {profile.lastName}
                </h3>
              </div>

              {/* Stats Row - hidden on mobile, visible on sm and up */}
              <div className="hidden items-center gap-3 sm:flex">
                {[
                  {
                    icon: Briefcase,
                    label: 'Experience',
                    count: (profile.workExperience as WorkExperience[]).length,
                    colors: {
                      bg: 'from-cyan-50/50 to-cyan-100/50',
                      text: 'text-cyan-700',
                      iconBg: 'bg-cyan-100',
                      border: 'border-cyan-200',
                    },
                  },
                  {
                    icon: GraduationCap,
                    label: 'Education',
                    count: (profile.education as Education[]).length,
                    colors: {
                      bg: 'from-indigo-50/50 to-indigo-100/50',
                      text: 'text-indigo-700',
                      iconBg: 'bg-indigo-100',
                      border: 'border-indigo-200',
                    },
                  },
                  {
                    icon: Code,
                    label: 'Projects',
                    count: (profile.projects as Project[]).length,
                    colors: {
                      bg: 'from-violet-50/50 to-violet-100/50',
                      text: 'text-violet-700',
                      iconBg: 'bg-violet-100',
                      border: 'border-violet-200',
                    },
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={cn(
                      'flex items-center gap-2 rounded-full px-2.5 py-1',
                      'border bg-gradient-to-r backdrop-blur-sm',
                      'transition-all duration-500 hover:shadow-sm',
                      'hover:-translate-y-0.5',
                      stat.colors.bg,
                      stat.colors.border
                    )}
                  >
                    <div
                      className={cn(
                        'rounded-full p-1 transition-transform duration-300',
                        stat.colors.iconBg,
                        'group-hover:scale-110'
                      )}
                    >
                      <stat.icon className={cn('h-3 w-3', stat.colors.text)} />
                    </div>
                    <span className="whitespace-nowrap text-sm">
                      <span className={cn('font-semibold', stat.colors.text)}>
                        {stat.count}
                      </span>
                      <span className="ml-1.5 text-muted-foreground">
                        {stat.label}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit Button with enhanced styling */}
            <Link href="/resume/profile" className="shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="hover:-translate-y-0.5 w-full border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 shadow-sm transition-all duration-500 hover:border-teal-300 hover:bg-gradient-to-r hover:from-teal-100 hover:to-cyan-100 hover:shadow-md sm:w-auto"
              >
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
