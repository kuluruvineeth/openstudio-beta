'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Card } from '@repo/design-system/components/ui/card';
import { motion } from 'framer-motion';
import {
  FileText,
  MessageSquareText,
  Mic,
  ShoppingBag,
  Youtube,
} from 'lucide-react';
import Link from 'next/link';

interface AppInfo {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  color: string;
  status: 'live' | 'progress';
  link: string;
}

const apps: AppInfo[] = [
  {
    id: 'chathub',
    icon: MessageSquareText,
    title: 'Open Studio ChatHub',
    description: 'Where AI conversations take shape',
    features: [
      'Diverse AI Models',
      'Extensible Plugin System',
      'Real-Time Web Search',
      'Tailored AI Assistants',
      'Voice Input',
      'Seamless Data Management',
      'Optimized Prompting',
    ],
    color: 'from-blue-600 to-cyan-600',
    status: 'live',
    link: '/chathub',
  },
  {
    id: 'tube',
    icon: Youtube,
    title: 'Open Studio Tube',
    description: 'Your AI-powered YouTube Studio co-pilot',
    features: [
      'AI-Powered Comment Management',
      'Subscriber & Audience Insights',
      'Smart Video Optimization',
      'AI Subtitle & Dubbing',
      'Direct Publishing',
    ],
    color: 'from-red-600 to-orange-600',
    status: 'progress',
    link: '/tube',
  },
  {
    id: 'voice',
    icon: Mic,
    title: 'Open Studio Voice',
    description: 'Transform text into natural speech with advanced AI',
    features: [
      'Text-to-speech synthesis',
      'Voice conversion',
      'Audio generation from text',
      'Custom voice fine-tuning',
      'Multiple pre-trained voice models',
    ],
    color: 'from-purple-600 to-pink-600',
    status: 'progress',
    link: '/voice',
  },
  {
    id: 'artifacts',
    icon: ShoppingBag,
    title: 'Open Studio Artifacts',
    description: 'AI Marketplace - Create, sell, and use AI tools with ease',
    features: [
      'No-Code AI Creation',
      'Monetization',
      'AI Marketplace',
      'Fair Revenue Sharing',
      'Collaboration',
    ],
    color: 'from-emerald-600 to-teal-600',
    status: 'progress',
    link: '/artifacts',
  },
  {
    id: 'resume',
    icon: FileText,
    title: 'Open Studio Resume',
    description: 'AI-Powered Resume Builder',
    features: [
      'Resume Templates',
      'AI Content Suggestions',
      'Job-Specific Customization',
      'Cover Letter Generation',
      'PDF Export & Sharing',
      'Resume Score & Feedback',
    ],
    color: 'from-amber-600 to-yellow-600',
    status: 'live',
    link: '/resume',
  },
];

export function AppShowcase() {
  return (
    <div className="relative pb-12">
      <div className="mb-12 text-center">
        <motion.h1
          className="mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text font-bold text-4xl text-transparent md:text-5xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Open Studio Ecosystem
        </motion.h1>
        <motion.p
          className="mx-auto max-w-2xl text-gray-600 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          A suite of powerful AI tools to transform your digital experience
        </motion.p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {apps.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full overflow-hidden border border-gray-100 shadow-md transition-all duration-300 hover:shadow-xl">
              <div className={`bg-gradient-to-r ${app.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <app.icon className="h-10 w-10" />
                  {app.status === 'progress' && (
                    <span className="rounded-full bg-white/20 px-3 py-1 text-white text-xs">
                      Coming Soon
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-bold text-2xl">{app.title}</h3>
                <p className="mt-2 text-white/90">{app.description}</p>
              </div>

              <div className="p-6">
                <h4 className="mb-3 font-medium text-gray-500 text-sm">
                  FEATURES
                </h4>
                <ul className="space-y-2">
                  {app.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${app.color}`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  {app.status === 'live' ? (
                    <Link href={app.link}>
                      <Button
                        className={`w-full bg-gradient-to-r ${app.color} text-white hover:opacity-90`}
                      >
                        Try Now
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      disabled
                      className="w-full cursor-not-allowed bg-gray-100 text-gray-500"
                    >
                      Coming Soon
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
