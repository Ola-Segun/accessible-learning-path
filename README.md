# Accessible Learning Path

Build a polished, professional e-learning course demo that I can use as a portfolio project when applying for an E-Learning Developer / Instructional Designer position.

The goal is NOT to build a full LMS or an overly complex application. Build a small but highly polished 5–7 minute interactive learning module that demonstrates that I understand instructional design, digital learning, user experience, accessibility, interaction design, and assessment.

Course

Title:

Introduction to Web Accessibility

Subtitle:

Designing Digital Experiences Everyone Can Use

Target audience:
Beginners who have basic familiarity with websites but little knowledge of accessibility.

Course duration:
Approximately 5–7 minutes.

Learning objectives

At the beginning of the course, clearly present 3 learning objectives:

By the end of this lesson, learners will be able to:

Explain what web accessibility means.

Identify common accessibility barriers.

Apply basic accessibility principles when designing digital experiences.

Course structure

Create a simple learning flow:

1. Welcome

A clean introductory screen containing:

Course title

Short introduction

Estimated completion time

"Start Learning" button

Keep the introduction short and professional.

2. What is Accessibility?

Explain web accessibility in simple language.

Use a concise combination of:

Heading

Short paragraph

Simple visual/example

Key takeaway

Avoid large blocks of text.

3. Common Accessibility Barriers

Introduce 3–4 common problems, such as:

Poor color contrast

Images without meaningful alternative text

Forms without clear labels

Interfaces that cannot be used effectively with a keyboard

Present these as interactive cards or simple clickable examples.

When a learner interacts with an example, show a short explanation of why it is a problem and how it can be improved.

4. Interactive Scenario

Create one realistic scenario:

"A website designer has created a signup form. The form contains placeholder text but no visible labels."

Ask:

What is the main accessibility problem?

Provide 3–4 answer choices.

After the learner selects an answer:

Clearly indicate whether it is correct.

Explain why.

Briefly explain why the other choices are less appropriate.

Do not make the interaction unnecessarily complicated.

5. Knowledge Check

Add 3 short multiple-choice questions covering the material.

Show:

Question number

Progress indicator

Answer choices

Immediate feedback

Short explanation

Track the learner's score.

6. Completion

Show a simple completion screen containing:

Course Complete

Display:

Score

Completion message

3 key takeaways

"Review Course" button

"Restart" button

Do not add unnecessary gamification.

Design direction

The interface should look like a modern professional corporate learning platform, not a school project.

Take inspiration from the design quality and simplicity of:

Linear

Stripe

Apple

Vercel

modern corporate learning platforms

Use:

Excellent typography

Strong visual hierarchy

Generous spacing

Subtle borders

Clean cards

Soft shadows where appropriate

Minimal animations

Professional icons

Consistent spacing and components

Avoid:

Excessive gradients

Excessive glassmorphism

Neon colors

Overly flashy animations

Gamification

3D effects

Unnecessary dashboards

Excessive decorative elements

The employer should immediately think:

"This person understands how to design a professional digital learning experience."

Accessibility

Accessibility is especially important because this is an accessibility course.

Implement:

Semantic HTML

Keyboard navigation

Visible focus states

Proper heading hierarchy

Accessible buttons

Accessible form controls

Appropriate ARIA only where necessary

Sufficient color contrast

Screen-reader-friendly labels

Reduced-motion consideration

Responsive design

The course itself should demonstrate the principles it teaches.

Learning experience

Include a simple persistent course header showing:

Introduction to Web Accessibility

and a progress indicator such as:

Lesson 2 of 5

or a subtle progress bar.

Navigation should include:

Previous

Next

Do not allow the learner to become confused about where they are in the course.

Prevent moving forward from an assessment question until an answer has been selected.

Technical implementation

Build this as a polished responsive web application.

Preferred stack:

Next.js

React

TypeScript

Tailwind CSS

shadcn/ui or similarly clean reusable components

Keep the architecture simple and maintainable.

Create reusable components for:

CourseHeader

ProgressIndicator

LessonSection

InteractiveCard

QuizQuestion

FeedbackPanel

CompletionScreen

Store course content separately from UI components so that the course can easily be expanded or edited later.

Do not build authentication, databases, payments, admin dashboards, user accounts, or backend infrastructure.

Local state is sufficient.

Portfolio quality

This project will be presented to employers as evidence of my ability to work as an:

E-Learning Developer / Instructional Designer

Therefore, prioritize:

Instructional clarity

Professional UI

Meaningful interaction

Assessment and feedback

Accessibility

Responsive design

Clean code

Good content structure

Do not prioritize feature quantity.

The finished product should feel like a real miniature corporate training module, not a developer demo.

Portfolio presentation

Also create a small /about or portfolio information section that explains:

Project: Introduction to Web Accessibility
Role: E-Learning Developer / Instructional Designer
Purpose: Demonstration of interactive digital learning development

Include a concise section titled:

What this demonstrates

with:

Instructional design

Interactive learning

Knowledge assessment

Accessibility

Responsive UI development

User-centered design

Do not exaggerate or claim that this project uses Articulate Storyline, Adobe Captivate, SCORM, or an LMS.

Final quality check

Before finishing:

Ensure every button works.

Ensure the entire course can be completed from beginning to end.

Ensure quiz scoring works.

Ensure feedback works.

Ensure progress updates correctly.

Ensure the layout works on desktop, tablet and mobile.

Test keyboard navigation.

Check accessibility issues.

Remove placeholder content.

Remove unnecessary features.

Make the final interface polished enough to show directly to a recruiter.

The final result should be simple, credible, polished and employer-focused.

Do not over-engineer it.
Do not add features just to make the project look bigger.
Make the fundamentals exceptionally good.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/73ee7f06-2580-4b6a-b904-3aca21a4710d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
