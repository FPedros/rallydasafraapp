import { ReactNode } from "react";

export const PageSection = ({
  title,
  description,
  action,
  children
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) => (
  <section className="space-y-4">
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
      <div className="min-w-0">
        <h2 className="text-xl font-bold text-dark">{title}</h2>
        {description ? <p className="mt-1 text-sm text-text/70">{description}</p> : null}
      </div>
      {action ? <div className="min-w-0">{action}</div> : null}
    </div>
    {children}
  </section>
);
