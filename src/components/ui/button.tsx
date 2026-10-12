import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "rounded-full bg-cyan-glow text-midnight font-semibold shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]",
        primary:
          "rounded-full bg-cyan-glow text-midnight font-semibold shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]",
        secondary:
          "rounded-full bg-slate-900/50 backdrop-blur-md border border-slate-700/50 text-slate-200 hover:bg-slate-800/50 hover:border-cyan-glow/30",
        glass:
          "rounded-full bg-slate-900/50 backdrop-blur-md border border-slate-700/50 text-slate-200 hover:bg-slate-800/50 hover:border-cyan-glow/30",
        outline:
          "rounded-xl border border-slate-700/60 bg-transparent text-slate-200 hover:bg-slate-800/50 hover:border-cyan-glow/30",
        ghost:
          "rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60",
        link:
          "text-cyan-glow underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "px-8 py-3 text-base font-semibold",
        icon: "h-10 w-10 p-2.5 rounded-full",
        "icon-sm": "h-8 w-8 p-1.5 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
