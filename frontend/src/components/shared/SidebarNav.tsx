import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";

export interface NavItem {
  to: string;
  label: string;
}

export const SidebarNav = ({ items }: { items: NavItem[] }) => (
  <aside className="hidden h-fit w-72 min-w-72 max-w-72 shrink-0 self-start overflow-y-auto rounded-4xl border border-primary/10 bg-surface p-5 shadow-soft lg:sticky lg:top-4 lg:block lg:max-h-[calc(100vh-2rem)]">
    <div className="mb-8 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Rally</p>
      <h1 className="text-2xl font-bold text-dark">Gestao Operacional</h1>
    </div>
    <nav className="space-y-2">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "block rounded-2xl px-4 py-3 text-sm font-medium text-text transition-colors hover:bg-primary/10 hover:!text-black",
              isActive && "bg-primary !text-light hover:bg-primary"
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);
