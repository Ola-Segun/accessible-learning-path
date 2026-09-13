/**
 * Learner identity.
 *
 * In an internal deployment this comes from SSO and the HR directory, and the
 * learner never types it. This public build collects it once in the browser so
 * the demo can show the same personalised records and certificates — nothing is
 * transmitted and there is no account.
 */

export type Learner = {
  name: string;
  email: string;
  department: string;
  /** ISO date the learner first enrolled in anything. */
  since: string;
};

const STORAGE_KEY = "learning-library:learner:v1";

export const DEPARTMENTS = [
  "Customer Support",
  "Design",
  "Engineering",
  "Human Resources",
  "Marketing",
  "Operations",
  "Recruiting",
  "Sales",
  "Other",
] as const;

export function loadLearner(): Learner | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const learner = parsed as Partial<Learner>;
    if (!learner.name) return null;
    return {
      name: learner.name,
      email: learner.email ?? "",
      department: learner.department ?? "",
      since: learner.since ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveLearner(learner: Learner): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(learner));
  } catch {
    // Blocked storage — the session still works, it just will not be remembered.
  }
}

export function clearLearner(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** First name only, for greetings. */
export function firstName(learner: Learner): string {
  return learner.name.trim().split(/\s+/)[0] ?? learner.name;
}

/**
 * Deterministic certificate reference, so the same completion always produces
 * the same ID and it can be quoted in a record.
 */
export function certificateId(email: string, slug: string, completedAt: string): string {
  const seed = `${email.toLowerCase()}|${slug}|${completedAt.slice(0, 10)}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  const year = completedAt.slice(0, 4);
  return `LL-${year}-${hash.toString(16).toUpperCase().padStart(8, "0").slice(0, 6)}`;
}
