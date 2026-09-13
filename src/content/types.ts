/**
 * Course schema.
 *
 * Content is kept entirely separate from presentation: every course is data,
 * and the player renders whatever lesson kinds it finds. Adding a course means
 * adding a file here, never touching a component.
 */

export type Choice = {
  id: string;
  text: string;
  correct: boolean;
  /** Shown after answering — why this option is right or wrong. */
  rationale: string;
};

export type QuizItem = {
  id: string;
  prompt: string;
  choices: Choice[];
  /** Reinforcement shown after the per-option rationale. */
  explanation: string;
};

export type DisclosureCard = {
  id: string;
  title: string;
  summary: string;
  problem: string;
  fix: string;
  affects: string;
};

export type Comparison = {
  caption: string;
  /** Render the excerpt in monospace. True for code, false for prose samples. */
  mono?: boolean;
  negative: { label: string; code: string; note: string };
  positive: { label: string; code: string; note: string };
};

/** A lesson is one of four shapes. The player switches on `kind`. */
export type Lesson =
  | {
      kind: "content";
      id: string;
      label: string;
      heading: string;
      intro: string;
      supporting?: string;
      comparison?: Comparison;
      takeaway?: string;
    }
  | {
      kind: "cards";
      id: string;
      label: string;
      heading: string;
      intro: string;
      cards: DisclosureCard[];
    }
  | {
      kind: "scenario";
      id: string;
      label: string;
      heading: string;
      situation: string;
      question: string;
      choices: Choice[];
    }
  | {
      kind: "quiz";
      id: string;
      label: string;
      heading: string;
      intro: string;
      questions: QuizItem[];
    };

export type Course = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  level: "Beginner" | "Intermediate";
  duration: string;
  audience: string;
  /** One line for the catalogue card. */
  summary: string;
  /** Opening paragraph on the course detail page. */
  intro: string;
  objectives: string[];
  lessons: Lesson[];
  takeaways: string[];
};

/** Total scored questions in a course — scenario counts as one. */
export function scorableCount(course: Course): number {
  return course.lessons.reduce((total, lesson) => {
    if (lesson.kind === "quiz") return total + lesson.questions.length;
    if (lesson.kind === "scenario") return total + 1;
    return total;
  }, 0);
}
