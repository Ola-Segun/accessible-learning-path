import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CourseHeader } from "@/components/course/CourseHeader";
import {
  CardsLesson,
  ContentLesson,
  QuizLesson,
  ScenarioLesson,
} from "@/components/course/LessonViews";
import { getCourse, scorableCount, type Course } from "@/content";
import { emptyProgress, loadAll, questionKey, saveCourse } from "@/lib/progress";

export const Route = createFileRoute("/course/$slug/learn")({
  loader: ({ params }) => {
    const course = getCourse(params.slug);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: `${loaderData.course.title} — Learning Library` }] : [],
  }),
  component: PlayerPage,
});

type Answers = Record<string, string>;
type Checked = Record<string, boolean>;

/** Progress units: every quiz question counts separately from its lesson. */
function unitsOf(course: Course, upToIndex: number): number {
  return course.lessons
    .slice(0, upToIndex)
    .reduce((total, lesson) => total + (lesson.kind === "quiz" ? lesson.questions.length : 1), 0);
}

function computeScore(course: Course, answers: Answers, checked: Checked): number {
  let score = 0;
  for (const lesson of course.lessons) {
    if (lesson.kind === "scenario") {
      const key = questionKey(lesson.id, lesson.id);
      if (checked[key] && lesson.choices.find((c) => c.id === answers[key])?.correct) score += 1;
    }
    if (lesson.kind === "quiz") {
      for (const question of lesson.questions) {
        const key = questionKey(lesson.id, question.id);
        if (checked[key] && question.choices.find((c) => c.id === answers[key])?.correct)
          score += 1;
      }
    }
  }
  return score;
}

