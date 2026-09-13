import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  certificateFilename,
  downloadCanvas,
  drawCertificate,
  type CertificateData,
} from "@/lib/certificate";

type Props = {
  data: CertificateData;
  slug: string;
};

export function Certificate({ data, slug }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    void drawCertificate(canvas, data).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [data]);

  return (
    <section aria-labelledby="certificate-heading">
      <h2 id="certificate-heading" className="text-lg font-semibold tracking-tight">
        Your certificate
      </h2>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card p-3 shadow-card">
        {/*
          The canvas is presentational: a screen reader cannot read pixels, so
          every value painted on it is repeated as real text below.
        */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="block h-auto w-full rounded-md"
          style={{ aspectRatio: "1000 / 707" }}
        />
      </div>

      <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
        <div className="flex justify-between gap-4 border-b border-border pb-2 sm:border-0 sm:pb-0">
          <dt className="text-muted-foreground">Issued to</dt>
          <dd className="text-right font-medium">{data.learnerName}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-border pb-2 sm:border-0 sm:pb-0">
          <dt className="text-muted-foreground">Course</dt>
          <dd className="text-right font-medium">{data.courseTitle}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-border pb-2 sm:border-0 sm:pb-0">
          <dt className="text-muted-foreground">Score</dt>
          <dd className="text-right font-medium tabular-nums">
            {data.score} of {data.total}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Certificate ID</dt>
          <dd className="text-right font-mono text-xs font-medium">{data.certificateId}</dd>
        </div>
      </dl>

      <div className="mt-6">
        <Button
          disabled={!ready}
          onClick={() => {
            const canvas = canvasRef.current;
            if (canvas) downloadCanvas(canvas, certificateFilename(data.learnerName, slug));
          }}
        >
          <Download aria-hidden="true" className="size-4" />
          {ready ? "Download certificate (PNG)" : "Preparing certificate…"}
        </Button>
      </div>
    </section>
  );
}
