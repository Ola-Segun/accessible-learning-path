import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
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
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/"
              className="flex shrink-0 items-center gap-1.5 rounded-md text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft aria-hidden="true" className="size-3.5" />
              Library
            </Link>
            <span aria-hidden="true" className="text-border-strong">
              /
            </span>
            <p className="truncate text-sm font-semibold tracking-tight">{title}</p>
          </div>
          <p className="shrink-0 text-xs text-muted-foreground">Progress saved automatically</p>
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
