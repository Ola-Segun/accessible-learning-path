/**
 * Course content is kept separate from UI components so the module can be
 * edited or extended without touching presentation code.
 */

export const courseMeta = {
  title: "Introduction to Web Accessibility",
  subtitle: "Designing Digital Experiences Everyone Can Use",
  duration: "5–7 minutes",
  audience: "Beginners with basic familiarity with websites",
  intro:
    "Accessibility is what makes a website usable by as many people as possible, including people who browse with a screen reader, a keyboard only, or in difficult conditions. This short lesson covers the essentials you need before your next design or build.",
  objectives: [
    "Explain what web accessibility means.",
    "Identify common accessibility barriers.",
    "Apply basic accessibility principles when designing digital experiences.",
  ],
} as const;

export type LessonId = "welcome" | "concept" | "barriers" | "scenario" | "check";

export const lessons: { id: LessonId; label: string }[] = [
  { id: "welcome", label: "Welcome" },
  { id: "concept", label: "What is accessibility?" },
  { id: "barriers", label: "Common barriers" },
  { id: "scenario", label: "Interactive scenario" },
  { id: "check", label: "Knowledge check" },
];

export const conceptSection = {
  heading: "What is web accessibility?",
  body: "Web accessibility means designing and building digital products so that people with disabilities can perceive, understand, navigate, and interact with them. That includes people with visual, hearing, motor, cognitive, and temporary or situational limitations — such as a broken arm or bright sunlight on a phone screen.",
  supporting:
    "Accessible design is rarely extra work. It is usually the same work, done with a little more intention: readable text, clear labels, predictable structure, and controls that respond to a keyboard as well as a mouse.",
  example: {
    caption: "Same button, two outcomes",
    inaccessible: {
      label: "Inaccessible",
      code: '<div onclick="save()">Save</div>',
      note: "A styled div. A keyboard cannot reach it and a screen reader announces nothing useful.",
    },
    accessible: {
      label: "Accessible",
      code: "<button type=\"button\" onclick=\"save()\">Save</button>",
      note: "A real button is focusable, announced as a button, and works with Enter and Space.",
    },
  },
  takeaway:
    "Accessibility is about removing barriers, not adding features. Using the right element for the job solves most problems before they exist.",
} as const;

export type Barrier = {
  id: string;
  title: string;
  summary: string;
  problem: string;
  fix: string;
  affects: string;
};

export const barriers: Barrier[] = [
  {
    id: "contrast",
    title: "Poor colour contrast",
    summary: "Light grey text on a white background",
    problem:
      "Text that sits too close to its background in lightness becomes hard to read for people with low vision or colour vision deficiency — and for anyone outdoors on a phone.",
    fix: "Aim for a contrast ratio of at least 4.5:1 for body text and 3:1 for large text or meaningful icons. Check values while designing, not after launch.",
    affects: "Low vision, colour vision deficiency, bright environments",
  },
  {
    id: "alt-text",
    title: "Images without meaningful alt text",
    summary: 'alt="image1.png" or no alt at all',
    problem:
      "Screen reader users hear a filename or nothing at all, so any information carried by the image is lost. If the image is a chart or a button, the task becomes impossible.",
    fix: "Describe the purpose of the image in a short sentence. If the image is purely decorative, use an empty alt=\"\" so it is skipped instead of announced.",
    affects: "Screen reader users, people on slow connections",
  },
  {
    id: "labels",
    title: "Forms without clear labels",
    summary: "Placeholder text used instead of a label",
    problem:
      "Placeholder text disappears as soon as someone types, is often low contrast, and is not reliably announced. Learners lose track of what each field expects.",
    fix: "Give every field a visible <label> tied to its input. Keep placeholders for examples only, never for the field name.",
    affects: "Screen reader users, cognitive load, everyone rechecking a form",
  },
  {
    id: "keyboard",
    title: "Interfaces that fail with a keyboard",
    summary: "Menus and dialogs that only respond to a mouse",
    problem:
      "Many people navigate with a keyboard or switch device. If focus cannot reach a control, or the focus outline is removed, the interface simply stops working for them.",
    fix: "Test every flow with Tab, Shift+Tab, Enter, Space and Escape. Keep a visible focus style, and keep focus order matching the visual order.",
    affects: "Motor disabilities, switch and keyboard users, power users",
  },
];

