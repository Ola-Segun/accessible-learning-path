import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Award, BookOpen, RotateCcw, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Certificate } from "@/components/course/Certificate";
import { courses, getCourse, passMarkOf, scorableCount } from "@/content";
import { useLearner } from "@/hooks/use-learner";
import { certificateId } from "@/lib/learner";
import { clearCourse, formatDuration, loadAll, type CourseProgress } from "@/lib/progress";

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
  const { learner } = useLearner();
  const [saved, setSaved] = useState<CourseProgress | null>(null);
  const [nextSlug, setNextSlug] = useState<string | null>(null);

  useEffect(() => {
    const all = loadAll();
    setSaved(all[course.slug] ?? null);
    const next = courses.find((c) => c.slug !== course.slug && !all[c.slug]?.completed);
    setNextSlug(next?.slug ?? null);
  }, [course.slug]);

  const total = scorableCount(course);
  const score = saved?.score ?? 0;
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  const passMark = passMarkOf(course);
  const passed = percent >= passMark;
  const nextCourse = nextSlug ? getCourse(nextSlug) : undefined;

  const retake = () => {
    clearCourse(course.slug);
    void navigate({ to: "/course/$slug/learn", params: { slug: course.slug } });
  };

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
        <section aria-labelledby="result" className="fade-rise">
          <p className="eyebrow mb-3">Course complete</p>
          <h1 id="result" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {passed
              ? `Nicely done${learner ? `, ${learner.name.split(" ")[0]}` : ""} — you passed`
              : "Not quite — a retake is needed"}
          </h1>
          <p className="mt-4 max-w-prose text-base leading-7 text-muted-foreground">
            {passed
              ? "You can explain the core ideas, spot the common mistakes, and apply the basics in your own work. Your certificate is below."
              : `This module needs ${passMark}% to pass and you scored ${percent}%. Review the lessons and take the check again — your answers are cleared on retake so you get a clean run.`}
          </p>

          <div className="mt-8 flex flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-card sm:flex-row sm:items-center sm:gap-8">
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className={`grid size-12 shrink-0 place-items-center rounded-full ${
                  passed
                    ? "bg-accent text-accent-foreground"
                    : "bg-destructive-surface text-destructive"
                }`}
              >
                {passed ? <Award className="size-6" /> : <XCircle className="size-6" />}
              </span>
              <div>
                <p className="eyebrow">Knowledge check score</p>
                <p className="text-2xl font-semibold tabular-nums">
                  {score} / {total}
                  <span className="ml-2 text-base font-medium text-muted-foreground">
                    ({percent}%)
                  </span>
                </p>
              </div>
            </div>
            <div className="flex-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted sm:max-w-xs">
                <div
                  className={`h-full rounded-full ${passed ? "bg-success" : "bg-destructive"}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Pass mark {passMark}%
                {saved && saved.secondsSpent > 0
                  ? ` · ${formatDuration(saved.secondsSpent)} on this course`
                  : ""}
                {saved && saved.attempts > 1 ? ` · attempt ${saved.attempts}` : ""}
              </p>
            </div>
          </div>
        </section>

        {passed && learner && saved?.completedAt ? (
          <div className="mt-14">
            <Certificate
              slug={course.slug}
              data={{
                learnerName: learner.name,
                department: learner.department,
                courseTitle: course.title,
                courseSubtitle: course.subtitle,
                score,
                total,
                completedAt: saved.completedAt,
                certificateId: certificateId(learner.email, course.slug, saved.completedAt),
              }}
            />
          </div>
        ) : null}

        {passed && !learner ? (
          <p className="mt-10 rounded-xl border border-border bg-muted p-5 text-sm leading-6 text-muted-foreground">
            Add your name and email on the course overview to have a certificate issued for this
            completion.
          </p>
        ) : null}

        <section aria-labelledby="takeaways" className="mt-14">
          <h2 id="takeaways" className="text-lg font-semibold tracking-tight">
            Three things to take with you
          </h2>
          <ol className="mt-4 space-y-3">
            {course.takeaways.map((item, i) => (
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
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() =>
              void navigate({ to: "/course/$slug/learn", params: { slug: course.slug } })
            }
          >
            <BookOpen aria-hidden="true" className="size-4" />
            Review course
          </Button>
          <Button variant={passed ? "outline" : "default"} onClick={retake}>
            <RotateCcw aria-hidden="true" className="size-4" />
            {passed ? "Retake" : "Retake the course"}
          </Button>
          <Link
            to="/record"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-border-strong"
          >
            View training record
          </Link>
        </div>

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
