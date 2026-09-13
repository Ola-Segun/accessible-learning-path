/**
 * Learner progress, persisted to localStorage.
 *
 * There is no account system — progress belongs to the browser. Everything here
 * is guarded for server rendering, where `window` does not exist, and for
 * private-mode browsers where writes can throw.
 */

export type CourseProgress = {
  /** Index of the lesson the learner is on. */
  lessonIndex: number;
  /** Index within a quiz lesson. */
  quizIndex: number;
  /** `${lessonId}:${questionId}` → chosen choice id. */
  answers: Record<string, string>;
  /** `${lessonId}:${questionId}` → answer has been checked. */
  checked: Record<string, boolean>;
  completed: boolean;
  score: number;
  total: number;
  updatedAt: string;
};

export type ProgressMap = Record<string, CourseProgress>;

const STORAGE_KEY = "learning-library:progress:v1";

export const emptyProgress = (): CourseProgress => ({
  lessonIndex: 0,
  quizIndex: 0,
  answers: {},
  checked: {},
  completed: false,
  score: 0,
  total: 0,
  updatedAt: new Date().toISOString(),
});

export function questionKey(lessonId: string, questionId: string): string {
  return `${lessonId}:${questionId}`;
}

export function loadAll(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    // Anything unreadable is discarded rather than allowed to crash the player.
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as ProgressMap;
  } catch {
    return {};
  }
}

export function saveCourse(slug: string, progress: CourseProgress): ProgressMap {
  const next = { ...loadAll(), [slug]: { ...progress, updatedAt: new Date().toISOString() } };
  if (typeof window === "undefined") return next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked — the session still works, it just will not resume.
  }
  return next;
}

export function clearCourse(slug: string): ProgressMap {
  const all = loadAll();
  delete all[slug];
  if (typeof window === "undefined") return all;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
  return all;
}

export type CourseStatus = "not-started" | "in-progress" | "completed";

export function statusOf(progress: CourseProgress | undefined): CourseStatus {
  if (!progress) return "not-started";
  if (progress.completed) return "completed";
  if (progress.lessonIndex > 0 || Object.keys(progress.checked).length > 0) return "in-progress";
  return "not-started";
}
