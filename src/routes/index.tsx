import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { CourseCard } from "@/components/course/CourseCard";
import { catalogue, categories, courses } from "@/content";
import { useProgressMap } from "@/hooks/use-progress";
import { statusOf } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Learning Library — Short, practical e-learning modules" },
      {
        name: "description",
        content:
          "Three self-paced modules on accessibility, technical recruiting and working with AI. Under ten minutes each, with a scored knowledge check.",
      },
      { property: "og:title", content: "Learning Library" },
      {
        property: "og:description",
        content:
          "Short, practical e-learning modules with interactive assessment and full keyboard and screen-reader support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CataloguePage,
});

const ALL = "All";

function CataloguePage() {
  const { progress, hydrated } = useProgressMap();
  const [filter, setFilter] = useState<string>(ALL);

  const filtered = useMemo(
    () => (filter === ALL ? courses : courses.filter((c) => c.category === filter)),
    [filter],
  );

  const completed = hydrated
    ? courses.filter((c) => statusOf(progress[c.slug]) === "completed").length
    : 0;

  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#catalogue"
        className="sr-only rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to courses
      </a>

      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-7 shrink-0 place-items-center rounded-md bg-primary font-mono text-[11px] font-semibold text-primary-foreground"
            >
              LL
            </span>
            <p className="text-sm font-semibold tracking-tight">{catalogue.title}</p>
          </div>
          <Link
            to="/about"
            className="rounded-md text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            About this project
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="eyebrow mb-3">Self-paced modules</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{catalogue.tagline}</h1>
        <p className="mt-4 max-w-prose text-base leading-7 text-muted-foreground">
          {catalogue.description}
        </p>

        {hydrated && completed > 0 ? (
          <p className="mt-6 inline-flex items-center rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            You have completed{" "}
            <span className="mx-1 font-semibold text-foreground">
              {completed} of {courses.length}
            </span>{" "}
            modules.
          </p>
        ) : null}

        <div className="mt-12">
          <h2 id="catalogue" className="text-lg font-semibold tracking-tight">
            Courses
          </h2>

          <div
            role="group"
            aria-label="Filter courses by category"
            className="mt-4 flex flex-wrap gap-2"
          >
            {[ALL, ...categories].map((category) => {
              const active = filter === category;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(category)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground",
                  )}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <p aria-live="polite" className="sr-only">
            {filtered.length} {filtered.length === 1 ? "course" : "courses"} shown
            {filter === ALL ? "" : ` in ${filter}`}.
          </p>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {filtered.map((course) => (
              <CourseCard
                key={course.slug}
                course={course}
                lessonCount={course.lessons.length}
                progress={progress[course.slug]}
                status={statusOf(progress[course.slug])}
                showStatus={hydrated}
              />
            ))}
          </ul>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-4xl px-5 py-8 text-xs text-muted-foreground sm:px-8">
          Progress is stored in this browser only. There is no account and nothing is sent anywhere.
        </div>
      </footer>
    </div>
  );
}