export type Choice = { id: string; text: string; correct: boolean; rationale: string };

export const scenario = {
  eyebrow: "Interactive scenario",
  heading: "Review a signup form",
  situation:
    "A website designer has created a signup form. The form contains placeholder text inside each field — “Full name”, “Email address”, “Password” — but no visible labels. The placeholder text is light grey.",
  question: "What is the main accessibility problem?",
  choices: [
    {
      id: "a",
      text: "The form has too many fields for new users.",
      correct: false,
      rationale:
        "Form length affects usability, but three fields is reasonable and it is not an accessibility barrier here.",
    },
    {
      id: "b",
      text: "Fields have no persistent, programmatically associated labels.",
      correct: true,
      rationale:
        "Placeholders vanish on typing and are not a reliable accessible name, so screen reader users and anyone reviewing their answers lose the field's purpose. A visible <label for=\"…\"> fixes it.",
    },
    {
      id: "c",
      text: "The submit button should be at the top of the form.",
      correct: false,
      rationale:
        "Button placement is a layout convention, not a barrier. Moving it would not make the fields identifiable.",
    },
    {
      id: "d",
      text: "The form should use a different font family.",
      correct: false,
      rationale:
        "Typeface choice can affect legibility, but the blocking issue is that the fields have no lasting name.",
    },
  ] satisfies Choice[],
} as const;

export type QuizQuestionData = {
  id: string;
  prompt: string;
  choices: Choice[];
  explanation: string;
};

export const quiz: QuizQuestionData[] = [
  {
    id: "q1",
    prompt: "Which statement best describes web accessibility?",
    choices: [
      {
        id: "a",
        text: "Designing products so people with disabilities can perceive, understand and use them.",
        correct: true,
        rationale: "Correct — it is about removing barriers to use.",
      },
      {
        id: "b",
        text: "Adding a separate, simplified version of a website for disabled users.",
        correct: false,
        rationale: "Separate versions fall out of date and exclude people rather than include them.",
      },
      {
        id: "c",
        text: "Making a website load quickly on slow connections.",
        correct: false,
        rationale: "Performance matters, but it is not what accessibility means.",
      },
    ],
    explanation:
      "Accessibility covers perception, understanding, navigation and interaction — for one inclusive experience, not a parallel one.",
  },
  {
    id: "q2",
    prompt: "A photograph of a team is purely decorative. What should its alt text be?",
    choices: [
      {
        id: "a",
        text: 'The filename, for example alt="team-photo-2024.jpg".',
        correct: false,
        rationale: "Filenames are announced verbatim and carry no meaning.",
      },
      {
        id: "b",
        text: 'An empty alt="" so assistive technology skips it.',
        correct: true,
        rationale: "Correct — an empty alt marks the image as decorative.",
      },
      {
        id: "c",
        text: "No alt attribute at all.",
        correct: false,
        rationale: "With no alt attribute, many screen readers fall back to reading the file path.",
      },
    ],
    explanation:
      'Use alt="" for decoration, and a short descriptive sentence whenever the image carries information.',
  },
  {
    id: "q3",
    prompt: "You remove focus outlines because they look untidy. What is the consequence?",
    choices: [
      {
        id: "a",
        text: "Nothing — outlines are only a browser default.",
        correct: false,
        rationale: "They are a functional indicator, not decoration.",
      },
      {
        id: "b",
        text: "Keyboard users can no longer see where they are on the page.",
        correct: true,
        rationale: "Correct — focus becomes invisible and navigation turns into guesswork.",
      },
      {
        id: "c",
        text: "Screen readers stop announcing headings.",
        correct: false,
        rationale: "Heading announcements are unrelated to focus styling.",
      },
    ],
    explanation:
      "If a default focus style does not suit the design, replace it with a clearly visible custom one — never remove it.",
  },
];

export const takeaways = [
  "Accessibility means removing barriers so everyone can perceive, understand and use your product.",
  "Most barriers come from a handful of habits: low contrast, missing alt text, unlabelled fields and mouse-only interactions.",
  "Semantic HTML and a keyboard pass resolve the majority of issues before any audit tool is needed.",
];
