import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../utils/cn";

interface ProfileMenuProps {
  className?: string;
  onLogout: () => void;
}

const getInitials = (email: string | null) => {
  if (!email) {
    return "U";
  }

  const localPart = email.split("@")[0] ?? "";
  const normalized = localPart.replace(/[^a-zA-Z0-9]+/g, " ").trim();
  const tokens = normalized.split(/\s+/).filter(Boolean);

  if (tokens.length >= 2) {
    return `${tokens[0][0]}${tokens[1][0]}`.toUpperCase();
  }

  return localPart.slice(0, 2).toUpperCase();
};

export const ProfileMenu = ({ className, onLogout }: ProfileMenuProps) => {
  const { currentUserEmail } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const initials = useMemo(() => getInitials(currentUserEmail), [currentUserEmail]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
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
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border border-input bg-background text-foreground shadow-sm transition-colors",
          "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        )}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className="text-sm font-semibold uppercase tracking-[0.12em]">{initials}</span>
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 top-[calc(100%+0.75rem)] z-30 w-64 rounded-xl border border-border bg-popover p-3 text-popover-foreground shadow-xl"
          role="menu"
        >
          <div className="rounded-lg border border-border bg-muted/40 px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Usuario logado
            </p>
            <p className="mt-2 break-all text-sm font-medium text-foreground">
              {currentUserEmail ?? "Sem usuario"}
            </p>
          </div>

          <button
            className={cn(
              "mt-3 flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium text-foreground transition-colors",
              "hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            role="menuitem"
            type="button"
          >
            <span>Sair</span>
            <span className="text-muted-foreground">Encerrar sessao</span>
          </button>
        </div>
      ) : null}
    </div>
  );
};
