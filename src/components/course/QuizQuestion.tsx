import { Check, X } from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/utils";
import type { Choice } from "@/content";

type Props = {
  name: string;
  legend: string;
  meta?: string;
  choices: Choice[];
  selectedId: string | null;
  submitted: boolean;
  onSelect: (id: string) => void;
};

export function QuizQuestion({
  name,
  legend,
  meta,
  choices,
  selectedId,
  submitted,
  onSelect,
}: Props) {
  const groupId = useId();

  return (
    // Once answered the options stay focusable and announced so keyboard and
    // screen reader users can still review them — a disabled fieldset would
    // drop them out of the tab order. Selection changes are ignored instead.
    <fieldset className="min-w-0" aria-disabled={submitted || undefined}>
      <legend className="mb-5 text-lg font-semibold leading-7 sm:text-xl">
        {meta ? <span className="eyebrow mb-2 block">{meta}</span> : null}
        {legend}
      </legend>

      <div className="space-y-2.5">
        {choices.map((choice) => {
          const id = `${groupId}-${choice.id}`;
          const selected = selectedId === choice.id;
          const reveal = submitted && (selected || choice.correct);
          const tone = submitted
            ? choice.correct
              ? "border-success/40 bg-success-surface"
              : selected
                ? "border-destructive/40 bg-destructive-surface"
                : "border-border bg-card opacity-70"
            : selected
              ? "border-primary bg-accent"
              : "border-border bg-card hover:border-border-strong";

          return (
            <label
              key={choice.id}
              htmlFor={id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                submitted && "cursor-default",
                tone,
              )}
            >
              <input
                type="radio"
                id={id}
                name={name}
                value={choice.id}
                checked={selected}
                onChange={() => {
                  if (!submitted) onSelect(choice.id);
                }}
                className="mt-1 size-4 shrink-0 accent-[var(--color-primary)] outline-none"
              />
              <span className="min-w-0 flex-1 text-sm leading-6">
                {choice.text}
                {/* The tick/cross is decorative, so the verdict is also given as text. */}
                {reveal ? (
                  <span className="sr-only">
                    {choice.correct ? " — correct answer" : " — your answer, incorrect"}
                  </span>
                ) : null}
              </span>
              {reveal ? (
                choice.correct ? (
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
                ) : (
                  <X aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-destructive" />
                )
              ) : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
