import { NavLink } from "react-router-dom";
import { NavItem } from "./SidebarNav";
import { cn } from "../../utils/cn";

export const BottomNav = ({ items }: { items: NavItem[] }) => (
  <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-primary/10 bg-surface px-3 py-2 shadow-soft lg:hidden">
    <div className="-mx-1 overflow-x-auto pb-1">
      <div className="flex min-w-max gap-2 px-1">
        {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "shrink-0 rounded-2xl px-3 py-2 text-center text-xs font-semibold text-text",
              isActive && "bg-primary !text-light"
            )
          }
        >
          {item.label}
        </NavLink>
        ))}
      </div>
    </div>
  </nav>
);
