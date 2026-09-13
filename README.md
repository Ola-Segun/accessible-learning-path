# Learning Library

**Three short interactive e-learning modules — and the full learner path around them.**

A self-contained learning library built end to end: instructional design, content writing,
assessment design, interaction design and front-end implementation. Browse a catalogue, read
a course overview, work through lessons, answer a scored check, and pick up where you left
off if you leave.

> **Live demo:** _add deployed URL here_

---

## The courses

| Course                                 | Category   | For                                               | Length |
| -------------------------------------- | ---------- | ------------------------------------------------- | ------ |
| **Reading a Technical Profile**        | Recruiting | New recruiters with no engineering background     | 8 min  |
| **AI Prompts That Get Useful Answers** | AI Skills  | Professionals using AI at work for the first time | 7 min  |
| **Introduction to Web Accessibility**  | Design     | Beginners new to accessibility                    | 6 min  |

Three deliberately unrelated subjects. A module that only works for one topic is a template,
not an instructional approach.

## The learner path

```
/                          Catalogue — filter by category, per-course progress,
                           required-training badge, resume state
/course/$slug              Overview — objectives, syllabus, pass mark, enrolment
/course/$slug/learn        Player — lessons, scenario, scored check,
                           gated navigation, time on task
/course/$slug/complete     Result — pass/fail against the mark, downloadable
                           certificate, retake, next course
/record                    Training record — completions, scores, time spent,
                           certificate re-issue, CSV export
```

Progress is written to `localStorage` on every step, so a learner can close the tab mid-quiz
and return to the same question with their answers intact.

## Built as an internal system with a public build in front of it

The learning experience is identical in both. What changes is where identity and records
come from — and saying so plainly is what keeps the demo honest.

| Capability         | Internal deployment                       | This public build                 |
| ------------------ | ----------------------------------------- | --------------------------------- |
| Learner identity   | SSO and the HR directory                  | Entered once, kept in the browser |
| Assigned training  | Driven by role and department             | Marked on the course              |
| Completion records | Written to the L&D record system          | Stored in the browser             |
| Certificates       | Issued and verifiable against the record  | Generated locally as a PNG        |
| Reporting          | Manager dashboards and compliance exports | CSV export of your own record     |

Nothing entered is transmitted. There is no account and no server; the learner can delete
their details from the training record at any time.

## The record layer

What separates a training platform from a set of lessons is the administration around them:

- **Enrolment** — name, email and optional department captured once, before the first course,
  so a completion has someone's name on it.
- **Pass marks** — every course carries one (67% by default). Below it the result screen says
  so and offers a retake that clears previous answers for a clean run.
- **Certificates** — issued on a pass, with a deterministic ID (`LL-2026-4A9C31`) derived from
  learner, course and completion date, so the same completion always produces the same
  reference. Painted directly to a canvas with the 2D API rather than screenshotting the DOM:
  no extra dependency, no cross-origin tainting, identical output in every browser, and
  downloadable as a PNG at 2x.
- **Training record** — completions, scores, pass/fail, attempts, time on task and certificate
  re-issue, plus a CSV export. In an internal deployment that export is what a manager pulls
  for compliance reporting.
- **Required training** — courses can be flagged as assigned rather than optional, and the
  record counts what is outstanding.

The certificate canvas is `aria-hidden`, because a screen reader cannot read pixels. Every
value painted on it is repeated as real text beside it.

## Instructional approach

Every course is built from four lesson types, and the player renders whichever it finds:

| Type       | Purpose                                                                                  |
| ---------- | ---------------------------------------------------------------------------------------- |
| `content`  | Build a concept — explanation, a side-by-side comparison, one key takeaway               |
| `cards`    | Move from concept to recognition — expandable items with problem, fix and who it affects |
| `scenario` | Transfer to a real decision — a workplace situation with rationales for every option     |
| `quiz`     | Confirm retention — scored questions with immediate feedback                             |

Design decisions worth naming:

- **Distractors are plausible, not filler.** In _Reading a Technical Profile_, the scenario's
  wrong answers are all defensible reads of a genuinely ambiguous candidate — the learner has
  to recognise that "flag and ask" is a legitimate outcome, rather than forcing a yes or no.
- **Feedback explains every option**, not just the chosen one. Learners who guessed correctly
  still learn why the others fail.
