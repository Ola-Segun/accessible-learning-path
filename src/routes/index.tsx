import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Clock, Users, Target, Lightbulb } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CourseHeader } from "@/components/course/CourseHeader";
import { LessonSection } from "@/components/course/LessonSection";
import { InteractiveCard } from "@/components/course/InteractiveCard";
import { QuizQuestion } from "@/components/course/QuizQuestion";
import { FeedbackPanel } from "@/components/course/FeedbackPanel";
import { CompletionScreen } from "@/components/course/CompletionScreen";
import {
  barriers,
  conceptSection,
  courseMeta,
  lessons,
  quiz,
  scenario,
  takeaways,
} from "@/content/course";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Introduction to Web Accessibility — Interactive Learning Module" },
      {
        name: "description",
        content:
          "A 5–7 minute interactive lesson on web accessibility: what it means, common barriers, a real-world scenario and a scored knowledge check.",
      },
      {
        property: "og:title",
        content: "Introduction to Web Accessibility — Interactive Learning Module",
      },
      {
        property: "og:description",
        content:
          "A short, accessible e-learning module covering accessibility basics, common barriers and a scored knowledge check.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoursePage,
});

const TOTAL_STEPS = lessons.length;

function CoursePage() {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [openBarrier, setOpenBarrier] = useState<string | null>(barriers[0].id);

  const [scenarioChoice, setScenarioChoice] = useState<string | null>(null);
  const [scenarioSubmitted, setScenarioSubmitted] = useState(false);

  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizChecked, setQuizChecked] = useState<Record<string, boolean>>({});

  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // Move focus to the lesson container on each step change so keyboard and
  // screen reader users land at the start of the new content.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, quizIndex, complete]);

  const currentQuestion = quiz[quizIndex];
  const currentChecked = Boolean(quizChecked[currentQuestion.id]);
  const score = quiz.reduce((total, q) => {
    const answer = quizAnswers[q.id];
    const choice = q.choices.find((c) => c.id === answer);
    return total + (choice?.correct ? 1 : 0);
  }, 0);

  const canGoNext =
    step !== 4 || (currentChecked && (quizIndex < quiz.length - 1 || currentChecked));

  const goNext = useCallback(() => {
    if (step < 4) {
      setStep((s) => s + 1);
      return;
    }
    if (quizIndex < quiz.length - 1) {
      setQuizIndex((i) => i + 1);
      return;
    }
    setComplete(true);
  }, [step, quizIndex]);

  const goPrev = useCallback(() => {
    if (step === 4 && quizIndex > 0) {
      setQuizIndex((i) => i - 1);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  }, [step, quizIndex]);

  const restart = () => {
    setComplete(false);
    setStep(0);
    setQuizIndex(0);
    setQuizAnswers({});
    setQuizChecked({});
    setScenarioChoice(null);
    setScenarioSubmitted(false);
    setOpenBarrier(barriers[0].id);
  };

  const review = () => {
    setComplete(false);
    setStep(1);
  };

  const stepLabel = complete
    ? "Course complete"
    : step === 4
      ? `Lesson 5 of ${TOTAL_STEPS} · Question ${quizIndex + 1} of ${quiz.length}`
      : `Lesson ${step + 1} of ${TOTAL_STEPS} · ${lessons[step].label}`;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <a
        href="#lesson-content"
        className="sr-only rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to lesson content
      </a>

      <h1 className="sr-only">
        {courseMeta.title}: {courseMeta.subtitle}
      </h1>

      <CourseHeader
        title={courseMeta.title}
        current={complete ? TOTAL_STEPS : step + 1}
        total={TOTAL_STEPS}
        stepLabel={stepLabel}
      />

      <main
        id="lesson-content"
        ref={mainRef}
        tabIndex={-1}
        className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 outline-none sm:px-8 sm:py-16"
      >
        {complete ? (
          <CompletionScreen
            score={score}
            total={quiz.length}
            takeaways={takeaways}
            onReview={review}
            onRestart={restart}
          />
        ) : step === 0 ? (
          <WelcomeStep onStart={() => setStep(1)} />
        ) : step === 1 ? (
          <ConceptStep />
        ) : step === 2 ? (
          <BarriersStep open={openBarrier} setOpen={setOpenBarrier} />
        ) : step === 3 ? (
          <ScenarioStep
            selected={scenarioChoice}
            submitted={scenarioSubmitted}
            onSelect={setScenarioChoice}
            onSubmit={() => setScenarioSubmitted(true)}
          />
        ) : (
          <KnowledgeCheckStep
            index={quizIndex}
            selected={quizAnswers[currentQuestion.id] ?? null}
            checked={currentChecked}
            score={score}
            onSelect={(id) =>
              setQuizAnswers((prev) => ({ ...prev, [currentQuestion.id]: id }))
            }
            onCheck={() => setQuizChecked((prev) => ({ ...prev, [currentQuestion.id]: true }))}
          />
        )}
      </main>

      {!complete && step > 0 ? (
        <nav
          aria-label="Course navigation"
          className="sticky bottom-0 border-t border-border bg-surface/90 backdrop-blur-sm"
        >
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <Button variant="outline" onClick={goPrev}>
              <ArrowLeft aria-hidden="true" className="size-4" />
              Previous
            </Button>
            <div className="flex items-center gap-3">
              {step === 4 && !currentChecked ? (
                <p className="hidden text-xs text-muted-foreground sm:block">
                  Check your answer to continue
                </p>
              ) : null}
              <Button onClick={goNext} disabled={!canGoNext}>
                {step === 4 && quizIndex === quiz.length - 1 ? "Finish course" : "Next"}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
            </div>
          </div>
        </nav>
      ) : null}
    </div>
  );
}

