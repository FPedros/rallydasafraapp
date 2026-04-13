import { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type Variant = "normal" | "warning" | "critical";

const styles: Record<Variant, string> = {
  normal: "border border-border bg-secondary text-secondary-foreground",
  warning: "border border-border bg-accent text-accent-foreground",
  critical: "border border-destructive/20 bg-destructive/10 text-destructive"
};

export const Badge = ({
  className,
  children,
  variant = "normal",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium",
      styles[variant],
      className
    )}
    {...props}
  >
    {children}
  </span>
);
