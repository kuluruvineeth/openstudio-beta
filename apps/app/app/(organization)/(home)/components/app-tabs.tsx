'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/design-system/components/ui/tabs';
import {
  FileText,
  MessageSquareText,
  Mic2,
  ShoppingBag,
  Youtube,
} from 'lucide-react';
import { ArtifactsFeatures } from './artifacts-features';
import { ChatHubFeatures } from './chathub-features';
import { ResumeFeatures } from './resume-features';
import { TubeFeatures } from './tube-features';
import { VoiceFeatures } from './voice-features';
export function AppTabs() {
  return (
    <div className="relative mt-4">
      <Tabs defaultValue="voice" className="w-full">
        <TabsList className="relative flex h-full gap-2 overflow-x-auto whitespace-nowrap rounded-xl border border-white/40 bg-white/80 p-1 shadow-lg backdrop-blur-xl">
          <TabsTrigger
            value="voice"
            className="group relative flex items-center gap-2.5 rounded-xl px-5 py-3 font-medium transition-all duration-300 hover:bg-white/60 data-[state=active]:border-blue-500/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/10 data-[state=active]:to-cyan-500/10 data-[state=inactive]:text-gray-500 data-[state=active]:shadow-lg data-[state=inactive]:hover:text-gray-900"
          >
            <div className="rounded-full bg-blue-100/80 p-1.5 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:bg-blue-100">
              <Mic2 className="h-4 w-4 text-blue-600 transition-colors group-data-[state=inactive]:text-blue-500/70" />
            </div>
            <span className="relative">
              Voice
              <div className="-bottom-2 absolute right-0 left-0 h-0.5 scale-x-0 rounded-full bg-blue-500 transition-transform duration-300 group-data-[state=active]:scale-x-100" />
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="resume"
            className="group relative flex items-center gap-2.5 rounded-xl px-5 py-3 font-medium transition-all duration-300 hover:bg-white/60 data-[state=active]:border-purple-500/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/10 data-[state=active]:to-pink-500/10 data-[state=inactive]:text-gray-500 data-[state=active]:shadow-lg data-[state=inactive]:hover:text-gray-900"
          >
            <div className="rounded-full bg-purple-100/80 p-1.5 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:bg-purple-100">
              <FileText className="h-4 w-4 text-purple-600 transition-colors group-data-[state=inactive]:text-purple-500/70" />
            </div>
            <span className="relative">
              Resume
              <div className="-bottom-2 absolute right-0 left-0 h-0.5 scale-x-0 rounded-full bg-purple-500 transition-transform duration-300 group-data-[state=active]:scale-x-100" />
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="chathub"
            className="group relative flex items-center gap-2.5 rounded-xl px-5 py-3 font-medium transition-all duration-300 hover:bg-white/60 data-[state=active]:border-teal-500/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500/10 data-[state=active]:to-green-500/10 data-[state=inactive]:text-gray-500 data-[state=active]:shadow-lg data-[state=inactive]:hover:text-gray-900"
          >
            <div className="rounded-full bg-teal-100/80 p-1.5 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:bg-teal-100">
              <MessageSquareText className="h-4 w-4 text-teal-600 transition-colors group-data-[state=inactive]:text-teal-500/70" />
            </div>
            <span className="relative">
              ChatHub
              <div className="-bottom-2 absolute right-0 left-0 h-0.5 scale-x-0 rounded-full bg-teal-500 transition-transform duration-300 group-data-[state=active]:scale-x-100" />
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="tube"
            className="group relative flex items-center gap-2.5 rounded-xl px-5 py-3 font-medium transition-all duration-300 hover:bg-white/60 data-[state=active]:border-red-500/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/10 data-[state=active]:to-orange-500/10 data-[state=inactive]:text-gray-500 data-[state=active]:shadow-lg data-[state=inactive]:hover:text-gray-900"
          >
            <div className="rounded-full bg-red-100/80 p-1.5 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:bg-red-100">
              <Youtube className="h-4 w-4 text-red-600 transition-colors group-data-[state=inactive]:text-red-500/70" />
            </div>
            <span className="relative">
              Tube
              <div className="-bottom-2 absolute right-0 left-0 h-0.5 scale-x-0 rounded-full bg-red-500 transition-transform duration-300 group-data-[state=active]:scale-x-100" />
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="artifacts"
            className="group relative flex items-center gap-2.5 rounded-xl px-5 py-3 font-medium transition-all duration-300 hover:bg-white/60 data-[state=active]:border-emerald-500/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/10 data-[state=active]:to-teal-500/10 data-[state=inactive]:text-gray-500 data-[state=active]:shadow-lg data-[state=inactive]:hover:text-gray-900"
          >
            <div className="rounded-full bg-emerald-100/80 p-1.5 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:bg-emerald-100">
              <ShoppingBag className="h-4 w-4 text-emerald-600 transition-colors group-data-[state=inactive]:text-emerald-500/70" />
            </div>
            <span className="relative">
              Artifacts
              <div className="-bottom-2 absolute right-0 left-0 h-0.5 scale-x-0 rounded-full bg-emerald-500 transition-transform duration-300 group-data-[state=active]:scale-x-100" />
            </span>
          </TabsTrigger>
        </TabsList>

        <div className="relative mt-8">
          <TabsContent
            value="voice"
            className="fade-in-50 slide-in-from-bottom-2 animate-in duration-500"
          >
            <VoiceFeatures />
          </TabsContent>

          <TabsContent
            value="resume"
            className="fade-in-50 slide-in-from-bottom-2 animate-in duration-500"
          >
            <ResumeFeatures />
          </TabsContent>

          <TabsContent
            value="chathub"
            className="fade-in-50 slide-in-from-bottom-2 animate-in duration-500"
          >
            <ChatHubFeatures />
          </TabsContent>

          <TabsContent
            value="tube"
            className="fade-in-50 slide-in-from-bottom-2 animate-in duration-500"
          >
            <TubeFeatures />
          </TabsContent>

          <TabsContent
            value="artifacts"
            className="fade-in-50 slide-in-from-bottom-2 animate-in duration-500"
          >
            <ArtifactsFeatures />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
