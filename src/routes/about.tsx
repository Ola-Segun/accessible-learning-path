import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { courses } from "@/content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Learning Library" },
      {
        name: "description",
        content:
          "How the Learning Library works: short self-paced modules, completion records and certificates, built as an internal training platform with a public demonstration build.",
      },
      { property: "og:title", content: "About — Learning Library" },
      {
        property: "og:description",
        content:
          "Short self-paced modules with completion records and certificates — an internal training platform with a public demonstration build.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const deployment: [string, string, string][] = [
  ["Learner identity", "SSO and the HR directory", "Entered once, kept in the browser"],
  ["Assigned training", "Driven by role and department", "Marked on the course"],
  ["Completion records", "Written to the L&D record system", "Stored in the browser"],
  ["Certificates", "Issued and verifiable against the record", "Generated locally as a PNG"],
  ["Reporting", "Manager dashboards and compliance exports", "CSV export of your own record"],
];

const demonstrates = [
  {
    title: "Instructional design",
    body: "Each module states its objectives up front, and every screen maps back to one of them. Nothing is included because it was interesting.",
  },
  {
    title: "Curriculum structure",
    body: "Three courses across three unrelated subjects sharing one content schema, so lessons can be written or reordered without touching a component.",
  },
  {
    title: "Assessment design",
    body: "Distractors that are plausible and each wrong for a different reason, feedback written for every option, and pass marks with a retake path.",
  },
  {
    title: "Accessibility",
    body: "Semantic structure, keyboard operation, visible focus states, verified contrast and reduced-motion support across every screen.",
  },
  {
    title: "Product thinking",
    body: "The administration around the learning — enrolment, completion records, certificates and reporting — not just the lessons themselves.",
  },
  {
    title: "Front-end engineering",
    body: "Server-rendered React and TypeScript, a native dialog rather than a hand-rolled modal, and certificates painted to canvas with no added dependency.",
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
        <p className="eyebrow mb-3">About</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          A small training platform, built properly
        </h1>
        <p className="mt-5 max-w-prose text-base leading-7 text-muted-foreground">
          The Learning Library is a set of short, self-paced modules with the administration a real
          training programme needs around them: enrolment, pass marks, completion records,
          certificates and reporting. Every module takes under ten minutes and works fully with a
          keyboard or a screen reader.
        </p>

        <h2 className="mt-14 text-xl font-semibold tracking-tight">How it works</h2>
        <ol className="mt-6 space-y-3">
          {[
            ["Browse", "Pick a module from the library. Required training is flagged."],
            ["Enrol", "Give your name once, so completions have someone's name on them."],
            [
              "Learn",
              "Work through the lessons. Progress saves as you go — leave and resume any time.",
            ],
            [
              "Be assessed",
              "A scenario and a scored check. Assessment gates progress, so nothing can be clicked through.",
            ],
            [
              "Be recorded",
              "Pass and a certificate is issued. Everything lands in your training record.",
            ],
          ].map(([step, detail], i) => (
            <li key={step} className="flex gap-4 rounded-xl border border-border bg-card p-5">
              <span
                aria-hidden="true"
                className="grid size-7 shrink-0 place-items-center rounded-md bg-accent font-mono text-[11px] font-semibold text-accent-foreground"
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold">{step}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <h2 className="mt-14 text-xl font-semibold tracking-tight">
          Public build, internal system
        </h2>
        <p className="mt-4 max-w-prose text-base leading-7 text-muted-foreground">
          This is designed as an internal training platform with a public demonstration build in
          front of it. The learning experience is identical in both. What changes is where identity
          and records come from.
        </p>
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[36rem] border-collapse bg-card text-sm">
            <caption className="sr-only">
              How each capability differs between the internal deployment and this public build.
            </caption>
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="p-4 font-medium">
                  Capability
                </th>
                <th scope="col" className="p-4 font-medium">
                  Internal deployment
                </th>
                <th scope="col" className="p-4 font-medium">
                  This public build
                </th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {deployment.map(([capability, internal, demo]) => (
                <tr key={capability} className="border-b border-border last:border-0">
                  <th scope="row" className="p-4 text-left font-medium text-foreground">
                    {capability}
                  </th>
                  <td className="p-4">{internal}</td>
                  <td className="p-4">{demo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-prose text-base leading-7 text-muted-foreground">
          Nothing you enter here is transmitted. There is no account and no server holding your
          details — remove them from your training record and they are gone immediately.
        </p>

        <h2 className="mt-14 text-xl font-semibold tracking-tight">The courses</h2>
        <p className="mt-4 max-w-prose text-base leading-7 text-muted-foreground">
          Three deliberately unrelated subjects. A module that only works for one topic is a
          template, not an instructional approach.
        </p>
        <ul className="mt-6 space-y-3">
          {courses.map((course) => (
            <li key={course.slug} className="rounded-xl border border-border bg-card p-5">
              <p className="eyebrow">
                {course.category} · {course.duration}
              </p>
              <h3 className="mt-1.5 text-sm font-semibold">
                <Link
                  to="/course/$slug"
                  params={{ slug: course.slug }}
                  className="rounded-md underline-offset-4 hover:underline"
                >
                  {course.title}
                </Link>
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{course.summary}</p>
            </li>
          ))}
        </ul>

        {/* Separated deliberately: everything above is the product, this is the
            person who built it. Mixing the two makes the product read as a
            student exercise. */}
        <section
          aria-labelledby="designer-note"
          className="mt-20 rounded-xl border border-border bg-surface p-6 sm:p-8"
        >
          <p className="eyebrow mb-3">Designer’s note</p>
          <h2 id="designer-note" className="text-xl font-semibold tracking-tight">
            Why this exists
          </h2>
          <p className="mt-4 max-w-prose text-base leading-7 text-muted-foreground">
            I built the Learning Library as a portfolio piece for e-learning development and
            instructional design work. Rather than a single demo lesson, I wanted something that
            behaved like a real product — because the difference between a set of lessons and a
            training platform is the administration around them, and that is most of the job.
          </p>

          <h3 className="mt-10 text-base font-semibold">What it demonstrates</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {demonstrates.map((item) => (
              <li key={item.title} className="rounded-xl border border-border bg-card p-5">
                <h4 className="text-sm font-semibold">{item.title}</h4>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ul>

          <h3 className="mt-10 text-base font-semibold">How it was built</h3>
          <p className="mt-3 max-w-prose text-base leading-7 text-muted-foreground">
            React and TypeScript with Tailwind CSS, server-rendered. Every course is data rather
            than markup: a shared schema describes four lesson types — explanation, interactive
            cards, scenario and assessment — and the player renders whatever it finds. Adding a
            course means adding one file and touching no components, which is the separation a real
            content workflow needs when a subject matter expert owns the words and a developer owns
            the shell.
          </p>
          <p className="mt-4 max-w-prose text-base leading-7 text-muted-foreground">
            There is no authoring tool, SCORM package or LMS behind this. The modules are
            hand-built, and the certificates are painted directly to a canvas rather than
            screenshotting the page, so they render identically everywhere without an added
            dependency.
          </p>

          <h3 className="mt-10 text-base font-semibold">AI-assisted production</h3>
          <p className="mt-3 max-w-prose text-base leading-7 text-muted-foreground">
            The outline, first-draft copy and component scaffold were produced with AI assistance
            from a detailed instructional brief I wrote — audience, objectives, screen-by-screen
            purpose, assessment strategy and accessibility requirements. Everything generated was
            then reviewed rather than trusted.
          </p>
          <p className="mt-4 max-w-prose text-base leading-7 text-muted-foreground">
            That review pass caught a pass mark that silently demanded a perfect score, a submitted
            question that dropped out of the keyboard tab order, a status message that would never
            have been announced, and feedback icons carrying meaning with no text equivalent. AI
            compressed the drafting; the accuracy, accessibility and instructional judgement still
            needed a human who knew what to look for.
          </p>

          <p className="mt-8 text-sm text-muted-foreground">
            Built by Segun Paul Olaniyan ·{" "}
            <a
              href="https://github.com/Ola-Segun/accessible-learning-path"
              className="rounded-md font-medium text-primary underline-offset-4 hover:underline"
            >
              Source on GitHub
            </a>
          </p>
        </section>

        <div className="mt-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Browse the courses
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
