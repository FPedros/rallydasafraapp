import { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type Variant = "normal" | "warning" | "critical";

const styles: Record<Variant, string> = {
  normal: "bg-primary/12 text-primary",
  warning: "bg-accent/22 text-ink",
  critical: "bg-dark text-light"
};

export const Badge = ({
  className,
  children,
  variant = "normal",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
      styles[variant],
      className
    )}
    {...props}
  >
    {children}
  </span>
);
