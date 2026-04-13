import { ReactNode, useEffect } from "react";
import { cn } from "../../utils/cn";

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  size?: "default" | "wide";
}

const sizeClasses = {
  default: "max-w-2xl",
  wide: "max-w-4xl"
};

export const Modal = ({
  open,
  title,
  description,
  onClose,
  children,
  size = "default"
}: ModalProps) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const scrollY = window.scrollY;
    const previousOverflow = document.body.style.overflow;
    const previousPosition = document.body.style.position;
    const previousTop = document.body.style.top;
    const previousWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.position = previousPosition;
      document.body.style.top = previousTop;
      document.body.style.width = previousWidth;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="fixed inset-0 flex items-end justify-center p-3 sm:items-center sm:p-6">
        <div
          className={cn(
            "flex w-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-xl",
            "h-[calc(100dvh-1.5rem)] max-h-[calc(100dvh-1.5rem)] sm:h-auto sm:max-h-[90vh]",
            sizeClasses[size]
          )}
        >
          <div className="shrink-0 flex items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">{title}</h2>
              {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-input text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="Fechar modal"
            >
              X
            </button>
          </div>
          <div className="min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain px-5 py-5 [touch-action:pan-y]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
