'use client';

import { Card } from '@repo/design-system/components/ui/card';
import { motion } from 'framer-motion';
import { Construction, Sparkles } from 'lucide-react';

interface WorkInProgressProps {
  title?: string;
  description?: string;
}

export function WorkInProgress({ 
  title = "Work In Progress",
  description = "This feature is currently under development. Check back soon!"
}: WorkInProgressProps) {
  return (
    <div className="relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-50/30 via-purple-50/20 to-rose-50/30" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <Card className="relative overflow-hidden rounded-3xl border-white/40 bg-white/60 p-8 shadow-2xl backdrop-blur-2xl">
        {/* Decorative gradient blobs */}
        <div className="-translate-y-1/2 absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-gradient-to-br from-amber-400/10 via-purple-400/10 to-rose-400/10 blur-3xl" />
        <div className="-translate-x-1/2 absolute bottom-0 left-0 h-[500px] w-[500px] translate-y-1/2 rounded-full bg-gradient-to-tr from-rose-400/10 via-amber-400/10 to-purple-400/10 blur-3xl" />

        <div className="relative flex flex-col items-center justify-center space-y-6 py-12">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <Construction className="h-24 w-24 text-amber-500" />
            <motion.div
              animate={{ 
                rotate: [0, 15, -15, 0],
                y: [0, -4, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -right-4 -top-4"
            >
              <Sparkles className="h-8 w-8 text-purple-500" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h2 className="bg-gradient-to-r from-amber-600 via-purple-600 to-rose-600 bg-clip-text text-3xl font-bold text-transparent">
              {title}
            </h2>
            <p className="mt-2 text-gray-600">
              {description}
            </p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-amber-500/50"
                style={{
                  animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`
                }}
              />
            ))}
          </motion.div>
        </div>
      </Card>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}