import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@repo/design-system/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center gap-1 justify-center font-medium whitespace-nowrap rounded-md   transition-colors focus-visible:outline-none ",
  {
    variants: {
      variant: {
        default:
          "dark:bg-zinc-100 dark:text-zinc-800 text-white bg-zinc-800 hover:opacity-90",
        accent: "text-teal-600 bg-teal-600/10 hover:bg-teal-600/20",
        outlined:
          "dark:bg-zinc-800 dark:text-white text-zinc-800 bg-white outline outline-zinc-800/10  dark:outline-white/5  hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50",
        destructive:
           "bg-rose-500/80 dark:bg-rose-500/80 text-destructive-foreground hover:bg-red-500 dark:hover:opacity-90",
        bordered:
          "border border-zinc-800/10 dark:border-zinc-100/10 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100  opacity-80 hover:opacity-100",
        secondary:
           "bg-black/10 text-zinc-700 dark:text-zinc-100 opacity-90 hover:opacity-100  dark:bg-white/10",
         ghost:
          "hover:bg-black/10 dark:hover:bg-white/10 text-zinc-600 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-white",
         link: "text-zinc-600 text-zinc-400 underline-offset-4 hover:underline h-auto decoration-black/20 dark:decoration-white/20",
         text: "p-0 text-xs",
      },
      size: {
        default: "h-10 px-3 text-xs md:text-sm",
        sm: "h-8 px-3 text-xs md:text-sm",
        xs: "h-7 px-2 text-xs",
        md: "h-11 px-3 text-xs md:text-sm font-semibold",
        lg: "h-12 md:h-14  px-8 text-xs md:text-base font-semibold",
        icon: "h-9 min-w-9 text-xs md:text-sm",
        iconSm: "h-8 min-w-8 text-xs md:text-sm",
        iconXS: "h-7 min-w-7 text-xs md:text-sm",
        linkSm: "p-0 text-xs",
        link: "p-0"
      },
      rounded: {
        default: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "lg",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };