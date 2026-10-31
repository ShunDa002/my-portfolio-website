import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 transition-colors font-medium",
  {
    variants: {
      variant: {
        default:
          "rounded-md border border-slate-700/60 bg-slate-800 text-xs text-slate-300 px-2.5 py-0.5",
        secondary:
          "rounded-md bg-slate-900/50 border border-slate-800/50 text-slate-300 text-xs px-2.5 py-1",
        cyan:
          "rounded-md text-xs font-medium text-cyan-200/90 bg-cyan-950/40 px-2.5 py-1 border border-cyan-800/40",
        pill:
          "rounded-full px-4 py-2 bg-slate-900/50 backdrop-blur-md border border-slate-800/50 hover:border-cyan-glow/30 hover:bg-slate-800/60 transition-all duration-300 text-sm text-slate-300",
        outline:
          "rounded-full text-xs border border-slate-700/60 text-slate-300 px-2.5 py-0.5",
        glow:
          "rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 shadow-[0_0_10px_rgba(34,211,238,0.15)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