- **Assessment gates progression.** Scenarios and quiz questions must be answered before Next
  unlocks, so a course cannot be clicked through passively.
- **Score is shown out of questions answered so far**, not out of the total, so an unanswered
  check never reads as points already lost.
- **Each course opens by naming its objectives** and every screen maps back to one of them.

## Accessibility

One of the modules teaches accessibility, so the library has to demonstrate it throughout:

- Semantic HTML — real `<button>`, `<fieldset>`/`<legend>` for question groups, `<label>`
  bound to every radio input, one `<h1>` per page and a clean heading order.
- Skip links, and focus moved to the lesson container on every step change so keyboard and
  screen reader users land at the start of new content.
- Answered questions stay focusable and announced rather than being disabled, so answers can
  still be reviewed after submission.
- Correct/incorrect is conveyed as text, not by tick and cross icons alone — colour and
  iconography are never the only channel.
- A persistent `aria-live` region announces feedback. It exists in the DOM before the text
  changes, which an inline live region would not.
- `role="progressbar"` with an accessible name and `aria-valuetext` describing position in
  words; catalogue filters are real toggle buttons with `aria-pressed`.
- Visible focus styles everywhere; the default outline is replaced, never removed.
- Colour contrast verified numerically against WCAG 2.1 AA — body text 17:1, muted text
  ≥ 5.8:1 on every surface variant, all interactive and status colours above threshold.
- `prefers-reduced-motion` respected; responsive from 320px up.

## Build

React 19 · TypeScript · TanStack Start (file-based routing, SSR) · Tailwind CSS v4 · Vite

```
src/
  content/
    types.ts                 course + lesson schema, pass-mark rules
    index.ts                 catalogue registry
    courses/*.ts             one file per course — all learner-facing copy
  components/course/         CourseCard · CourseHeader · ProgressIndicator
                             LessonSection · LessonViews · InteractiveCard
                             QuizQuestion · FeedbackPanel · LearnerForm
                             Certificate
  routes/
    index.tsx                catalogue
    course/$slug/            overview · learn · complete
    record.tsx               training record
  lib/
    progress.ts              completion records
    learner.ts               identity + certificate IDs
    certificate.ts           canvas rendering and PNG download
```

**Content is fully separated from presentation.** Adding a course means adding one file to
`src/content/courses/` and registering it — no component changes. That is the same separation
a real content workflow needs when a subject matter expert owns the words and a developer
owns the shell.

State is local React state plus `localStorage`. No backend, no database, no authentication,
no tracking.

## AI-assisted production workflow

Produced with AI assistance, deliberately — it is how I think short-form learning content
should be made at volume.

- **Structure and scaffolding** generated from a detailed instructional brief specifying
  audience, objectives, screen-by-screen purpose, assessment strategy, design constraints and
  accessibility requirements. Output quality tracked the specificity of that brief.
- **Content drafting** — explanations, card copy, scenario distractors and quiz rationales
  drafted against the objectives, then edited for accuracy and tone.
- **Human review, where the real work was.** Generated material was verified rather than
  trusted. That pass caught a pass-mark calculation that silently required a perfect score, a
  submitted question that dropped its options out of the keyboard tab order, a live region
  that would never have announced, a progress bar reading 100% mid-assessment, and feedback
  icons carrying meaning with no text equivalent. All fixed here.
- **Verification** — contrast computed from the design tokens rather than eyeballed; type
  check, lint and production build run clean.

AI compresses drafting dramatically and moves the bottleneck to review. Accuracy,
accessibility and instructional soundness still need a human who knows what to look for.

## What this is not

No Articulate Storyline, Adobe Captivate, SCORM package or LMS integration. These are
hand-built web modules. They demonstrate instructional design, curriculum structure,
assessment design and accessible front-end implementation — not authoring-tool proficiency.

## Running locally

```sh
git clone https://github.com/Ola-Segun/accessible-learning-path.git
cd accessible-learning-path
npm install
npm run dev
```

`npm run build` produces the production bundle; `npm run lint` checks formatting and lint rules.

---

Built by **Segun Paul Olaniyan** — [GitHub](https://github.com/Ola-Segun) ·
[LinkedIn](https://linkedin.com/in/segun-olaniyan)
