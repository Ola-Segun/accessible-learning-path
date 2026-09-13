import type { Course } from "./types";
import { webAccessibility } from "./courses/web-accessibility";
import { technicalProfile } from "./courses/technical-profile";
import { aiPrompts } from "./courses/ai-prompts";

export * from "./types";

export const catalogue = {
  title: "Learning Library",
  tagline: "Short, practical modules you can finish in a coffee break.",
  description:
    "Three self-paced modules on accessibility, technical recruiting and working with AI. Each one takes under ten minutes, ends with a scored knowledge check, and works fully with a keyboard or a screen reader.",
} as const;

export const courses: Course[] = [technicalProfile, aiPrompts, webAccessibility];

export const categories = [...new Set(courses.map((c) => c.category))].sort();

export function getCourse(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}
