import { Link } from "@tanstack/react-router";
import { ProgressIndicator } from "./ProgressIndicator";

type Props = {
  title: string;
  current: number;
  total: number;
  stepLabel: string;
  valueText: string;
};

export function CourseHeader({ title, current, total, stepLabel, valueText }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-5 py-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-7 shrink-0 place-items-center rounded-md bg-primary font-mono text-[11px] font-semibold text-primary-foreground"
            >
              A11
            </span>
            <p className="text-sm font-semibold tracking-tight">{title}</p>
          </div>
          <Link
            to="/about"
            className="rounded-md text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            About this project
          </Link>
        </div>
        <ProgressIndicator
          current={current}
          total={total}
          label={stepLabel}
          valueText={valueText}
        />
      </div>
    </header>
  );
}
