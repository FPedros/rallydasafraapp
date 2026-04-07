import { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("rounded-4xl border border-primary/14 bg-surface p-5 shadow-soft", className)}
    {...props}
  />
);
