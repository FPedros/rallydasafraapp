import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";

export interface NavItem {
  to: string;
  label: string;
}

export const SidebarNav = ({ items }: { items: NavItem[] }) => (
  <aside className="hidden h-fit w-72 min-w-72 max-w-72 shrink-0 self-start overflow-y-auto rounded-xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-4 lg:block lg:max-h-[calc(100vh-2rem)]">
    <div className="mb-8 space-y-2">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Rally</p>
      <h1 className="text-2xl font-semibold text-foreground">Gestao Operacional</h1>
    </div>
    <nav className="space-y-2">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "block rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
              isActive && "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground"
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);
