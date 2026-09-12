import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About this project — Web Accessibility Learning Module" },
      {
        name: "description",
        content:
          "Portfolio information for an interactive e-learning module on web accessibility: role, purpose, and the skills it demonstrates.",
      },
      { property: "og:title", content: "About this project — Web Accessibility Learning Module" },
      {
        property: "og:description",
        content:
          "Portfolio information for an interactive e-learning module on web accessibility: role, purpose, and the skills it demonstrates.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const facts = [
  { label: "Project", value: "Introduction to Web Accessibility" },
  { label: "Role", value: "E-Learning Developer / Instructional Designer" },
  { label: "Purpose", value: "Demonstration of interactive digital learning development" },
  { label: "Format", value: "Self-paced web module, approximately 5–7 minutes" },
];

const demonstrates = [
  {
    title: "Instructional design",
    body: "Clear objectives, a short logical flow, and content chunked so a beginner can finish in one sitting.",
  },
  {
    title: "Interactive learning",
    body: "Expandable barrier examples and a realistic workplace scenario instead of passive reading.",
  },
  {
    title: "Knowledge assessment",
    body: "Three multiple-choice questions with immediate feedback, rationales for every option, and scoring.",
  },
  {
    title: "Accessibility",
    body: "Semantic structure, keyboard operation, visible focus states, sufficient contrast and reduced-motion support.",
  },
  {
    title: "Responsive UI development",
    body: "A single layout that reads comfortably on mobile, tablet and desktop.",
  },
  {
    title: "User-centred design",
    body: "Persistent progress, predictable navigation, and no step where the learner can lose their place.",
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
            Back to the course
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <p className="eyebrow mb-3">Portfolio information</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">About this project</h1>
        <p className="mt-4 max-w-prose text-base leading-7 text-muted-foreground">
          A compact, self-contained e-learning module built to show how I plan, write and build
          digital learning experiences end to end.
        </p>

        <dl className="mt-10 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {facts.map((fact) => (
            <div key={fact.label} className="grid gap-1 p-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="eyebrow sm:pt-0.5">{fact.label}</dt>
              <dd className="text-sm leading-6">{fact.value}</dd>
            </div>
          ))}
        </dl>

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
          React and TypeScript with Tailwind CSS, using reusable components for the course header,
          progress indicator, lesson sections, interactive cards, quiz questions and feedback
          panels. Course content is stored separately from the interface so lessons can be edited or
          extended without touching the components. There is no authoring tool, SCORM package or LMS
          behind it — the module is hand-built.
        </p>

        <div className="mt-12">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Take the course
          </Link>
        </div>
      </main>
    </div>
  );
}
