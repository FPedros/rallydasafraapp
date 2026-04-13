import { ReactNode } from "react";

export const FormField = ({
  label,
  hint,
  children
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) => (
  <div className="block space-y-2">
    <span className="text-sm font-medium text-foreground">{label}</span>
    {children}
    {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
  </div>
);
