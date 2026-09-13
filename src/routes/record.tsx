import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download, FileDown, Trash2, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LearnerForm } from "@/components/course/LearnerForm";
import { courses, hasPassed, scorableCount } from "@/content";
import { useLearner } from "@/hooks/use-learner";
import { downloadCertificate } from "@/lib/certificate";
import { certificateId, clearLearner } from "@/lib/learner";
import { formatDuration, loadAll, type ProgressMap } from "@/lib/progress";

export const Route = createFileRoute("/record")({
  head: () => ({
    meta: [
      { title: "Training record — Learning Library" },
      {
        name: "description",
        content:
          "Your completions, scores, time spent and certificates across the learning library.",
      },
    ],
  }),
  component: RecordPage,
});

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/** Quote a CSV field only when it needs it. */
function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function RecordPage() {
  const { learner, hydrated, save, refresh } = useLearner();
  const [progress, setProgress] = useState<ProgressMap>({});
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setProgress(loadAll());
  }, []);

  const rows = useMemo(
    () =>
      courses.map((course) => {
        const record = progress[course.slug];
        const total = scorableCount(course);
        const score = record?.score ?? 0;
        return {
          course,
          record,
          total,
          score,
          passed: record?.completed ? hasPassed(course, score, total) : false,
        };
      }),
    [progress],
  );

  const completedCount = rows.filter((r) => r.record?.completed).length;
  const requiredOutstanding = rows.filter((r) => r.course.required && !r.record?.completed).length;
  const totalSeconds = rows.reduce((sum, r) => sum + (r.record?.secondsSpent ?? 0), 0);

  const BOM_UTF8 = "\uFEFF";

  function exportCsv() {
    const header = [
      "Learner",
      "Email",
      "Department",
      "Course",
      "Category",
      "Required",
      "Status",
      "Score",
      "Total",
      "Percent",
      "Result",
      "Attempts",
      "Time spent (min)",
      "Completed",
      "Certificate ID",
    ];
    const lines = rows.map(({ course, record, score, total, passed }) => {
      const percent = record?.completed && total > 0 ? Math.round((score / total) * 100) : 0;
      return [
        learner?.name ?? "",
        learner?.email ?? "",
        learner?.department ?? "",
        course.title,
        course.category,
        course.required ? "Yes" : "No",
        record?.completed ? "Completed" : record ? "In progress" : "Not started",
        record?.completed ? String(score) : "",
        String(total),
        record?.completed ? `${percent}%` : "",
        record?.completed ? (passed ? "Pass" : "Fail") : "",
        String(record?.attempts ?? 0),
        String(Math.round((record?.secondsSpent ?? 0) / 60)),
        record?.completedAt ? new Date(record.completedAt).toISOString().slice(0, 10) : "",
        record?.completedAt && learner && passed
          ? certificateId(learner.email, course.slug, record.completedAt)
          : "",
      ].map(csvCell);
    });

    const csv = [header.join(","), ...lines.map((l) => l.join(","))].join("\r\n");
    // Leading BOM so Excel opens the UTF-8 export without mangling accents.
    const blob = new Blob([BOM_UTF8 + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "training-record.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto max-w-4xl px-5 py-4 sm:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Learning Library
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
        <p className="eyebrow mb-3">Training record</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {hydrated && learner ? learner.name : "Your training record"}
        </h1>
        {hydrated && learner ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {learner.email}
            {learner.department ? ` · ${learner.department}` : ""} · enrolled{" "}
            {formatDate(learner.since)}
          </p>
        ) : null}

        {hydrated && !learner && !editing ? (
          <section className="mt-10 rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2">
              <UserRound aria-hidden="true" className="size-4 text-primary" />
              <h2 className="text-sm font-semibold">Add your details</h2>
            </div>
            <p className="mt-3 max-w-prose text-sm leading-6 text-muted-foreground">
              Your completions are already being recorded. Add a name and email so certificates can
              be issued against them.
            </p>
            <div className="mt-6">
              <LearnerForm submitLabel="Save details" onSubmit={save} />
            </div>
          </section>
        ) : null}

        {hydrated && learner && editing ? (
          <section className="mt-10 rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-sm font-semibold">Update your details</h2>
            <div className="mt-6">
              <LearnerForm
                initial={learner}
                submitLabel="Save details"
                onSubmit={(next) => {
                  save(next);
                  setEditing(false);
                }}
                onCancel={() => setEditing(false)}
              />
            </div>
          </section>
        ) : null}

        <dl className="mt-10 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <dt className="eyebrow">Completed</dt>
            <dd className="mt-1.5 text-2xl font-semibold tabular-nums">
              {completedCount}
              <span className="ml-1 text-base font-medium text-muted-foreground">
                of {courses.length}
              </span>
            </dd>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <dt className="eyebrow">Required outstanding</dt>
            <dd className="mt-1.5 text-2xl font-semibold tabular-nums">{requiredOutstanding}</dd>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <dt className="eyebrow">Time on training</dt>
            <dd className="mt-1.5 text-2xl font-semibold">
              {totalSeconds > 0 ? formatDuration(totalSeconds) : "—"}
            </dd>
          </div>
        </dl>

        <h2 className="mt-14 text-lg font-semibold tracking-tight">Courses</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[44rem] border-collapse bg-card text-sm">
            <caption className="sr-only">
              Your status, score and certificate for every course in the library.
            </caption>
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="p-4 font-medium">
                  Course
                </th>
                <th scope="col" className="p-4 font-medium">
                  Status
                </th>
                <th scope="col" className="p-4 font-medium">
                  Score
                </th>
                <th scope="col" className="p-4 font-medium">
                  Completed
                </th>
                <th scope="col" className="p-4 font-medium">
                  Certificate
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ course, record, score, total, passed }) => (
                <tr key={course.slug} className="border-b border-border last:border-0">
                  <th scope="row" className="p-4 text-left font-medium">
                    <Link
                      to="/course/$slug"
                      params={{ slug: course.slug }}
                      className="rounded-md underline-offset-4 hover:underline"
                    >
                      {course.title}
                    </Link>
                    {course.required ? (
                      <span className="ml-2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground">
                        Required
                      </span>
                    ) : null}
                    <span className="mt-1 block text-xs font-normal text-muted-foreground">
                      {course.category}
                      {record && record.secondsSpent > 0
                        ? ` · ${formatDuration(record.secondsSpent)}`
                        : ""}
                    </span>
                  </th>
                  <td className="p-4">
                    {record?.completed ? (
                      <span className={passed ? "text-success" : "text-destructive"}>
                        {passed ? "Passed" : "Failed"}
                      </span>
                    ) : record ? (
                      "In progress"
                    ) : (
                      <span className="text-muted-foreground">Not started</span>
                    )}
                  </td>
                  <td className="p-4 tabular-nums">
                    {record?.completed ? `${score} / ${total}` : "—"}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {formatDate(record?.completedAt ?? null)}
                  </td>
                  <td className="p-4">
                    {record?.completed && passed && learner && record.completedAt ? (
                      <button
                        type="button"
                        onClick={() =>
                          void downloadCertificate(
                            {
                              learnerName: learner.name,
                              department: learner.department,
                              courseTitle: course.title,
                              courseSubtitle: course.subtitle,
                              score,
                              total,
                              completedAt: record.completedAt!,
                              certificateId: certificateId(
                                learner.email,
                                course.slug,
                                record.completedAt!,
                              ),
                            },
                            course.slug,
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-md font-medium text-primary underline-offset-4 hover:underline"
                      >
                        <Download aria-hidden="true" className="size-3.5" />
                        Download
                      </button>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="outline" onClick={exportCsv}>
            <FileDown aria-hidden="true" className="size-4" />
            Export record (CSV)
          </Button>
          {hydrated && learner ? (
            <>
              <Button variant="outline" onClick={() => setEditing(true)}>
                Edit details
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  clearLearner();
                  refresh();
                  setEditing(false);
                }}
              >
                <Trash2 aria-hidden="true" className="size-4" />
                Remove my details
              </Button>
            </>
          ) : null}
        </div>

        <p className="mt-8 max-w-prose text-xs leading-5 text-muted-foreground">
          In an internal deployment this record is held by the L&amp;D system, populated from SSO,
          and the CSV export is what a manager pulls for compliance reporting. In this public build
          everything lives in your browser — removing your details deletes them immediately and
          nothing was ever transmitted.
        </p>
      </main>
    </div>
  );
}
