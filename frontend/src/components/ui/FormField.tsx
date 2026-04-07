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
    <span className="text-sm font-semibold text-dark">{label}</span>
    {children}
    {hint ? <span className="block text-xs text-text/70">{hint}</span> : null}
  </div>
);
