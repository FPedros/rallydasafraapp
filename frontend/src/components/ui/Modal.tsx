import { ReactNode } from "react";
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
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={cn(
          "flex max-h-[90vh] w-full flex-col overflow-hidden rounded-[2rem] border border-primary/10 bg-surface shadow-soft",
          sizeClasses[size]
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-primary/10 px-5 py-4">
          <div>
            <h2 className="text-xl font-bold text-dark">{title}</h2>
            {description ? <p className="mt-1 text-sm text-text/70">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/15 text-lg font-semibold text-dark transition-colors hover:bg-primary/10"
            aria-label="Fechar modal"
          >
            X
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
};
