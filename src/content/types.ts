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
  /**
   * Assigned training rather than optional. In an internal deployment this is
   * driven by role and department; here it is set on the course.
   */
  required?: boolean;
  /** Percentage needed to pass. Defaults to 67. */
  passMark?: number;
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

export const DEFAULT_PASS_MARK = 67;

export function passMarkOf(course: Course): number {
  return course.passMark ?? DEFAULT_PASS_MARK;
}

/**
 * Compares the percentage rather than a rounded question count — `ceil(n * 0.67)`
 * demands a perfect score on a three-question check.
 */
export function hasPassed(course: Course, score: number, total: number): boolean {
  if (total === 0) return true;
  return Math.round((score / total) * 100) >= passMarkOf(course);
}
