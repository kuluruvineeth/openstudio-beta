import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@repo/design-system/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-zinc-950 [&>svg~*]:pl-7 dark:border-zinc-800 dark:[&>svg]:text-zinc-50",
  {
    variants: {
      variant: {
        default: "bg-white text-zinc-950 dark:bg-black/20 dark:text-zinc-50",
        success:
          "bg-green-200 text-green-950 dark:bg-green-500/10 dark:text-green-500 [&>svg]:text-green-500 dark:[&>svg]:text-green-500",
        warning:
          "bg-yellow-200 text-yellow-950 dark:bg-yellow-300/10 dark:text-yellow-100 [&>svg]:text-yellow-500 dark:[&>svg]:text-yellow-100",
        destructive:
          "bg-red-500/5 text-red-300  [&>svg]:text-red-300 dark:text-red-300  dark:[&>svg]:text-red-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";
export { Alert, AlertDescription, AlertTitle };