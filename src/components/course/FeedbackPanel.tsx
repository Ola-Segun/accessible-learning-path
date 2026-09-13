import { CheckCircle2, Info, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  status: "correct" | "incorrect" | "info";
  title: string;
  children: ReactNode;
  className?: string;
};

const styles = {
  correct: {
    wrap: "border-success/30 bg-success-surface",
    icon: "text-success",
    Icon: CheckCircle2,
  },
  incorrect: {
    wrap: "border-destructive/30 bg-destructive-surface",
    icon: "text-destructive",
    Icon: XCircle,
  },
  info: {
    wrap: "border-border bg-muted",
    icon: "text-primary",
    Icon: Info,
  },
} as const;

export function FeedbackPanel({ status, title, children, className }: Props) {
  const { wrap, icon, Icon } = styles[status];

  return (
    // No live region here: this panel mounts at the same moment as its text, so
    // an inline role="status" is unreliable. The page owns a persistent live
    // region that announces the verdict instead.
    <div className={cn("fade-rise rounded-xl border p-5", wrap, className)}>
      <div className="flex gap-3">
        <Icon aria-hidden="true" className={cn("mt-0.5 size-5 shrink-0", icon)} />
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-semibold">{title}</p>
          <div className="space-y-2 text-sm leading-6 text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
}