function PlayerPage() {
  const { course } = Route.useLoaderData();
  const navigate = useNavigate();

  const [lessonIndex, setLessonIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [checked, setChecked] = useState<Checked>({});
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // Restore after mount. Server and first client render both start at lesson 0
  // so the markup matches; returning learners jump to their saved position.
  useEffect(() => {
    const saved = loadAll()[course.slug];
    if (saved && !saved.completed) {
      setLessonIndex(Math.min(saved.lessonIndex, course.lessons.length - 1));
      setQuizIndex(saved.quizIndex);
      setAnswers(saved.answers);
      setChecked(saved.checked);
    } else if (saved?.completed) {
      // Reviewing a finished course: keep the answers, start from the top.
      setAnswers(saved.answers);
      setChecked(saved.checked);
    }
    setHydrated(true);
  }, [course.slug, course.lessons.length]);

  const lesson = course.lessons[lessonIndex]!;

  // Open the first card by default whenever a card lesson comes into view.
  useEffect(() => {
    if (lesson.kind === "cards") setOpenCard(lesson.cards[0]!.id);
  }, [lesson]);

  // Move focus to the lesson container on every step so keyboard and screen
  // reader users land at the start of the new content.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [lessonIndex, quizIndex]);

  // Persist on every change, once the saved state has been read.
  useEffect(() => {
    if (!hydrated) return;
    saveCourse(course.slug, {
      ...emptyProgress(),
      lessonIndex,
      quizIndex,
      answers,
      checked,
      completed: false,
      score: computeScore(course, answers, checked),
      total: scorableCount(course),
    });
  }, [hydrated, course, lessonIndex, quizIndex, answers, checked]);

  const activeKey =
    lesson.kind === "scenario"
      ? questionKey(lesson.id, lesson.id)
      : lesson.kind === "quiz"
        ? questionKey(lesson.id, lesson.questions[quizIndex]!.id)
        : null;

  const activeChecked = activeKey ? Boolean(checked[activeKey]) : false;
  // Assessment steps cannot be skipped.
  const canGoNext = activeKey ? activeChecked : true;

  const isLastLesson = lessonIndex === course.lessons.length - 1;
  const isLastQuestion = lesson.kind === "quiz" ? quizIndex === lesson.questions.length - 1 : true;
  const isFinalStep = isLastLesson && isLastQuestion;

  const select = useCallback(
    (choiceId: string) => {
      if (!activeKey) return;
      setAnswers((prev) => ({ ...prev, [activeKey]: choiceId }));
    },
    [activeKey],
  );

  const check = useCallback(() => {
    if (!activeKey) return;
    setChecked((prev) => ({ ...prev, [activeKey]: true }));
  }, [activeKey]);

  const goNext = useCallback(() => {
    if (lesson.kind === "quiz" && quizIndex < lesson.questions.length - 1) {
      setQuizIndex((i) => i + 1);
      return;
    }
    if (!isLastLesson) {
      setLessonIndex((i) => i + 1);
      setQuizIndex(0);
      return;
    }
    const score = computeScore(course, answers, checked);
    saveCourse(course.slug, {
      ...emptyProgress(),
      lessonIndex: course.lessons.length - 1,
      quizIndex,
      answers,
      checked,
      completed: true,
      score,
      total: scorableCount(course),
    });
    void navigate({ to: "/course/$slug/complete", params: { slug: course.slug } });
  }, [lesson, quizIndex, isLastLesson, course, answers, checked, navigate]);

  const goPrev = useCallback(() => {
    if (lesson.kind === "quiz" && quizIndex > 0) {
      setQuizIndex((i) => i - 1);
      return;
    }
    if (lessonIndex > 0) {
      const prev = course.lessons[lessonIndex - 1]!;
      setLessonIndex(lessonIndex - 1);
      setQuizIndex(prev.kind === "quiz" ? prev.questions.length - 1 : 0);
      return;
    }
    void navigate({ to: "/course/$slug", params: { slug: course.slug } });
  }, [lesson, quizIndex, lessonIndex, course, navigate]);

  const stepLabel =
    lesson.kind === "quiz"
      ? `Lesson ${lessonIndex + 1} of ${course.lessons.length} · Question ${quizIndex + 1} of ${lesson.questions.length}`
      : `Lesson ${lessonIndex + 1} of ${course.lessons.length} · ${lesson.label}`;

  const progressTotal = unitsOf(course, course.lessons.length);
  const progressCurrent =
    unitsOf(course, lessonIndex) +
    (lesson.kind === "quiz" ? quizIndex + (activeChecked ? 1 : 0) : 1);

  const answeredCount =
    lesson.kind === "quiz"
      ? lesson.questions.filter((q) => checked[questionKey(lesson.id, q.id)]).length
      : 0;
  const runningScore = computeScore(course, answers, checked);

  const announcement = (() => {
    if (!activeKey || !activeChecked) return "";
    const choices =
      lesson.kind === "scenario"
        ? lesson.choices
        : lesson.kind === "quiz"
          ? lesson.questions[quizIndex]!.choices
          : [];
    const chosen = choices.find((c) => c.id === answers[activeKey]);
    if (!chosen) return "";
    return `${chosen.correct ? "Correct." : "Not quite."} ${chosen.rationale}`;
  })();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <a
        href="#lesson-content"
        className="sr-only rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to lesson content
      </a>

      <h1 className="sr-only">
        {course.title}: {course.subtitle}
      </h1>

      <CourseHeader
        title={course.title}
        current={progressCurrent}
        total={progressTotal}
        stepLabel={stepLabel}
        valueText={stepLabel}
      />

      {/* Persistent live region — present before the text changes, so feedback
          is announced rather than silently appearing. */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <main
        id="lesson-content"
        ref={mainRef}
        tabIndex={-1}
        className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 outline-none sm:px-8 sm:py-16"
      >
        {lesson.kind === "content" ? (
          <ContentLesson lesson={lesson} stepLabel={`Lesson ${lessonIndex + 1}`} />
        ) : lesson.kind === "cards" ? (
          <CardsLesson
            lesson={lesson}
            stepLabel={`Lesson ${lessonIndex + 1}`}
            openId={openCard}
            onToggle={(id) => setOpenCard((current) => (current === id ? null : id))}
          />
        ) : lesson.kind === "scenario" ? (
          <ScenarioLesson
            lesson={lesson}
            stepLabel={`Lesson ${lessonIndex + 1}`}
            selected={activeKey ? (answers[activeKey] ?? null) : null}
            submitted={activeChecked}
            onSelect={select}
            onCheck={check}
          />
        ) : (
          <QuizLesson
            lesson={lesson}
            stepLabel={`Lesson ${lessonIndex + 1}`}
            question={lesson.questions[quizIndex]!}
            index={quizIndex}
            answeredCount={answeredCount}
            score={runningScore}
            selected={activeKey ? (answers[activeKey] ?? null) : null}
            checked={activeChecked}
            onSelect={select}
            onCheck={check}
          />
        )}
      </main>

      <nav
        aria-label="Course navigation"
        className="sticky bottom-0 border-t border-border bg-surface/90 backdrop-blur-sm"
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Button variant="outline" onClick={goPrev}>
            <ArrowLeft aria-hidden="true" className="size-4" />
            {lessonIndex === 0 && quizIndex === 0 ? "Overview" : "Previous"}
          </Button>
          <div className="flex items-center gap-3">
            {!canGoNext ? (
              <p className="hidden text-xs text-muted-foreground sm:block">
                Check your answer to continue
              </p>
            ) : null}
            <Button onClick={goNext} disabled={!canGoNext}>
              {isFinalStep ? "Finish course" : "Next"}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}
