'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Card } from '@repo/design-system/components/ui/card';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';

export function TubeFeatures() {
  return (
    <div className="relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-50/30 via-orange-50/20 to-red-50/30" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <Card className="relative overflow-hidden rounded-3xl border-white/40 bg-white/60 p-8 shadow-2xl backdrop-blur-2xl">
        {/* Decorative gradient blobs */}
        <div className="-translate-y-1/2 absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-gradient-to-br from-amber-400/10 via-orange-400/10 to-red-400/10 blur-3xl" />
        <div className="-translate-x-1/2 absolute bottom-0 left-0 h-[500px] w-[500px] translate-y-1/2 rounded-full bg-gradient-to-tr from-red-400/10 via-amber-400/10 to-orange-400/10 blur-3xl" />

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
                <div className="-inset-1 absolute rounded-full bg-gradient-to-r from-amber-600 to-orange-600 opacity-75 blur" />
                <div className="relative rounded-full bg-white p-4">
                  <PlayCircle className="h-12 w-12 text-amber-600" />
                  <motion.div
                    className="-top-1 -right-1 absolute rounded-full bg-gradient-to-r from-orange-500 to-red-500 p-1"
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

            <h2 className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text font-bold text-4xl text-transparent">
              Open Studio Tube
            </h2>

            <div className="mt-8 flex justify-center">
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                Coming Soon
              </Button>
            </div>
          </motion.div>

          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <h3 className="font-semibold text-2xl text-gray-800">
                Work in Progress
              </h3>
              <p className="mt-2 text-gray-600">
                We'll update you soon when it's ready!
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
