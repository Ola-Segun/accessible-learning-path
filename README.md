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
                           resume state on every card
/course/$slug              Overview — objectives, syllabus, duration, audience,
                           Start / Resume / Review, reset progress
/course/$slug/learn        Player — lessons, interactive cards, scenario,
                           scored check, gated navigation
/course/$slug/complete     Completion — score, takeaways, and the next
                           unfinished course in the library
```

Progress is written to `localStorage` on every step, so a learner can close the tab mid-quiz
and return to the same question with their answers intact. There is no account system and
nothing leaves the browser.

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
    types.ts                 course + lesson schema
    index.ts                 catalogue registry
    courses/*.ts             one file per course — all learner-facing copy
  components/course/         CourseCard · CourseHeader · ProgressIndicator
                             LessonSection · LessonViews · InteractiveCard
                             QuizQuestion · FeedbackPanel · CompletionScreen
  routes/
    index.tsx                catalogue
    course/$slug/            overview · learn · complete
  lib/progress.ts            localStorage persistence
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
