/**
 * Learner progress and completion records, persisted to localStorage.
 *
 * In an internal deployment these writes go to the L&D record system and feed
 * reporting. This public build keeps the same shape in the browser so the demo
 * behaves identically — there is no account and nothing is transmitted.
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
  /** Met the course pass mark. Recorded at completion. */
  passed: boolean;
  score: number;
  total: number;
  /** Seconds of active time in the player, accumulated across sittings. */
  secondsSpent: number;
  /** ISO timestamp of first completion. Retakes keep the original. */
  completedAt: string | null;
  /** How many times the learner has finished this course. */
  attempts: number;
  startedAt: string;
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
  passed: false,
  score: 0,
  total: 0,
  secondsSpent: 0,
  completedAt: null,
  attempts: 0,
  startedAt: new Date().toISOString(),
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
    const map = parsed as Record<string, Partial<CourseProgress>>;
    // Records written by an earlier version are filled in rather than dropped.
    return Object.fromEntries(
      Object.entries(map).map(([slug, value]) => [slug, { ...emptyProgress(), ...value }]),
    );
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

/** "4 min" / "1 hr 12 min" — for the training record. */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return "under a minute";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `${hours} hr ${minutes % 60} min`;
}
