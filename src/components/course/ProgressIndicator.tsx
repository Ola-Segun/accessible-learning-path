import { cn } from "@/lib/utils";

type Props = {
  current: number;
  total: number;
  label?: string;
  className?: string;
};

export function ProgressIndicator({ current, total, label, className }: Props) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow">{label ?? `Lesson ${current} of ${total}`}</p>
        <p className="text-xs font-medium tabular-nums text-muted-foreground">{percent}%</p>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={`Lesson ${current} of ${total}, ${percent} percent complete`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