function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <LessonSection
      animationKey="welcome"
      eyebrow="Welcome"
      title={courseMeta.title}
      intro={courseMeta.intro}
    >
      <p className="-mt-4 mb-8 text-lg font-medium text-foreground">{courseMeta.subtitle}</p>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <Clock aria-hidden="true" className="size-4 shrink-0 text-primary" />
          <div>
            <dt className="eyebrow">Estimated time</dt>
            <dd className="text-sm font-medium">{courseMeta.duration}</dd>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <Users aria-hidden="true" className="size-4 shrink-0 text-primary" />
          <div>
            <dt className="eyebrow">Who it is for</dt>
            <dd className="text-sm font-medium">{courseMeta.audience}</dd>
          </div>
        </div>
      </dl>

      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2">
          <Target aria-hidden="true" className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">Learning objectives</h3>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          By the end of this lesson, you will be able to:
        </p>
        <ol className="mt-4 space-y-3">
          {courseMeta.objectives.map((objective, i) => (
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
      </div>

      <div className="mt-10">
        <Button size="lg" onClick={onStart}>
          Start learning
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </LessonSection>
  );
}

function ConceptStep() {
  const { heading, body, supporting, example, takeaway } = conceptSection;

  return (
    <LessonSection animationKey="concept" eyebrow="Lesson 2" title={heading} intro={body}>
      <p className="max-w-prose text-base leading-7 text-muted-foreground">{supporting}</p>

      <figure className="mt-8">
        <figcaption className="eyebrow mb-3">{example.caption}</figcaption>
        <div className="grid gap-3 sm:grid-cols-2">
          {[example.inaccessible, example.accessible].map((variant, i) => (
            <div
              key={variant.label}
              className={`rounded-xl border p-5 ${
                i === 0
                  ? "border-destructive/30 bg-destructive-surface"
                  : "border-success/30 bg-success-surface"
              }`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-wide ${
                  i === 0 ? "text-destructive" : "text-success"
                }`}
              >
                {variant.label}
              </p>
              <pre className="mt-3 overflow-x-auto rounded-md bg-card p-3 font-mono text-xs leading-5">
                <code>{variant.code}</code>
              </pre>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{variant.note}</p>
            </div>
          ))}
        </div>
      </figure>

      <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex gap-3">
          <Lightbulb aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold">Key takeaway</p>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{takeaway}</p>
          </div>
        </div>
      </div>
    </LessonSection>
  );
}

function BarriersStep({
  open,
  setOpen,
}: {
  open: string | null;
  setOpen: (id: string | null) => void;
}) {
  return (
    <LessonSection
      animationKey="barriers"
      eyebrow="Lesson 3"
      title="Common accessibility barriers"
      intro="Most accessibility problems come from a small number of recurring habits. Select each barrier to see why it excludes people and how to fix it."
    >
      <div className="space-y-3">
        {barriers.map((barrier, i) => (
          <InteractiveCard
            key={barrier.id}
            index={i + 1}
            title={barrier.title}
            summary={barrier.summary}
            problem={barrier.problem}
            fix={barrier.fix}
            affects={barrier.affects}
            open={open === barrier.id}
            onToggle={() => setOpen(open === barrier.id ? null : barrier.id)}
          />
        ))}
      </div>
    </LessonSection>
  );
}

function ScenarioStep({
  selected,
  submitted,
  onSelect,
  onSubmit,
}: {
  selected: string | null;
  submitted: boolean;
  onSelect: (id: string) => void;
  onSubmit: () => void;
}) {
  const chosen = scenario.choices.find((c) => c.id === selected);
  const correct = scenario.choices.find((c) => c.correct)!;

  return (
    <LessonSection
      animationKey="scenario"
      eyebrow="Lesson 4"
      title={scenario.heading}
      intro={scenario.situation}
    >
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <QuizQuestion
          name="scenario"
          legend={scenario.question}
          choices={[...scenario.choices]}
          selectedId={selected}
          submitted={submitted}
          onSelect={onSelect}
        />

        {!submitted ? (
          <div className="mt-6">
            <Button onClick={onSubmit} disabled={!selected}>
              Check answer
            </Button>
          </div>
        ) : null}
      </div>

      {submitted && chosen ? (
        <div className="mt-6 space-y-4">
          <FeedbackPanel
            status={chosen.correct ? "correct" : "incorrect"}
            title={chosen.correct ? "Correct" : "Not quite"}
          >
            <p>{correct.rationale}</p>
            {!chosen.correct ? <p>Your answer: {chosen.rationale}</p> : null}
          </FeedbackPanel>

          <FeedbackPanel status="info" title="Why the other options are less appropriate">
            <ul className="space-y-2">
              {scenario.choices
                .filter((c) => !c.correct)
                .map((c) => (
                  <li key={c.id}>
                    <span className="font-medium text-foreground">{c.text}</span> {c.rationale}
                  </li>
                ))}
            </ul>
          </FeedbackPanel>
        </div>
      ) : null}
    </LessonSection>
  );
}

function KnowledgeCheckStep({
  index,
  selected,
  checked,
  score,
  onSelect,
  onCheck,
}: {
  index: number;
  selected: string | null;
  checked: boolean;
  score: number;
  onSelect: (id: string) => void;
  onCheck: () => void;
}) {
  const question = quiz[index];
  const chosen = question.choices.find((c) => c.id === selected);

  return (
    <LessonSection
      animationKey={`check-${question.id}`}
      eyebrow="Lesson 5"
      title="Knowledge check"
      intro="Three short questions to confirm the essentials. You will see feedback after each answer."
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-xs font-medium text-muted-foreground">
          Question {index + 1} of {quiz.length}
        </p>
        <p className="text-xs font-medium tabular-nums text-muted-foreground">
          Score: {score} / {quiz.length}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <QuizQuestion
          name={question.id}
          legend={question.prompt}
          choices={question.choices}
          selectedId={selected}
          submitted={checked}
          onSelect={onSelect}
        />

        {!checked ? (
          <div className="mt-6">
            <Button onClick={onCheck} disabled={!selected}>
              Check answer
            </Button>
          </div>
        ) : null}
      </div>

      {checked && chosen ? (
        <FeedbackPanel
          className="mt-6"
          status={chosen.correct ? "correct" : "incorrect"}
          title={chosen.correct ? "Correct" : "Not quite"}
        >
          <p>{chosen.rationale}</p>
          <p>{question.explanation}</p>
        </FeedbackPanel>
      ) : null}
    </LessonSection>
  );
}
