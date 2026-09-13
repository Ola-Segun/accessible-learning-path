import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Built on the native <dialog> element.
 *
 * `showModal()` gives focus trapping, Escape-to-close, background inertness and
 * focus restoration from the platform — all the things a hand-rolled modal gets
 * subtly wrong. The only things left to add are body scroll lock and
 * click-outside, which the element does not cover.
 */
export function Modal({ open, onClose, title, description, children, className }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // The page behind a modal should not scroll away under it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
      // Fires for Escape as well as close(), so state stays in step either way.
      onClose={onClose}
      onClick={(event) => {
        // The backdrop is part of the dialog, so a click landing on the element
        // itself rather than the panel means the learner clicked outside.
        if (event.target === ref.current) onClose();
      }}
      className={cn(
        "m-auto w-[min(34rem,calc(100vw-2rem))] rounded-xl border border-border bg-card p-0 text-foreground shadow-lift open:fade-rise",
        className,
      )}
    >
      <div className="max-h-[min(44rem,calc(100dvh-4rem))] overflow-y-auto p-6 sm:p-7">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 id="modal-title" className="text-lg font-semibold tracking-tight">
              {title}
            </h2>
            {description ? (
              <p id="modal-description" className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1.5 -mt-1.5 shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X aria-hidden="true" className="size-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </dialog>
  );
}
