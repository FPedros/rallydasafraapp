import { ReactNode } from "react";
import { cn } from "../../utils/cn";

type Variant = "warning" | "critical";

const styles: Record<Variant, string> = {
  warning: "border-border bg-muted/60 text-foreground",
  critical: "border-destructive/20 bg-destructive/10 text-destructive"
};

export const Alert = ({
  title,
  children,
  variant = "warning"
}: {
  title: string;
  children: ReactNode;
  variant?: Variant;
}) => (
  <div className={cn("rounded-lg border px-4 py-3", styles[variant])}>
    <p className="text-sm font-semibold">{title}</p>
    <p className="mt-1 text-sm opacity-90">{children}</p>
  </div>
);
