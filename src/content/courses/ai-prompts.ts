import type { Course } from "../types";

/**
 * Audience: non-technical professionals using AI assistants at work for the
 * first time. No prior AI experience assumed.
 */
export const aiPrompts: Course = {
  slug: "ai-prompts-that-work",
  title: "AI Prompts That Get Useful Answers",
  subtitle: "Getting Real Work Out of an AI Assistant",
  category: "AI Skills",
  level: "Beginner",
  duration: "7 min",
  audience: "Professionals using AI assistants at work, no prior experience needed",
  summary:
    "Why most prompts return vague answers, the four parts of one that doesn't, and when not to trust the reply.",
  intro:
    "Most people's first weeks with an AI assistant follow the same pattern: the answers sound impressive, turn out to be generic, and the tool quietly stops getting used. The problem is almost never the tool. This lesson covers what a working prompt contains, and — just as important — how to tell when a confident answer is wrong.",
  objectives: [
    "Explain why vague prompts produce vague answers.",
    "Write a prompt containing role, task, context and format.",
    "Identify when an AI answer needs verifying before you act on it.",
  ],
  lessons: [
    {
      kind: "content",
      id: "why-vague",
      label: "Why prompts fail",
      heading: "Why most prompts return nothing useful",
      intro:
        "An AI assistant will answer whatever you ask, at whatever level of detail you asked at. Ask a vague question and it does not push back or ask what you meant — it fills the gaps with the most average possible answer. That is what generic output actually is: your question, answered literally.",
      supporting:
        "The fix is not longer prompts or clever wording. It is giving the assistant the same context you would give a new colleague before handing them the same task. Nobody expects a new starter to produce good work from one vague sentence, and the same courtesy applies here.",
      comparison: {
        caption: "The same request, asked two ways",
        mono: false,
        negative: {
          label: "Vague",
          code: "“Write a job description for a recruiter.”",
          note: "Nothing here says who for, what seniority, what the team is like, or how long it should be. You will get something that could describe any role at any company.",
        },
        positive: {
          label: "Specific",
          code: "“You're a recruiter writing for a 40-person healthcare startup. Write a job description for a mid-level technical recruiter, 3–5 years, reporting to the Head of Talent. Around 300 words, warm but not casual. Include responsibilities and requirements as bullets.”",
          note: "Role, task, context and format. The answer has somewhere to land.",
        },
      },
      takeaway:
        "A generic answer is usually a generic question coming back to you. Add the context you already have in your head.",
    },
    {
      kind: "cards",
      id: "four-parts",
      label: "The four parts",
      heading: "The four parts of a working prompt",
      intro:
        "You do not need a template library or a prompt-engineering course. You need four things, and you can hold them in your head. Select each one to see what it does.",
      cards: [
        {
          id: "role",
          title: "1. Role",
          summary: "Who the assistant should answer as",
          problem:
            "Without a role, the assistant answers as a generalist, which means the vocabulary, assumptions and level of detail are pitched at nobody in particular.",
          fix: "Open with the perspective you want: “You're an experienced technical recruiter…” or “You're explaining this to someone with no finance background…”. One clause is enough.",
          affects: "Sets vocabulary and depth",
        },
        {
          id: "task",
          title: "2. Task",
          summary: "One clear verb, one clear output",
          problem:
            "Asking for several things at once — summarise this, then rewrite it, then suggest improvements — produces a shallow pass at each. The assistant will not tell you it has spread itself thin.",
          fix: "One task per prompt, stated as a verb: summarise, draft, compare, rewrite, list. If you need three things, ask three times and you will get three better answers.",
          affects: "The single biggest quality lever",
        },
        {
          id: "context",
          title: "3. Context",
          summary: "The facts you have and it does not",
          problem:
            "The assistant knows nothing about your company, your candidate, your audience or last week's conversation. It will invent plausible substitutes for anything you leave out, and it will not flag that it has done so.",
          fix: "Paste the actual material — the job description, the profile, the email thread. Real context beats described context every time.",
          affects: "The difference between a draft you can use and one you rewrite",
        },
        {
          id: "format",
          title: "4. Format",
          summary: "Length, structure and tone",
          problem:
            "Unspecified format means you get the assistant's default: medium length, faintly enthusiastic, often bulleted whether that suits you or not. Then you spend as long reshaping it as writing it yourself.",
          fix: "Say the shape you want: “three bullets, under 100 words, plain and direct” or “a short email, warm, no subject line”. Specifying format is what makes output usable without editing.",
          affects: "Where most of the time saving actually comes from",
        },
      ],
    },
    {
      kind: "content",
      id: "verify",
      label: "When not to trust it",
      heading: "Confidence is not accuracy",
      intro:
        "An AI assistant produces fluent, well-structured text whether or not the content is correct. There is no hesitation in the tone when it is wrong, and no warning in the formatting. The most common way people get caught out is not that the tool lied to them — it is that it sounded exactly the same as when it was right.",
      supporting:
        "So sort your tasks by what a mistake would cost. Drafting, rephrasing, brainstorming and summarising material you supplied are low-risk: you can see the source and judge the output. Facts, figures, names, dates, quotations, legal or medical claims and anything you will send to a client are high-risk — check them against a real source before they leave your hands.",
      takeaway:
        "Use AI freely for shape and draft. Verify anything factual before you act on it — and never let a confident tone stand in for a source.",
    },
    {
      kind: "scenario",
      id: "scenario",
      label: "Fix the prompt",
      heading: "Which prompt would you send?",
      situation:
        "You need to write a rejection email to a candidate who reached final interview for a customer support role. They were strong, the decision was close, and you would genuinely like them to apply again. You have their CV and your interview notes open in front of you.",
      question: "Which prompt will produce the most usable draft?",
      choices: [
        {
          id: "a",
          text: "“Write a rejection email.”",
          correct: false,
          rationale:
            "This is the vague question that started the lesson. You will get a serviceable template with no warmth, no specifics, and nothing about reapplying — and you will end up rewriting all of it.",
        },
        {
          id: "b",
          text: "“Write a really good, professional, empathetic rejection email that is warm and human and not generic.”",
          correct: false,
          rationale:
            "Piling on adjectives feels like adding detail but adds no information. “Not generic” cannot be acted on — the assistant still has no facts about this person, this role or this decision.",
        },
        {
          id: "c",
          text: "“You're a recruiter writing to a final-round candidate for a customer support role. Draft a rejection email: close decision, we'd welcome a future application. Warm and direct, under 150 words, no bullet points. Here are my interview notes: […]”",
          correct: true,
          rationale:
            "All four parts are present — role, task, context and format — and the interview notes give it something real to work from. This is a draft you can send after a light edit.",
        },
        {
          id: "d",
          text: "“Write a rejection email, then make it more empathetic, then shorten it, then suggest three subject lines.”",
          correct: false,
          rationale:
            "Four tasks in one prompt. Each gets a shallow pass, and the later instructions tend to undo the earlier ones. Ask for the draft, then iterate — two prompts will beat this one comfortably.",
        },
      ],
    },
    {
      kind: "quiz",
      id: "check",
      label: "Knowledge check",
      heading: "Knowledge check",
      intro: "Three questions to confirm the essentials. Feedback follows each answer.",
      questions: [
        {
          id: "q1",
          prompt:
            "Your AI assistant keeps returning generic, forgettable answers. What is the most likely cause?",
          choices: [
            {
              id: "a",
              text: "The prompt lacks context, so the assistant is filling the gaps with averages.",
              correct: true,
              rationale: "Correct — a generic answer is usually a generic question coming back.",
            },
            {
              id: "b",
              text: "The model is not capable enough for the task.",
              correct: false,
              rationale:
                "Occasionally true, but far less often than people assume. Try adding context before changing tools.",
            },
            {
              id: "c",
              text: "The prompt is too short — length is what matters.",
              correct: false,
              rationale:
                "Length is not the variable. A short prompt with real context beats a long one without.",
            },
          ],
          explanation:
            "Before reaching for a different tool, add the context you already have in your head.",
        },
        {
          id: "q2",
          prompt:
            "You need a summary, a rewrite and three subject lines. What is the best approach?",
          choices: [
            {
              id: "a",
              text: "Put all three in one prompt to save time.",
              correct: false,
              rationale:
                "You get a shallow pass at each, and later instructions often undo earlier ones.",
            },
            {
              id: "b",
              text: "Ask for them one at a time, in three prompts.",
              correct: true,
              rationale:
                "Correct — one task per prompt. Three prompts produce three usable answers.",
            },
            {
              id: "c",
              text: "Ask for the summary and let it infer the rest.",
              correct: false,
              rationale: "Inference is guesswork. State what you want.",
            },
          ],
          explanation:
            "One clear verb, one clear output. It is the single biggest quality lever available to you.",
        },
        {
          id: "q3",
          prompt:
            "An AI assistant gives you a confident answer including a specific statistic and a source. What should you do before using it?",
          choices: [
            {
              id: "a",
              text: "Use it — the confident tone and named source indicate reliability.",
              correct: false,
              rationale:
                "Tone is not evidence, and cited sources are among the things these tools get wrong most often.",
            },
            {
              id: "b",
              text: "Verify the statistic and the source independently.",
              correct: true,
              rationale:
                "Correct — figures, names, dates and citations are high-risk output. Check before you act.",
            },
            {
              id: "c",
              text: "Ask the assistant whether it is sure.",
              correct: false,
              rationale:
                "It will usually reassure you. Asking a tool to audit itself is not verification.",
            },
          ],
          explanation:
            "Sort tasks by what a mistake would cost. Drafting is low-risk; anything factual leaving your hands is not.",
        },
      ],
    },
  ],
  takeaways: [
    "Generic answers come from generic questions — give the assistant the context you already have in your head.",
    "Role, task, context and format. One task per prompt, and paste the real material rather than describing it.",
    "Confidence is not accuracy. Draft freely, verify anything factual before you act on it.",
  ],
};
