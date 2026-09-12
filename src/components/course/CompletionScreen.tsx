import { Award, RotateCcw, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  score: number;
  total: number;
  takeaways: readonly string[];
  onReview: () => void;
  onRestart: () => void;
};

export function CompletionScreen({ score, total, takeaways, onReview, onRestart }: Props) {
  const percent = Math.round((score / total) * 100);
  const passed = score >= Math.ceil(total * 0.67);

  return (
    <section aria-labelledby="completion-heading" className="fade-rise">
      <p className="eyebrow mb-3">Course complete</p>
      <h2 id="completion-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Nicely done — you finished the module
      </h2>
      <p className="mt-4 max-w-prose text-base leading-7 text-muted-foreground">
        {passed
          ? "You can explain what accessibility means, spot the most common barriers, and apply the basics in your own work."
          : "You have covered the essentials. Reviewing the lesson once more will make the barriers easier to recognise in real projects."}
      </p>

      <div className="mt-8 flex flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-card sm:flex-row sm:items-center sm:gap-8">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground"
          >
            <Award className="size-6" />
          </span>
          <div>
            <p className="eyebrow">Knowledge check score</p>
            <p className="text-2xl font-semibold tabular-nums">
              {score} / {total}
              <span className="ml-2 text-base font-medium text-muted-foreground">({percent}%)</span>
            </p>
          </div>
        </div>
        <div className="h-1.5 w-full flex-1 overflow-hidden rounded-full bg-muted sm:max-w-xs">
          <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <h3 className="mt-10 text-base font-semibold">Three things to take with you</h3>
      <ol className="mt-4 space-y-3">
        {takeaways.map((item, i) => (
          <li key={item} className="flex gap-3 rounded-xl border border-border bg-card p-4">
            <span
              aria-hidden="true"
              className="grid size-6 shrink-0 place-items-center rounded-md bg-secondary font-mono text-[11px] font-semibold text-secondary-foreground"
            >
              {i + 1}
            </span>
            <span className="text-sm leading-6 text-muted-foreground">{item}</span>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button onClick={onReview} variant="outline">
          <BookOpen aria-hidden="true" className="size-4" />
          Review course
        </Button>
        <Button onClick={onRestart}>
          <RotateCcw aria-hidden="true" className="size-4" />
          Restart
        </Button>
      </div>
    </section>
  );
}
