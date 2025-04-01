'use client';

import { TabsList, TabsTrigger } from '@repo/design-system/components/ui/tabs';
import {
  Briefcase,
  FolderGit2,
  GraduationCap,
  LayoutTemplate,
  User,
  Wrench,
} from 'lucide-react';

export function ResumeEditorTabs() {
  return (
    <>
      {/* Enhanced second row with Resume Score and Cover Letter */}
      <div className="my-2">
        <TabsList className="relative grid h-full w-full grid-cols-2 gap-0.5 overflow-hidden rounded-lg border border-white/40 bg-white/80 p-0.5 shadow-lg backdrop-blur-xl">
          {/* Resume Score */}
          <TabsTrigger
            value="resume-score"
            className="group relative flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all duration-300 hover:bg-white/60 data-[state=active]:border-emerald-500/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/10 data-[state=active]:to-teal-500/10 data-[state=inactive]:text-gray-500 data-[state=active]:shadow-md data-[state=inactive]:hover:text-gray-900"
          >
            <div className="rounded-md bg-emerald-100/80 p-1 transition-transform duration-300 group-data-[state=active]:scale-105 group-data-[state=active]:bg-emerald-100">
              {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
              <svg
                className="h-3.5 w-3.5 text-emerald-600 transition-colors group-data-[state=inactive]:text-emerald-500/70"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <span className="relative whitespace-nowrap text-sm">
              Resume Score
              <div className="-bottom-0.5 absolute right-0 left-0 h-0.5 scale-x-0 rounded-full bg-emerald-500 transition-transform duration-300 group-data-[state=active]:scale-x-100" />
            </span>
          </TabsTrigger>

          {/* Cover Letter */}
          <TabsTrigger
            value="cover-letter"
            className="group relative flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all duration-300 hover:bg-white/60 data-[state=active]:border-amber-500/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/10 data-[state=active]:to-orange-500/10 data-[state=inactive]:text-gray-500 data-[state=active]:shadow-md data-[state=inactive]:hover:text-gray-900"
          >
            <div className="rounded-md bg-amber-100/80 p-1 transition-transform duration-300 group-data-[state=active]:scale-105 group-data-[state=active]:bg-amber-100">
              {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
              <svg
                className="h-3.5 w-3.5 text-amber-600 transition-colors group-data-[state=inactive]:text-amber-500/70"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
            </div>
            <span className="relative whitespace-nowrap text-sm">
              Cover Letter
              <div className="-bottom-0.5 absolute right-0 left-0 h-0.5 scale-x-0 rounded-full bg-amber-500 transition-transform duration-300 group-data-[state=active]:scale-x-100" />
            </span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsList className="relative grid h-full w-full @[500px]:grid-cols-6 grid-cols-3 gap-0.5 overflow-hidden rounded-lg border border-white/40 bg-white/80 p-0.5 shadow-lg backdrop-blur-xl">
        {/* Basic Info Tab */}
        <TabsTrigger
          value="basic"
          className="group relative flex items-center gap-1.5 rounded-md px-2 py-1 font-medium transition-all duration-300 hover:bg-white/60 data-[state=active]:border-teal-500/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500/10 data-[state=active]:to-cyan-500/10 data-[state=inactive]:text-gray-500 data-[state=active]:shadow-md data-[state=inactive]:hover:text-gray-900"
        >
          <div className="rounded-md bg-teal-100/80 p-1 transition-transform duration-300 group-data-[state=active]:scale-105 group-data-[state=active]:bg-teal-100">
            <User className="h-3.5 w-3.5 text-teal-600 transition-colors group-data-[state=inactive]:text-teal-500/70" />
          </div>
          <span className="relative whitespace-nowrap text-xs">
            Basic Info
            <div className="-bottom-0.5 absolute right-0 left-0 h-0.5 scale-x-0 rounded-full bg-teal-500 transition-transform duration-300 group-data-[state=active]:scale-x-100" />
          </span>
        </TabsTrigger>

        {/* Work Tab */}
        <TabsTrigger
          value="work"
          className="group relative flex items-center gap-1.5 rounded-md px-2 py-1 font-medium transition-all duration-300 hover:bg-white/60 data-[state=active]:border-cyan-500/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/10 data-[state=active]:to-blue-500/10 data-[state=inactive]:text-gray-500 data-[state=active]:shadow-md data-[state=inactive]:hover:text-gray-900"
        >
          <div className="rounded-md bg-cyan-100/80 p-1 transition-transform duration-300 group-data-[state=active]:scale-105 group-data-[state=active]:bg-cyan-100">
            <Briefcase className="h-3.5 w-3.5 text-cyan-600 transition-colors group-data-[state=inactive]:text-cyan-500/70" />
          </div>
          <span className="relative whitespace-nowrap text-xs">
            Work
            <div className="-bottom-0.5 absolute right-0 left-0 h-0.5 scale-x-0 rounded-full bg-cyan-500 transition-transform duration-300 group-data-[state=active]:scale-x-100" />
          </span>
        </TabsTrigger>

        {/* Projects Tab */}
        <TabsTrigger
          value="projects"
          className="group relative flex items-center gap-1.5 rounded-md px-2 py-1 font-medium transition-all duration-300 hover:bg-white/60 data-[state=active]:border-violet-500/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/10 data-[state=active]:to-purple-500/10 data-[state=inactive]:text-gray-500 data-[state=active]:shadow-md data-[state=inactive]:hover:text-gray-900"
        >
          <div className="rounded-md bg-violet-100/80 p-1 transition-transform duration-300 group-data-[state=active]:scale-105 group-data-[state=active]:bg-violet-100">
            <FolderGit2 className="h-3.5 w-3.5 text-violet-600 transition-colors group-data-[state=inactive]:text-violet-500/70" />
          </div>
          <span className="relative whitespace-nowrap text-xs">
            Projects
            <div className="-bottom-0.5 absolute right-0 left-0 h-0.5 scale-x-0 rounded-full bg-violet-500 transition-transform duration-300 group-data-[state=active]:scale-x-100" />
          </span>
        </TabsTrigger>

        {/* Education Tab */}
        <TabsTrigger
          value="education"
          className="group relative flex items-center gap-1.5 rounded-md px-2 py-1 font-medium transition-all duration-300 hover:bg-white/60 data-[state=active]:border-indigo-500/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/10 data-[state=active]:to-blue-500/10 data-[state=inactive]:text-gray-500 data-[state=active]:shadow-md data-[state=inactive]:hover:text-gray-900"
        >
          <div className="rounded-md bg-indigo-100/80 p-1 transition-transform duration-300 group-data-[state=active]:scale-105 group-data-[state=active]:bg-indigo-100">
            <GraduationCap className="h-3.5 w-3.5 text-indigo-600 transition-colors group-data-[state=inactive]:text-indigo-500/70" />
          </div>
          <span className="relative whitespace-nowrap text-xs">
            Education
            <div className="-bottom-0.5 absolute right-0 left-0 h-0.5 scale-x-0 rounded-full bg-indigo-500 transition-transform duration-300 group-data-[state=active]:scale-x-100" />
          </span>
        </TabsTrigger>

        {/* Skills Tab */}
        <TabsTrigger
          value="skills"
          className="group relative flex items-center gap-1.5 rounded-md px-2 py-1 font-medium transition-all duration-300 hover:bg-white/60 data-[state=active]:border-rose-500/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500/10 data-[state=active]:to-pink-500/10 data-[state=inactive]:text-gray-500 data-[state=active]:shadow-md data-[state=inactive]:hover:text-gray-900"
        >
          <div className="rounded-md bg-rose-100/80 p-1 transition-transform duration-300 group-data-[state=active]:scale-105 group-data-[state=active]:bg-rose-100">
            <Wrench className="h-3.5 w-3.5 text-rose-600 transition-colors group-data-[state=inactive]:text-rose-500/70" />
          </div>
          <span className="relative whitespace-nowrap text-xs">
            Skills
            <div className="-bottom-0.5 absolute right-0 left-0 h-0.5 scale-x-0 rounded-full bg-rose-500 transition-transform duration-300 group-data-[state=active]:scale-x-100" />
          </span>
        </TabsTrigger>

        {/* Settings Tab */}
        <TabsTrigger
          value="settings"
          className="group relative flex items-center gap-1.5 rounded-md px-2 py-1 font-medium transition-all duration-300 hover:bg-white/60 data-[state=active]:border-gray-500/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500/10 data-[state=active]:to-slate-500/10 data-[state=inactive]:text-gray-500 data-[state=active]:shadow-md data-[state=inactive]:hover:text-gray-900"
        >
          <div className="rounded-md bg-gray-100/80 p-1 transition-transform duration-300 group-data-[state=active]:scale-105 group-data-[state=active]:bg-gray-100">
            <LayoutTemplate className="h-3.5 w-3.5 text-gray-600 transition-colors group-data-[state=inactive]:text-gray-500/70" />
          </div>
          <span className="relative whitespace-nowrap text-xs">
            Layout
            <div className="-bottom-0.5 absolute right-0 left-0 h-0.5 scale-x-0 rounded-full bg-gray-500 transition-transform duration-300 group-data-[state=active]:scale-x-100" />
          </span>
        </TabsTrigger>
      </TabsList>
    </>
  );
}
