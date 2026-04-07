import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useRallyData } from "../../hooks/useRallyData";
import { useSelection } from "../../hooks/useSelection";
import { getEditionStageMeta } from "../../utils/editionStage";
import { cn } from "../../utils/cn";
import { NavItem } from "./SidebarNav";

export const MobileAppHeader = ({ items }: { items: NavItem[] }) => {
  const location = useLocation();
  const { currentUserEmail, logout } = useAuth();
  const { data } = useRallyData();
  const { clearSelection, selectedEditionId, selectedYearId } = useSelection();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const selectedYear = data.years.find((year) => year.id === selectedYearId);
  const selectedEdition = data.editions.find((edition) => edition.id === selectedEditionId);
  const stageLabel = selectedEdition ? getEditionStageMeta(selectedEdition).label : "Etapa pendente";

  const initials = useMemo(() => {
    const localPart = (currentUserEmail ?? "user").split("@")[0] ?? "user";
    return localPart.slice(0, 2).toUpperCase();
  }, [currentUserEmail]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-primary/10 bg-surface/95 px-4 py-3 shadow-soft backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-dark">
              {selectedYear ? `Edicao ${selectedYear.ano}` : "Edicao pendente"} • {stageLabel}
            </p>
            <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-primary/75">Rally da Safra</p>
          </div>

          <button
            aria-expanded={isOpen}
            aria-haspopup="menu"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/12 bg-light text-dark transition-colors hover:bg-primary/10"
            onClick={() => setIsOpen((current) => !current)}
            type="button"
          >
            <span className="flex w-5 flex-col gap-1.5">
              <span className="h-0.5 w-full rounded-full bg-current" />
              <span className="h-0.5 w-full rounded-full bg-current" />
              <span className="h-0.5 w-full rounded-full bg-current" />
            </span>
          </button>
        </div>
      </header>

      {isOpen ? (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <div
            ref={menuRef}
            className="ml-auto flex h-full w-[min(21rem,88vw)] flex-col border-l border-primary/10 bg-surface p-4 shadow-[0_20px_60px_rgba(24,48,34,0.18)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Menu</p>
                <h2 className="truncate text-lg font-semibold text-dark">Gestao Operacional</h2>
              </div>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/12 text-dark transition-colors hover:bg-primary/10"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                X
              </button>
            </div>

            <div className="mt-4 rounded-[1.3rem] bg-primary/10 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/12 bg-light text-sm font-semibold uppercase text-dark">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70">
                    Usuario logado
                  </p>
                  <p className="truncate text-sm font-medium text-dark">{currentUserEmail ?? "Sem usuario"}</p>
                </div>
              </div>
            </div>

            <nav className="mt-4 flex-1 space-y-2 overflow-y-auto">
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

            <div className="mt-4 space-y-2 border-t border-primary/10 pt-4">
              <Link
                to="/select-edition"
                className="block rounded-2xl border border-primary/12 bg-light px-4 py-3 text-sm font-semibold text-dark transition-colors hover:bg-primary/10"
              >
                Alterar etapa
              </Link>
              <button
                className="block w-full rounded-2xl bg-primary px-4 py-3 text-left text-sm font-semibold text-light transition-colors hover:bg-[#739f5c]"
                onClick={() => {
                  clearSelection();
                  logout();
                }}
                type="button"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
