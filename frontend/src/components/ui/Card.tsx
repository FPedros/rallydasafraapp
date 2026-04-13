import { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm", className)}
    {...props}
  />
);
