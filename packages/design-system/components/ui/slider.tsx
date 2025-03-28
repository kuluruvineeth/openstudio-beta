"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@repo/design-system/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center rounded-lg overflow-hidden",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-6 w-full grow overflow-hidden rounded-lg bg-zinc-800/20 dark:bg-black/20">
      <SliderPrimitive.Range className="absolute h-full bg-transparent" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-6 w-4 p-1 bg-transparent rounded-r-md  transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-5 ">
      <div className="h-4 w-2 bg-zinc-600 dark:bg-zinc-400 rounded-md"></div>
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
