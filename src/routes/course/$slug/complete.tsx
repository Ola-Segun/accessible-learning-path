import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

import { CompletionScreen } from "@/components/course/CompletionScreen";
import { courses, getCourse, scorableCount } from "@/content";
import { clearCourse, loadAll, type CourseProgress } from "@/lib/progress";

export const Route = createFileRoute("/course/$slug/complete")({
  loader: ({ params }) => {
    const course = getCourse(params.slug);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: `Complete — ${loaderData.course.title}` }] : [],
  }),
  component: CompletePage,
});

function CompletePage() {
  const { course } = Route.useLoaderData();
  const navigate = useNavigate();
  const [saved, setSaved] = useState<CourseProgress | null>(null);

  useEffect(() => {
    setSaved(loadAll()[course.slug] ?? null);
  }, [course.slug]);

  const total = scorableCount(course);
  const score = saved?.score ?? 0;

  // The next unfinished course in the catalogue, so the flow keeps going.
  const [nextSlug, setNextSlug] = useState<string | null>(null);
  useEffect(() => {
    const all = loadAll();
    const next = courses.find((c) => c.slug !== course.slug && !all[c.slug]?.completed);
    setNextSlug(next?.slug ?? null);
  }, [course.slug]);

  const nextCourse = nextSlug ? getCourse(nextSlug) : undefined;

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            to="/"
            className="rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Learning Library
          </Link>
          <p className="truncate text-xs text-muted-foreground">{course.title}</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <CompletionScreen
          score={score}
          total={total}
          takeaways={course.takeaways}
          onReview={() => {
            void navigate({ to: "/course/$slug/learn", params: { slug: course.slug } });
          }}
          onRestart={() => {
            clearCourse(course.slug);
            void navigate({ to: "/course/$slug/learn", params: { slug: course.slug } });
          }}
        />

        <section aria-labelledby="next-up" className="mt-14 border-t border-border pt-10">
          <h2 id="next-up" className="text-lg font-semibold tracking-tight">
            {nextCourse ? "Next up" : "That is the whole library"}
          </h2>

          {nextCourse ? (
            <Link
              to="/course/$slug"
              params={{ slug: nextCourse.slug }}
              className="group mt-4 flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-border-strong"
            >
              <div className="min-w-0 flex-1">
                <p className="eyebrow">
                  {nextCourse.category} · {nextCourse.duration}
                </p>
                <p className="mt-1.5 text-base font-semibold">{nextCourse.title}</p>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  {nextCourse.summary}
                </p>
              </div>
              <ArrowRight
                aria-hidden="true"
                className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          ) : (
            <>
              <p className="mt-3 max-w-prose text-base leading-7 text-muted-foreground">
                You have completed every module. Thanks for working through them.
              </p>
              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Back to the library
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
