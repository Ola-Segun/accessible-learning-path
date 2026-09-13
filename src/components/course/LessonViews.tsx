import { Lightbulb } from "lucide-react";
import type { Choice, Comparison, Lesson, QuizItem } from "@/content";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FeedbackPanel } from "./FeedbackPanel";
import { InteractiveCard } from "./InteractiveCard";
import { LessonSection } from "./LessonSection";
import { QuizQuestion } from "./QuizQuestion";

function ComparisonBlock({ comparison }: { comparison: Comparison }) {
  const { caption, mono = true, negative, positive } = comparison;

  return (
    <figure className="mt-8">
      <figcaption className="eyebrow mb-3">{caption}</figcaption>
      <div className="grid gap-3 sm:grid-cols-2">
        {[negative, positive].map((variant, i) => (
          <div
            key={variant.label}
            className={cn(
              "rounded-xl border p-5",
              i === 0
                ? "border-destructive/30 bg-destructive-surface"
                : "border-success/30 bg-success-surface",
            )}
          >
            <p
              className={cn(
                "text-xs font-semibold uppercase tracking-wide",
                i === 0 ? "text-destructive" : "text-success",
              )}
            >
              {variant.label}
            </p>
            {mono ? (
              <pre className="mt-3 overflow-x-auto rounded-md bg-card p-3 font-mono text-xs leading-5">
                <code>{variant.code}</code>
              </pre>
            ) : (
              <blockquote className="mt-3 rounded-md bg-card p-3 text-sm leading-6">
                {variant.code}
              </blockquote>
            )}
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{variant.note}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}

export function ContentLesson({
  lesson,
  stepLabel,
}: {
  lesson: Extract<Lesson, { kind: "content" }>;
  stepLabel: string;
}) {
  return (
    <LessonSection
      animationKey={lesson.id}
      eyebrow={stepLabel}
      title={lesson.heading}
      intro={lesson.intro}
    >
      {lesson.supporting ? (
        <p className="max-w-prose text-base leading-7 text-muted-foreground">{lesson.supporting}</p>
      ) : null}

      {lesson.comparison ? <ComparisonBlock comparison={lesson.comparison} /> : null}

      {lesson.takeaway ? (
        <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex gap-3">
            <Lightbulb aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold">Key takeaway</p>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{lesson.takeaway}</p>
            </div>
          </div>
        </div>
      ) : null}
    </LessonSection>
  );
}

export function CardsLesson({
  lesson,
  stepLabel,
  openId,
  onToggle,
}: {
  lesson: Extract<Lesson, { kind: "cards" }>;
  stepLabel: string;
  openId: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <LessonSection
      animationKey={lesson.id}
      eyebrow={stepLabel}
      title={lesson.heading}
      intro={lesson.intro}
    >
      <div className="space-y-3">
        {lesson.cards.map((card, i) => (
          <InteractiveCard
            key={card.id}
            index={i + 1}
            title={card.title}
            summary={card.summary}
            problem={card.problem}
            fix={card.fix}
            affects={card.affects}
            open={openId === card.id}
            onToggle={() => onToggle(card.id)}
          />
        ))}
      </div>
    </LessonSection>
  );
}

export function ScenarioLesson({
  lesson,
  stepLabel,
  selected,
  submitted,
  onSelect,
  onCheck,
}: {
  lesson: Extract<Lesson, { kind: "scenario" }>;
  stepLabel: string;
  selected: string | null;
  submitted: boolean;
  onSelect: (id: string) => void;
  onCheck: () => void;
}) {
  const chosen = lesson.choices.find((c) => c.id === selected);
  const correct = lesson.choices.find((c) => c.correct) as Choice;

  return (
    <LessonSection
      animationKey={lesson.id}
      eyebrow={stepLabel}
      title={lesson.heading}
      intro={lesson.situation}
    >
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <QuizQuestion
          name={lesson.id}
          legend={lesson.question}
          choices={lesson.choices}
          selectedId={selected}
          submitted={submitted}
          onSelect={onSelect}
        />

        {!submitted ? (
          <div className="mt-6">
            <Button onClick={onCheck} disabled={!selected}>
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
              {lesson.choices
                .filter((c) => c.id !== correct.id)
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

export function QuizLesson({
  lesson,
  stepLabel,
  question,
  index,
  answeredCount,
  score,
  selected,
  checked,
  onSelect,
  onCheck,
}: {
  lesson: Extract<Lesson, { kind: "quiz" }>;
  stepLabel: string;
  question: QuizItem;
  index: number;
  answeredCount: number;
  score: number;
  selected: string | null;
  checked: boolean;
  onSelect: (id: string) => void;
  onCheck: () => void;
}) {
  const chosen = question.choices.find((c) => c.id === selected);

  return (
    <LessonSection
      animationKey={`${lesson.id}-${question.id}`}
      eyebrow={stepLabel}
      title={lesson.heading}
      intro={lesson.intro}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-xs font-medium text-muted-foreground">
          Question {index + 1} of {lesson.questions.length}
        </p>
        {/* Scored against questions answered so far, so an unanswered check
            never reads as a zero the learner has already lost. */}
        <p className="text-xs font-medium tabular-nums text-muted-foreground">
          {answeredCount > 0 ? `Score: ${score} / ${answeredCount}` : "Not yet answered"}
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
