import { ReactNode } from "react";
import { cn } from "../../utils/cn";

type Variant = "warning" | "critical";

const styles: Record<Variant, string> = {
  warning: "border-accent/30 bg-accent/12 text-dark",
  critical: "border-primary/12 bg-surface text-dark"
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
  <div className={cn("rounded-3xl border px-4 py-3", styles[variant])}>
    <p className="text-sm font-semibold">{title}</p>
    <p className="mt-1 text-sm opacity-90">{children}</p>
  </div>
);
