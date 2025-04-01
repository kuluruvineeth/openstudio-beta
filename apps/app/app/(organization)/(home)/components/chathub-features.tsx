'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Card } from '@repo/design-system/components/ui/card';
import { motion } from 'framer-motion';
import {
  Bot,
  Brain,
  Globe,
  Library,
  Mic,
  PlugZap,
  Search,
  UserCog,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const features = [
  {
    icon: Brain,
    title: 'Diverse AI Models',
    description:
      'Access multiple language models of all major providers (OpenAI, Anthropic, Google, xAI, Perplexity, Groq, etc)',
    color: 'from-teal-500 to-emerald-500',
  },
  {
    icon: PlugZap,
    title: 'Extensible Plugin System',
    description: 'Unlock new functionalities with an expanding plugin library',
    color: 'from-green-500 to-lime-500',
  },
  {
    icon: Globe,
    title: 'Real-Time Web Search',
    description: 'Integrate live web data into conversations',
    color: 'from-cyan-500 to-teal-500',
  },
  {
    icon: UserCog,
    title: 'Tailored AI Assistants',
    description: 'Design agents for domain-specific tasks',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: Mic,
    title: 'Voice Input',
    description: 'Speak directly to interact with AI',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    icon: Bot,
    title: 'Seamless Data Management',
    description: 'Import/export conversations with ease',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: Library,
    title: 'Optimized Prompting',
    description: 'Utilize curated prompt templates for guided interactions',
    color: 'from-orange-500 to-amber-500',
  },
];

export function ChatHubFeatures() {
  const router = useRouter();

  return (
    <div className="relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-teal-50/30 via-emerald-50/20 to-green-50/30" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <Card className="relative overflow-hidden rounded-3xl border-white/40 bg-white/60 p-8 shadow-2xl backdrop-blur-2xl">
        {/* Decorative gradient blobs */}
        <div className="-translate-y-1/2 absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-gradient-to-br from-teal-400/10 via-emerald-400/10 to-green-400/10 blur-3xl" />
        <div className="-translate-x-1/2 absolute bottom-0 left-0 h-[500px] w-[500px] translate-y-1/2 rounded-full bg-gradient-to-tr from-green-400/10 via-teal-400/10 to-emerald-400/10 blur-3xl" />

        <div className="relative">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-12 text-center"
          >
            <motion.div
              className="mb-6 flex justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative">
                <div className="-inset-1 absolute rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 opacity-75 blur" />
                <div className="relative rounded-full bg-white p-4">
                  <Search className="h-12 w-12 text-teal-600" />
                  <motion.div
                    className="-right-1 -top-1 absolute rounded-full bg-gradient-to-r from-emerald-500 to-green-500 p-1"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 2,
                    }}
                  />
                </div>
              </div>
            </motion.div>

            <h2 className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 bg-clip-text font-bold text-4xl text-transparent">
              Open Studio ChatHub
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600 text-xl">
              AI-powered chat platform for seamless conversations
            </p>

            <div className="mt-8 flex justify-center">
              <Button
                className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                onClick={() => router.push('/chat')}
              >
                Try It Now
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group hover:-translate-y-1 relative overflow-hidden rounded-2xl border-white/40 bg-gradient-to-br from-white/80 to-white/60 p-6 transition-all duration-500 ease-out hover:border-white/60 hover:from-white/90 hover:to-white/70 hover:shadow-xl">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color}/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  />

                  <div className="relative flex items-start space-x-4">
                    <div
                      className={`rounded-xl bg-gradient-to-br ${feature.color} p-3 text-white shadow-lg`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
