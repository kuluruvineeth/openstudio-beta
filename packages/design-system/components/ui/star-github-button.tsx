'use client';

import { cn } from "@repo/design-system/lib/utils";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface StarGithubButtonProps {
  className?: string;
}

export function StarGithubButton({ className }: StarGithubButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('relative group', className)}
    >
      {/* Outer glow effect */}
      <div className="absolute -inset-[3px] bg-gradient-to-r from-amber-500/0 via-orange-500/0 to-red-500/0 rounded-lg opacity-75 blur-md group-hover:from-amber-500/50 group-hover:via-orange-500/50 group-hover:to-red-500/50 transition-all duration-300 ease-in-out" />
      
      {/* Inner gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-orange-400/0 to-red-400/0 rounded-lg opacity-100 group-hover:via-orange-400/10 transition-all duration-300 ease-in-out" />

      <a
        href="https://github.com/kuluruvineeth/openstudio-beta"
        className={cn(
          "relative flex items-center gap-1.5 px-4 py-1.5",
          "bg-gradient-to-r from-amber-500 to-orange-500",
          "hover:from-amber-500 hover:via-orange-500 hover:to-red-500",
          "text-white font-medium rounded-lg",
          "shadow-lg hover:shadow-xl hover:shadow-orange-500/20",
          "transition-all duration-300 ease-in-out",
          "hover:-translate-y-0.5",
          "text-sm"
        )}
      >
        <Star className="h-4 w-4 transition-transform duration-300 ease-in-out group-hover:scale-110" />
        <span className="transition-all duration-300 ease-in-out group-hover:translate-x-0.5">Star on Github</span>
      </a>
    </motion.div>
  );
} 