import { useId, useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEPARTMENTS, type Learner } from "@/lib/learner";

type Props = {
  initial?: Learner | null;
  submitLabel: string;
  onSubmit: (learner: Learner) => void;
  onCancel?: () => void;
};

type Errors = Partial<Record<"name" | "email", string>>;

export function LearnerForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const nameId = useId();
  const emailId = useId();
  const deptId = useId();
  const errorId = useId();

  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [department, setDepartment] = useState(initial?.department ?? "");
  const [errors, setErrors] = useState<Errors>({});

  function validate(): Errors {
    const next: Errors = {};
    if (!name.trim()) next.name = "Enter the name that should appear on your certificate.";
    // Deliberately permissive: shape only, no pattern-matching people out of
    // their own valid addresses.
    if (!email.trim()) next.email = "Enter an email address so your record can be identified.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "That does not look like an email address.";
    return next;
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const found = validate();
        setErrors(found);
        if (Object.keys(found).length > 0) {
          // Move the learner to the first problem rather than leaving them to hunt.
          document.getElementById(found.name ? nameId : emailId)?.focus();
          return;
        }
        onSubmit({
          name: name.trim(),
          email: email.trim(),
          department,
          since: initial?.since ?? new Date().toISOString(),
        });
      }}
      className="space-y-5"
    >
      <div>
        <label htmlFor={nameId} className="block text-sm font-medium">
          Full name
        </label>
        <p className="mt-1 text-xs text-muted-foreground">This appears on your certificate.</p>
        <input
          id={nameId}
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${errorId}-name` : undefined}
          className="mt-2 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none transition-colors focus-visible:border-primary"
        />
        {errors.name ? (
          <p id={`${errorId}-name`} className="mt-1.5 text-xs text-destructive">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={emailId} className="block text-sm font-medium">
          Work email
        </label>
        <p className="mt-1 text-xs text-muted-foreground">
          Identifies your training record. It stays in this browser.
        </p>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${errorId}-email` : undefined}
          className="mt-2 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none transition-colors focus-visible:border-primary"
        />
        {errors.email ? (
          <p id={`${errorId}-email`} className="mt-1.5 text-xs text-destructive">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={deptId} className="block text-sm font-medium">
          Department <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <select
          id={deptId}
          name="department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="mt-2 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none transition-colors focus-visible:border-primary"
        >
          <option value="">Not specified</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted p-4">
        <Lock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <p className="text-xs leading-5 text-muted-foreground">
          This is a public demonstration build. What you enter is stored in this browser only —
          there is no account, no server and nothing is transmitted. Clear it at any time from your
          training record.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit">{submitLabel}</Button>
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
