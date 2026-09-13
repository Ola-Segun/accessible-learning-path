import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import type { Course } from "@/content";
import type { CourseProgress, CourseStatus } from "@/lib/progress";
import { cn } from "@/lib/utils";

type Props = {
  course: Course;
  status: CourseStatus;
  progress: CourseProgress | undefined;
  lessonCount: number;
  /** Progress badges are held back until localStorage has been read. */
  showStatus: boolean;
};

export function CourseCard({ course, status, progress, lessonCount, showStatus }: Props) {
  const percent =
    status === "completed"
      ? 100
      : progress
        ? Math.round((progress.lessonIndex / lessonCount) * 100)
        : 0;

  return (
    <li className="group relative flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-border-strong">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground">
          {course.category}
        </span>
        {course.required ? (
          <span className="rounded-md bg-accent px-2 py-1 text-[11px] font-medium text-accent-foreground">
            Required
          </span>
        ) : null}
        <span className="eyebrow">{course.level}</span>
      </div>

      <h3 className="mt-4 text-lg font-semibold tracking-tight">
        {/* Stretched link: the whole card is the target, but only one link is
            announced and only one tab stop is created. */}
        <Link
          to="/course/$slug"
          params={{ slug: course.slug }}
          className="after:absolute after:inset-0 after:rounded-xl"
        >
          {course.title}
        </Link>
      </h3>

      <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{course.summary}</p>

      <dl className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Clock aria-hidden="true" className="size-3.5" />
          <dt className="sr-only">Duration</dt>
          <dd>{course.duration}</dd>
        </div>
        <div>
          <dt className="sr-only">Lessons</dt>
          <dd>{lessonCount} lessons</dd>
        </div>
      </dl>

      {showStatus && status !== "not-started" ? (
        <div className="mt-5 border-t border-border pt-4">
          {status === "completed" ? (
            <p className="flex items-center gap-2 text-xs font-medium text-success">
              <CheckCircle2 aria-hidden="true" className="size-4" />
              Completed — scored {progress?.score} of {progress?.total}
            </p>
          ) : (
            <>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-xs font-medium text-foreground">In progress</p>
                <p className="text-xs tabular-nums text-muted-foreground">{percent}%</p>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
              </div>
            </>
          )}
        </div>
      ) : null}

      <p
        className={cn(
          "mt-5 flex items-center gap-1.5 text-sm font-medium text-primary",
          showStatus && status !== "not-started" && "mt-4",
        )}
      >
        {status === "completed"
          ? "Review course"
          : status === "in-progress"
            ? "Resume"
            : "Start course"}
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform group-hover:translate-x-0.5"
        />
      </p>
    </li>
  );
}
