import { ChevronDown } from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/utils";

type Props = {
  index: number;
  title: string;
  summary: string;
  problem: string;
  fix: string;
  affects: string;
  open: boolean;
  onToggle: () => void;
};

export function InteractiveCard({
  index,
  title,
  summary,
  problem,
  fix,
  affects,
  open,
  onToggle,
}: Props) {
  const panelId = useId();
  const buttonId = useId();

  return (
    <div
      className={cn(
        "rounded-xl border bg-card transition-colors",
        open ? "border-border-strong shadow-card" : "border-border hover:border-border-strong",
      )}
    >
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-start gap-4 rounded-xl p-5 text-left"
        >
          <span
            aria-hidden="true"
            className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-accent font-mono text-[11px] font-semibold text-accent-foreground"
          >
            {index}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-semibold">{title}</span>
            <span className="mt-1 block text-sm text-muted-foreground">{summary}</span>
          </span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "mt-1 size-5 shrink-0 text-muted-foreground transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </h3>

      <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open}>
        <div className="space-y-4 border-t border-border px-5 py-5 pl-15">
          <div>
            <p className="eyebrow mb-1.5">Why it is a problem</p>
            <p className="text-sm leading-6 text-muted-foreground">{problem}</p>
          </div>
          <div>
            <p className="eyebrow mb-1.5">How to improve it</p>
            <p className="text-sm leading-6 text-muted-foreground">{fix}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Most affected: </span>
            {affects}
          </p>
        </div>
      </div>
    </div>
  );
}
