# Introduction to Web Accessibility

**An interactive e-learning module — designing digital experiences everyone can use.**

A self-paced 5–7 minute training module for beginners, built end to end: instructional
design, content writing, interaction design, assessment, and front-end implementation.

> **Live demo:** _add deployed URL here_

---

## The brief

Most accessibility training is either a compliance checklist nobody remembers or a
multi-hour course nobody finishes. The goal here was a short module a working designer
or developer could complete in one sitting and immediately apply — one concept, four
concrete barriers, one realistic decision, and a scored check.

|                |                                                        |
| -------------- | ------------------------------------------------------ |
| **Audience**   | Beginners familiar with websites, new to accessibility |
| **Duration**   | 5–7 minutes, self-paced                                |
| **Format**     | Browser-based module, no login, no install             |
| **Assessment** | 1 scenario + 3 scored multiple-choice questions        |

## Learning objectives

By the end of the module, learners can:

1. Explain what web accessibility means.
2. Identify common accessibility barriers.
3. Apply basic accessibility principles when designing digital experiences.

Every screen maps back to one of these three. Nothing was included that did not.

## Instructional approach

| Screen                    | Purpose                          | Method                                                                  |
| ------------------------- | -------------------------------- | ----------------------------------------------------------------------- |
| 1. Welcome                | Set expectations and commitment  | Objectives, duration and audience stated up front                       |
| 2. What is accessibility? | Build the core concept           | Definition, then a side-by-side `div` vs `button` code comparison       |
| 3. Common barriers        | Move from concept to recognition | Four expandable cards: problem → fix → who it affects                   |
| 4. Scenario               | Transfer to a real decision      | Workplace situation with distractor options and rationales for all four |
| 5. Knowledge check        | Confirm retention                | Three questions, immediate feedback, per-option rationale               |
| 6. Completion             | Consolidate                      | Score, pass/review messaging, three takeaways                           |

Design decisions worth naming:

- **Distractors are plausible, not filler.** Each wrong option in the scenario reflects a
  real critique someone might make (form length, button placement, typeface) — the learner
  has to reason about which one is an _accessibility_ barrier rather than a usability nit.
- **Feedback explains every option**, not just the chosen one. Learners who guessed
  correctly still learn why the others fail.
- **Assessment gates progression.** The scenario and each question must be answered before
  Next unlocks, so the module cannot be clicked through passively.
- **Score is shown out of questions answered so far**, not out of the total, so an
  unanswered check never reads as points already lost.

## Accessibility

The module teaches accessibility, so it has to demonstrate it. Implemented and checked:

- Semantic HTML throughout — real `<button>`, `<fieldset>`/`<legend>` for question groups,
  `<label>` bound to every radio input, one `<h1>` and a clean heading order.
- Skip link to the lesson content, and focus moved to the lesson container on every step
  change so keyboard and screen reader users land at the start of new content.
- Answered questions stay focusable and announced rather than being disabled, so answers
  can still be reviewed after submission.
- Correct/incorrect is conveyed as text, not by the tick and cross icons alone — colour
  and iconography are never the only channel.
- A persistent `aria-live` region announces feedback and completion. It exists in the DOM
  before the text changes, which an inline live region would not.
- `role="progressbar"` with an accessible name and `aria-valuetext` describing position in
  words, not just a percentage.
- Visible focus styles on every interactive element; the default outline is replaced, never
  removed.
- Colour contrast verified against WCAG 2.1 AA — body text 6.4:1, muted text on every
  surface variant ≥ 5.8:1, all interactive and status colours above their thresholds.
- `prefers-reduced-motion` respected; all animation is suppressed.
- Responsive from 320px up, tested at mobile, tablet and desktop widths.

## Build

React 19 · TypeScript · TanStack Start (file-based routing, SSR) · Tailwind CSS v4 · Vite

```
src/
  content/course.ts          all course copy, objectives, barriers, scenario, quiz
  components/course/         CourseHeader · ProgressIndicator · LessonSection
                             InteractiveCard · QuizQuestion · FeedbackPanel
                             CompletionScreen
  routes/index.tsx           course flow and state
  routes/about.tsx           portfolio information
  styles.css                 design tokens (oklch), typography, motion
```

**Content is fully separated from presentation.** Every piece of learner-facing copy lives
in `src/content/course.ts` as typed data. Lessons, barriers and questions can be rewritten,
reordered or extended without touching a component — the same separation an authoring
workflow needs when a subject matter expert owns the content and a developer owns the shell.

State is local React state. There is no backend, no database, no authentication and no
tracking, because none of that was needed to demonstrate the learning experience.

## AI-assisted production workflow

This module was produced with AI assistance, and that is deliberate — it is how I think
short-form learning content should be produced at volume.

- **Structure and scaffolding:** the course outline, screen flow and component scaffold were
  generated from a detailed instructional brief I wrote specifying audience, objectives,
  screen-by-screen purpose, assessment strategy, design constraints and accessibility
  requirements. The quality of the output tracked the specificity of that brief.
- **Content drafting:** explanations, barrier descriptions, scenario distractors and quiz
  rationales were AI-drafted against the objectives, then edited for accuracy and tone.
- **Human review — where the real work was:** generated material was verified rather than
  trusted. That pass caught a pass-mark calculation that silently required a perfect score,
  a submitted question that dropped its options out of the keyboard tab order, a live region
  that would never have announced, a progress bar reading 100% mid-assessment, and feedback
  icons carrying meaning with no text equivalent. All are fixed in this repository.
- **Verification:** contrast ratios computed from the design tokens rather than eyeballed;
  full type check, lint and production build run clean.

The takeaway I'd carry into a content pipeline: AI compresses drafting dramatically, and
moves the bottleneck to review. Accuracy, accessibility and instructional soundness still
need a human who knows what to look for.

## What this is not

No Articulate Storyline, Adobe Captivate, SCORM package or LMS integration. This is a
hand-built web module. It demonstrates instructional design, content structuring,
assessment design and accessible front-end implementation — not authoring-tool proficiency.

## Running locally

```sh
git clone https://github.com/Ola-Segun/accessible-learning-path.git
cd accessible-learning-path
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces the production bundle;
`npm run lint` checks formatting and lint rules.

---

Built by **Segun Paul Olaniyan** — [GitHub](https://github.com/Ola-Segun) ·
[LinkedIn](https://linkedin.com/in/segun-olaniyan)
