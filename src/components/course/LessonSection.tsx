import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
  className?: string;
  /** Key that re-triggers the entrance animation when the lesson changes. */
  animationKey?: string;
};

export function LessonSection({ eyebrow, title, intro, children, className, animationKey }: Props) {
  return (
    <section
      key={animationKey}
      aria-labelledby="lesson-heading"
      className={cn("fade-rise", className)}
    >
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <h2
        id="lesson-heading"
        className="text-2xl font-semibold tracking-tight sm:text-3xl"
      >
        {title}
      </h2>
      {intro ? (
        <p className="mt-4 max-w-prose text-base leading-7 text-muted-foreground">{intro}</p>
      ) : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </section>
  );
}
