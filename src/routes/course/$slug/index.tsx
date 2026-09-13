import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Clock, RotateCcw, Target, Users } from "lucide-react";

import { getCourse, scorableCount } from "@/content";
import { useProgressMap } from "@/hooks/use-progress";
import { clearCourse, statusOf } from "@/lib/progress";

export const Route = createFileRoute("/course/$slug/")({
  loader: ({ params }) => {
    const course = getCourse(params.slug);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.course.title} — Learning Library` },
          { name: "description", content: loaderData.course.summary },
          { property: "og:title", content: loaderData.course.title },
          { property: "og:description", content: loaderData.course.summary },
          { property: "og:type", content: "article" },
        ]
      : [],
  }),
  component: CourseDetailPage,
});

const KIND_LABEL: Record<string, string> = {
  content: "Lesson",
  cards: "Interactive",
  scenario: "Scenario",
  quiz: "Assessment",
};

function CourseDetailPage() {
  const { course } = Route.useLoaderData();
  const { progress, hydrated, refresh } = useProgressMap();

  const saved = progress[course.slug];
  const status = statusOf(saved);
  const scorable = scorableCount(course);

  const cta =
    status === "completed"
      ? "Review course"
      : status === "in-progress"
        ? "Resume course"
        : "Start course";

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto max-w-3xl px-5 py-4 sm:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Learning Library
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground">
            {course.category}
          </span>
          <span className="eyebrow">{course.level}</span>
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{course.title}</h1>
        <p className="mt-3 text-lg font-medium text-foreground">{course.subtitle}</p>
        <p className="mt-5 max-w-prose text-base leading-7 text-muted-foreground">{course.intro}</p>

        <dl className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <Clock aria-hidden="true" className="size-4 shrink-0 text-primary" />
            <div>
              <dt className="eyebrow">Estimated time</dt>
              <dd className="text-sm font-medium">{course.duration}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <Users aria-hidden="true" className="size-4 shrink-0 text-primary" />
            <div>
              <dt className="eyebrow">Who it is for</dt>
              <dd className="text-sm font-medium">{course.audience}</dd>
            </div>
          </div>
        </dl>

        <section
          aria-labelledby="objectives"
          className="mt-8 rounded-xl border border-border bg-card p-6 shadow-card"
        >
          <div className="flex items-center gap-2">
            <Target aria-hidden="true" className="size-4 text-primary" />
            <h2 id="objectives" className="text-sm font-semibold">
              Learning objectives
            </h2>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            By the end of this module, you will be able to:
          </p>
          <ol className="mt-4 space-y-3">
            {course.objectives.map((objective, i) => (
              <li key={objective} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-6 shrink-0 place-items-center rounded-md bg-accent font-mono text-[11px] font-semibold text-accent-foreground"
                >
                  {i + 1}
                </span>
                <span className="text-sm leading-6">{objective}</span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="syllabus" className="mt-10">
          <h2 id="syllabus" className="text-lg font-semibold tracking-tight">
            What you will cover
          </h2>
          <ol className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {course.lessons.map((lesson, i) => (
              <li key={lesson.id} className="flex items-center gap-4 p-4">
                <span
                  aria-hidden="true"
                  className="grid size-7 shrink-0 place-items-center rounded-md bg-secondary font-mono text-[11px] font-semibold text-secondary-foreground"
                >
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 text-sm font-medium">{lesson.label}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {KIND_LABEL[lesson.kind]}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-muted-foreground">
            {course.lessons.length} lessons · {scorable} scored questions
          </p>
        </section>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            to="/course/$slug/learn"
            params={{ slug: course.slug }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {cta}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>

          {hydrated && status !== "not-started" ? (
            <button
              type="button"
              onClick={() => {
                clearCourse(course.slug);
                refresh();
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
            >
              <RotateCcw aria-hidden="true" className="size-4" />
              Reset progress
            </button>
          ) : null}
        </div>

        {hydrated && status === "completed" && saved ? (
          <p className="mt-4 text-sm text-muted-foreground">
            You completed this module and scored {saved.score} of {saved.total}.
          </p>
        ) : null}
      </main>
    </div>
  );
}
