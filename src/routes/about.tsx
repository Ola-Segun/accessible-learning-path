import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { courses } from "@/content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About this project — Learning Library" },
      {
        name: "description",
        content:
          "Portfolio information for a multi-course e-learning demo: role, purpose, instructional approach and the skills it demonstrates.",
      },
      { property: "og:title", content: "About this project — Learning Library" },
      {
        property: "og:description",
        content:
          "Portfolio information for a multi-course e-learning demo: role, purpose and the skills it demonstrates.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const facts = [
  { label: "Project", value: "Learning Library — three interactive e-learning modules" },
  { label: "Role", value: "E-Learning Developer / Instructional Designer" },
  { label: "Purpose", value: "Demonstration of interactive digital learning development" },
  { label: "Format", value: "Self-paced web modules, 6–8 minutes each" },
];

const demonstrates = [
  {
    title: "Instructional design",
    body: "Each module states its objectives up front, and every screen maps back to one of them. Nothing is included because it was interesting.",
  },
  {
    title: "Curriculum structure",
    body: "Three courses across three subjects sharing one content schema, so lessons can be written or reordered without touching a component.",
  },
  {
    title: "Interactive learning",
    body: "Expandable concept cards and realistic workplace scenarios instead of passive reading.",
  },
  {
    title: "Knowledge assessment",
    body: "Scored checks with immediate feedback, a written rationale for every option, and assessment steps that gate progression.",
  },
  {
    title: "Accessibility",
    body: "Semantic structure, keyboard operation, visible focus states, verified contrast and reduced-motion support across every screen.",
  },
  {
    title: "Learner experience",
    body: "A full path from browsing the catalogue to completion, with progress saved so a learner can resume where they left off.",
  },
];

function AboutPage() {
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
        <p className="eyebrow mb-3">Portfolio information</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">About this project</h1>
        <p className="mt-4 max-w-prose text-base leading-7 text-muted-foreground">
          A small, self-contained learning library built to show how I plan, write and build digital
          learning experiences end to end — from course discovery through to a scored completion
          screen.
        </p>

        <dl className="mt-10 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {facts.map((fact) => (
            <div key={fact.label} className="grid gap-1 p-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="eyebrow sm:pt-0.5">{fact.label}</dt>
              <dd className="text-sm leading-6">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-14 text-xl font-semibold tracking-tight">The courses</h2>
        <p className="mt-4 max-w-prose text-base leading-7 text-muted-foreground">
          Three deliberately different subjects, to show the approach is not tied to one topic.
        </p>
        <ul className="mt-6 space-y-3">
          {courses.map((course) => (
            <li key={course.slug} className="rounded-xl border border-border bg-card p-5">
              <p className="eyebrow">{course.category}</p>
              <h3 className="mt-1.5 text-sm font-semibold">{course.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{course.summary}</p>
            </li>
          ))}
        </ul>

        <h2 className="mt-14 text-xl font-semibold tracking-tight">What this demonstrates</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {demonstrates.map((item) => (
            <li key={item.title} className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
            </li>
          ))}
        </ul>

        <h2 className="mt-14 text-xl font-semibold tracking-tight">How it was built</h2>
        <p className="mt-4 max-w-prose text-base leading-7 text-muted-foreground">
          React and TypeScript with Tailwind CSS. Every course is data rather than markup: a shared
          schema describes four lesson types — explanation, interactive cards, scenario and
          assessment — and the player renders whatever it finds. Adding a course means adding one
          file and no components, which is the same separation a real content workflow needs when a
          subject matter expert owns the words and a developer owns the shell.
        </p>
        <p className="mt-4 max-w-prose text-base leading-7 text-muted-foreground">
          Progress is saved to the browser so a learner can leave and resume. There is no account
          system, no backend and no tracking — and no authoring tool, SCORM package or LMS behind
          it. The modules are hand-built.
        </p>

        <h2 className="mt-14 text-xl font-semibold tracking-tight">AI-assisted production</h2>
        <p className="mt-4 max-w-prose text-base leading-7 text-muted-foreground">
          The outline, first-draft copy and component scaffold were produced with AI assistance from
          a detailed instructional brief I wrote — audience, objectives, screen-by-screen purpose,
          assessment strategy and accessibility requirements. Everything generated was then reviewed
          rather than trusted.
        </p>
        <p className="mt-4 max-w-prose text-base leading-7 text-muted-foreground">
          That review pass caught a pass mark that silently demanded a perfect score, a submitted
          question that dropped out of the keyboard tab order, a status message that would never
          have been announced, and feedback icons carrying meaning with no text equivalent. AI
          compressed the drafting; the accuracy, accessibility and instructional judgement still
          needed a human who knew what to look for.
        </p>

        <div className="mt-12">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Browse the courses
          </Link>
        </div>
      </main>
    </div>
  );
}
