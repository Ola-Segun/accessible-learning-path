import type { Course } from "../types";

/**
 * Built from the Module 2.4 lesson package designed for a tech-recruiting
 * curriculum. Audience: career changers with no technical background.
 */
export const technicalProfile: Course = {
  slug: "reading-a-technical-profile",
  title: "Reading a Technical Profile",
  subtitle: "Assessing Engineering Candidates Without a Technical Background",
  category: "Recruiting",
  level: "Beginner",
  duration: "8 min",
  audience: "New recruiters with no engineering background",
  summary:
    "Four signals that separate a strong engineering candidate from one who only matches the keywords.",
  intro:
    "You have run your search and you have ten profiles. Two look identical on paper — same job title, same technology, same number of years. One is a strong candidate. The other will be rejected by your hiring manager in under a minute. This lesson teaches you to tell the difference, without needing to understand the technology yourself.",
  objectives: [
    "Identify the four signals that indicate genuine relevant experience.",
    "Use an AI assistant to translate unfamiliar technical terms into plain language.",
    "Decide whether to shortlist, reject or flag a candidate, and state why.",
  ],
  lessons: [
    {
      kind: "content",
      id: "keyword-trap",
      label: "The keyword trap",
      heading: "Why keyword matching fails",
      intro:
        "Almost every new recruiter starts the same way: the job description says React, the profile says React, so the candidate gets shortlisted. It feels like doing the job. It is the single most expensive habit in tech sourcing.",
      supporting:
        "Keywords tell you what someone has been near. They do not tell you what someone has done. A hiring manager can see the difference in seconds, and a shortlist full of keyword matches is how a new recruiter loses their credibility in the first month.",
      comparison: {
        caption: "Two profiles, identical keywords",
        mono: false,
        negative: {
          label: "Looks qualified",
          code: "“Familiar with React, Angular, Vue, Node, Python, AWS, Docker… Passionate about scalable systems.”",
          note: "Twenty-four technologies and no evidence of building anything. This profile matches more keywords than the one beside it.",
        },
        positive: {
          label: "Is qualified",
          code: "“Rebuilt the checkout flow for a payments product used by ~40,000 monthly customers. Cut failed payments by 30%.”",
          note: "Four technologies listed, one specific outcome with a number attached. Fewer keywords, far more signal.",
        },
      },
      takeaway:
        "Stop asking “does this profile contain the words?” Start asking “what did this person actually build, and when?”",
    },
    {
      kind: "cards",
      id: "signals",
      label: "The four signals",
      heading: "The four signals",
      intro:
        "You are not going to learn every technology, and you do not need to. You need four reliable questions you can ask of any technical profile. Select each one to see what it looks like in practice.",
      cards: [
        {
          id: "depth",
          title: "1. Depth over breadth",
          summary: "Four technologies with detail beats twenty-five in a list",
          problem:
            "A profile listing twenty-five technologies is telling you the person has touched many things briefly. Long tool lists feel impressive and are usually the opposite — they are what someone writes when they have no single thing they can talk about in depth.",
          fix: "Look for a short list with specifics attached. Where a profile names four technologies and describes what was built with them, you are looking at someone who can answer follow-up questions.",
          affects:
            "Not disqualifying on its own — but it means you need evidence before shortlisting",
        },
        {
          id: "shipping",
          title: "2. Evidence of shipping",
          summary: "“Launched”, “migrated”, “used by” — not “familiar with”",
          problem:
            "Proximity language — familiar with, exposed to, passionate about, worked alongside — describes being in the room. It is the most common filler on technical profiles and it carries almost no information.",
          fix: "Look for things that reached real users, with outcomes attached: launched, shipped, migrated, rebuilt, reduced, used by. A number is even better. Real experience has consequences you can point at.",
          affects: "The strongest single signal — weight it highest",
        },
        {
          id: "recency",
          title: "3. Recency",
          summary: "Five years of a skill that ended four years ago is not five years",
          problem:
            "Technology moves. Someone with six years of a language whose last relevant role ended in 2021 has six years of experience that is now partly out of date — but the profile still says six years.",
          fix: "Check when, not just how long. If the relevant work is not recent, that is a question to ask rather than a verdict to pass — they may have kept it current outside work. Asking costs you one message.",
          affects: "Most often mis-read as a reason to reject outright",
        },
        {
          id: "consistency",
          title: "4. Consistency",
          summary: "Does the headline match the actual job history?",
          problem:
            "Profiles that stretch the truth usually stretch in one place and forget the others. A headline claiming senior leadership above a history of six-month junior roles is telling you something.",
          fix: "Read the headline, the job history and the projects as three accounts of the same career. Where they agree, you can trust the profile. Where they disagree, that is your first interview question.",
          affects: "Cheap to check, and it catches the profiles that waste a hiring manager's time",
        },
      ],
    },
    {
      kind: "content",
      id: "ai-translator",
      label: "AI as translator",
      heading: "Use AI to translate, not to decide",
      intro:
        "You will hit terms you do not recognise on almost every profile. That is normal and it never fully stops. This is exactly where an AI assistant earns its place in your workflow — paste the unfamiliar part of the profile in and ask it to explain, in plain English, what the person actually built and whether it is relevant to the role you are filling.",
      supporting:
        "But be careful, because this is where people get burned. AI will explain something confidently and be wrong, and it has no idea what your hiring manager actually wants. If what it tells you contradicts one of the four signals, trust the signals. AI explains what something is; only you can judge whether it counts.",
      comparison: {
        caption: "Asking well, and asking badly",
        mono: false,
        negative: {
          label: "Too vague",
          code: "“Is this candidate good?”",
          note: "It does not know your role, your team or your bar. You will get a confident answer built on nothing, and it will usually say yes.",
        },
        positive: {
          label: "Translation request",
          code: "“Explain what this person actually built, in plain English, and tell me whether it's relevant to a role hiring for React web development.”",
          note: "A bounded question about meaning, not judgement. You keep the decision and get the vocabulary.",
        },
      },
      takeaway:
        "AI explains. You decide. When the AI and the evidence on the profile disagree, the evidence wins.",
    },
    {
      kind: "scenario",
      id: "scenario",
      label: "Assess a candidate",
      heading: "Shortlist, reject, or flag?",
      situation:
        "You are sourcing for a React Developer role — three or more years, building customer-facing web applications. Priya has been a Senior Software Engineer since 2021. She is the lead engineer on a patient-facing mobile app built in React Native, used across three hospital groups, and she migrated it to server-side rendering, cutting load time from 4 seconds to under 1.5. She lists four technologies and mentors two juniors.",
      question: "What is the right call on Priya?",
      choices: [
        {
          id: "a",
          text: "Shortlist — strong depth, clear shipped outcomes, recent work.",
          correct: false,
          rationale:
            "She is genuinely strong on three of the four signals, so this is a reasonable instinct. But her recent work is React Native — mobile — and the role is React for web. Related, not identical. Shortlisting without checking sends your hiring manager a candidate who may not want a web role at all.",
        },
        {
          id: "b",
          text: "Flag for follow-up — the experience is strong but it is mobile, not web.",
          correct: true,
          rationale:
            "The four signals are strong, but the match is not exact, and there is a second open question in the seniority gap: she leads and mentors, and this role may not. Neither is a reason to reject. Both are reasons to ask. “Flag and ask” is a legitimate outcome, and knowing when to use it is most of the skill.",
        },
        {
          id: "c",
          text: "Reject — React Native is not React, so she does not meet the requirement.",
          correct: false,
          rationale:
            "This is keyword matching wearing a disguise. The technologies are closely related and an engineer with her shipping record will likely move between them comfortably. Rejecting on a term mismatch is how you lose your best candidates.",
        },
        {
          id: "d",
          text: "Shortlist — she is senior, so she clears the three-year bar easily.",
          correct: false,
          rationale:
            "Seniority above the requirement is not automatically a fit. A lead who mentors two engineers may find an individual-contributor role a step down, and that is a conversation to have before the hiring manager's time is spent.",
        },
      ],
    },
    {
      kind: "quiz",
      id: "check",
      label: "Knowledge check",
      heading: "Knowledge check",
      intro:
        "Four questions on the signals and on working with AI. You will see feedback after each answer.",
      questions: [
        {
          id: "q1",
          prompt:
            "A candidate's profile lists 25 technologies. What does this most likely indicate?",
          choices: [
            {
              id: "a",
              text: "Exceptional versatility — shortlist immediately.",
              correct: false,
              rationale:
                "Versatility is worth something, but a list on its own is not evidence of it.",
            },
            {
              id: "b",
              text: "Broad exposure rather than depth in any one area.",
              correct: true,
              rationale:
                "Correct — long tool lists signal breadth. Not disqualifying, but you need evidence of what was actually built.",
            },
            {
              id: "c",
              text: "The profile is probably dishonest.",
              correct: false,
              rationale: "It is a common habit, not a sign of dishonesty.",
            },
          ],
          explanation:
            "Treat a long list as a prompt to go looking for outcomes, not as a reason to shortlist or reject.",
        },
        {
          id: "q2",
          prompt: "Which phrase is the strongest evidence of real, shipped experience?",
          choices: [
            {
              id: "a",
              text: "“Familiar with cloud infrastructure.”",
              correct: false,
              rationale: "“Familiar with” describes proximity, not work.",
            },
            {
              id: "b",
              text: "“Migrated our billing system to AWS, cutting downtime by half.”",
              correct: true,
              rationale: "Correct — a specific action with a measurable outcome.",
            },
            {
              id: "c",
              text: "“Passionate about building scalable systems.”",
              correct: false,
              rationale: "Enthusiasm, not evidence.",
            },
          ],
          explanation:
            "Scan for verbs with consequences attached. They are the fastest way to separate real experience from filler.",
        },
        {
          id: "q3",
          prompt:
            "A candidate has six years of Python, but their last Python role ended in 2021. The role needs current Python skills. What should you do?",
          choices: [
            {
              id: "a",
              text: "Reject — the skill is out of date.",
              correct: false,
              rationale:
                "Too harsh. You will lose good candidates who kept the skill current elsewhere.",
            },
            {
              id: "b",
              text: "Shortlist — six years is six years.",
              correct: false,
              rationale:
                "This is the keyword-matching habit again, counting years instead of checking dates.",
            },
            {
              id: "c",
              text: "Flag it and ask about recent work in your outreach.",
              correct: true,
              rationale:
                "Correct — recency is a question to ask, not a verdict to pass. Asking costs one message.",
            },
          ],
          explanation:
            "Most recency gaps resolve in a single exchange. Rejecting on a date is as lazy as shortlisting on a keyword.",
        },
        {
          id: "q4",
          prompt:
            "Your AI assistant explains a candidate's project and calls it highly relevant. The profile shows the work was a two-week course exercise. What do you do?",
          choices: [
            {
              id: "a",
              text: "Trust the AI — it processed more detail than you can.",
              correct: false,
              rationale: "Confident phrasing is not accuracy. It cannot see what you can see.",
            },
            {
              id: "b",
              text: "Trust the profile evidence — AI translates, but it does not decide.",
              correct: true,
              rationale:
                "Correct — AI explains what something is. It cannot judge whether it counts, because it does not know your role, your team or your bar.",
            },
            {
              id: "c",
              text: "Shortlist them and let the hiring manager sort it out.",
              correct: false,
              rationale:
                "This is how new recruiters lose a hiring manager's trust in week one. Filtering is the job.",
            },
          ],
          explanation:
            "When the AI and the evidence conflict, the evidence wins. Keep the tool on translation duty.",
        },
      ],
    },
  ],
  takeaways: [
    "Depth, shipping evidence, recency and consistency — four questions you can ask of any technical profile without understanding the technology.",
    "Proximity language (“familiar with”, “exposed to”) is filler. Outcomes with numbers attached are signal.",
    "AI translates unfamiliar terms into plain language; you keep the decision. When they disagree, the evidence on the profile wins.",
  ],
};
