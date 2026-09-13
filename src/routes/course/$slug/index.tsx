import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Clock, RotateCcw, Target, UserRound, Users } from "lucide-react";

import { LearnerForm } from "@/components/course/LearnerForm";
import { Modal } from "@/components/ui/modal";
import { getCourse, passMarkOf, scorableCount } from "@/content";
import { useLearner } from "@/hooks/use-learner";
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
  const navigate = useNavigate();
  const { progress, hydrated, refresh } = useProgressMap();
  const { learner, hydrated: learnerHydrated, save } = useLearner();
  /** null = closed. "enrol" continues into the course, "edit" stays put. */
  const [dialog, setDialog] = useState<"enrol" | "edit" | null>(null);

  const saved = progress[course.slug];
  const status = statusOf(saved);
  const scorable = scorableCount(course);

  const cta =
    status === "completed"
      ? "Review course"
      : status === "in-progress"
        ? "Resume course"
        : "Start course";

  const toPlayer = () =>
    void navigate({ to: "/course/$slug/learn", params: { slug: course.slug } });

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
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground">
            {course.category}
          </span>
          {course.required ? (
            <span className="rounded-md bg-accent px-2 py-1 text-[11px] font-medium text-accent-foreground">
              Required training
            </span>
          ) : null}
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
            {course.lessons.length} lessons · {scorable} scored questions · {passMarkOf(course)}% to
            pass
          </p>
        </section>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          {/*
            A real link, so it works before hydration and without JavaScript.
            When there is no identity yet the click is intercepted and the
            enrolment dialog opens instead of sending the learner down the page.
          */}
          <Link
            to="/course/$slug/learn"
            params={{ slug: course.slug }}
            onClick={(event) => {
              if (learnerHydrated && !learner) {
                event.preventDefault();
                setDialog("enrol");
              }
            }}
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

        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <UserRound aria-hidden="true" className="size-4 shrink-0" />
          {learnerHydrated && learner ? (
            <span>
              Enrolled as <span className="font-medium text-foreground">{learner.name}</span>
              {learner.department ? ` · ${learner.department}` : ""}.{" "}
              <button
                type="button"
                onClick={() => setDialog("edit")}
                className="rounded-md font-medium text-primary underline-offset-4 hover:underline"
              >
                Change details
              </button>
            </span>
          ) : (
            <span>Takes about {course.duration}. You will be asked for your name first.</span>
          )}
        </p>

        {hydrated && status === "completed" && saved ? (
          <p className="mt-2 text-sm text-muted-foreground">
            You completed this module and scored {saved.score} of {saved.total}.
          </p>
        ) : null}

        <Modal
          open={dialog !== null}
          onClose={() => setDialog(null)}
          title={dialog === "edit" ? "Your details" : "Before you start"}
          description={
            dialog === "edit"
              ? "These appear on your certificates and training record."
              : "Recorded against your completion so your certificate and training record can be issued."
          }
        >
          <LearnerForm
            initial={learner}
            submitLabel={dialog === "edit" ? "Save details" : "Enrol and start"}
            onSubmit={(next) => {
              save(next);
              const wasEnrolling = dialog === "enrol";
              setDialog(null);
              if (wasEnrolling) toPlayer();
            }}
            onCancel={() => setDialog(null)}
          />
        </Modal>
      </main>
    </div>
  );
}
