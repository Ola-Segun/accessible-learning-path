/**
 * Certificate rendering.
 *
 * Painted straight onto a canvas with the 2D API rather than screenshotting the
 * DOM: no extra dependency, no cross-origin tainting, and the output is
 * identical in every browser. Drawn at 2x so the download stays crisp.
 *
 * The canvas is decorative — every value on it is also rendered as real text
 * beside it, because a canvas is opaque to a screen reader.
 */

export type CertificateData = {
  learnerName: string;
  department: string;
  courseTitle: string;
  courseSubtitle: string;
  score: number;
  total: number;
  completedAt: string;
  certificateId: string;
};

const W = 1000;
const H = 707;
const SCALE = 2;

const COLOR = {
  paper: "#ffffff",
  ink: "#111922",
  muted: "#555d67",
  primary: "#005b7e",
  accent: "#deeef6",
  border: "#e0e3e7",
};

const SANS = '"Instrument Sans", ui-sans-serif, system-ui, sans-serif';
const MONO = '"IBM Plex Mono", ui-monospace, monospace';

/** Wait for webfonts so the certificate does not render in a fallback face. */
async function fontsReady(): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  try {
    await document.fonts.ready;
  } catch {
    /* fall through to whatever is available */
  }
}

/** Break `text` into lines that fit `maxWidth` at the current font. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** `roundRect` is recent enough to be worth a fallback rather than a crash. */
function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export async function drawCertificate(
  canvas: HTMLCanvasElement,
  data: CertificateData,
): Promise<void> {
  await fontsReady();

  canvas.width = W * SCALE;
  canvas.height = H * SCALE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.scale(SCALE, SCALE);
  ctx.textBaseline = "alphabetic";

  // Paper
  ctx.fillStyle = COLOR.paper;
  ctx.fillRect(0, 0, W, H);

  // Accent bar down the left edge
  ctx.fillStyle = COLOR.primary;
  ctx.fillRect(0, 0, 10, H);

  // Inner rule
  ctx.strokeStyle = COLOR.border;
  ctx.lineWidth = 1;
  ctx.strokeRect(44.5, 36.5, W - 89, H - 73);

  const left = 92;
  const contentWidth = W - left - 92;

  // Issuer mark
  ctx.fillStyle = COLOR.primary;
  roundedRect(ctx, left, 78, 34, 34, 7);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = `600 13px ${MONO}`;
  ctx.fillText("LL", left + 8, 100);

  ctx.fillStyle = COLOR.ink;
  ctx.font = `600 15px ${SANS}`;
  ctx.fillText("Learning Library", left + 48, 100);

  // Eyebrow
  ctx.fillStyle = COLOR.muted;
  ctx.font = `500 11px ${MONO}`;
  ctx.letterSpacing = "1.6px";
  ctx.fillText("CERTIFICATE OF COMPLETION", left, 168);
  ctx.letterSpacing = "0px";

  // Recipient
  ctx.fillStyle = COLOR.muted;
  ctx.font = `400 15px ${SANS}`;
  ctx.fillText("This certifies that", left, 208);

  ctx.fillStyle = COLOR.ink;
  ctx.font = `600 46px ${SANS}`;
  const nameLines = wrap(ctx, data.learnerName, contentWidth).slice(0, 2);
  let y = 262;
  for (const line of nameLines) {
    ctx.fillText(line, left, y);
    y += 54;
  }

  // Underline sized to the name
  const nameWidth = Math.min(
    contentWidth,
    Math.max(...nameLines.map((l) => ctx.measureText(l).width)),
  );
  ctx.fillStyle = COLOR.accent;
  ctx.fillRect(left, y - 34, nameWidth, 6);

  // Course
  ctx.fillStyle = COLOR.muted;
  ctx.font = `400 15px ${SANS}`;
  ctx.fillText("has successfully completed", left, y + 6);

  ctx.fillStyle = COLOR.ink;
  ctx.font = `600 26px ${SANS}`;
  const titleLines = wrap(ctx, data.courseTitle, contentWidth).slice(0, 2);
  let ty = y + 46;
  for (const line of titleLines) {
    ctx.fillText(line, left, ty);
    ty += 34;
  }

  ctx.fillStyle = COLOR.muted;
  ctx.font = `400 15px ${SANS}`;
  const subLines = wrap(ctx, data.courseSubtitle, contentWidth).slice(0, 1);
  if (subLines[0]) ctx.fillText(subLines[0], left, ty + 2);

  // Footer detail row
  const footerY = H - 132;
  ctx.strokeStyle = COLOR.border;
  ctx.beginPath();
  ctx.moveTo(left, footerY);
  ctx.lineTo(W - 92, footerY);
  ctx.stroke();

  const columns: [string, string][] = [
    ["SCORE", `${data.score} of ${data.total}`],
    ["COMPLETED", formatDate(data.completedAt)],
    ["CERTIFICATE ID", data.certificateId],
  ];

  columns.forEach(([label, value], i) => {
    const x = left + i * (contentWidth / 3);
    ctx.fillStyle = COLOR.muted;
    ctx.font = `500 10px ${MONO}`;
    ctx.letterSpacing = "1.2px";
    ctx.fillText(label, x, footerY + 30);
    ctx.letterSpacing = "0px";
    ctx.fillStyle = COLOR.ink;
    ctx.font = i === 2 ? `500 15px ${MONO}` : `600 16px ${SANS}`;
    ctx.fillText(value, x, footerY + 54);
  });

  // Provenance line — honest about what this build is.
  ctx.fillStyle = COLOR.muted;
  ctx.font = `400 11px ${SANS}`;
  ctx.fillText(
    `Issued to ${data.department || "—"} · Public demonstration build — not an accredited qualification`,
    left,
    H - 52,
  );
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string): void {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, "image/png");
}

/**
 * Re-issue a certificate without a visible canvas — used by the training record,
 * where a learner downloads a copy of an earlier completion.
 */
export async function downloadCertificate(data: CertificateData, slug: string): Promise<void> {
  const canvas = document.createElement("canvas");
  await drawCertificate(canvas, data);
  downloadCanvas(canvas, certificateFilename(data.learnerName, slug));
}

/** `segun-olaniyan-reading-a-technical-profile-certificate.png` */
export function certificateFilename(learnerName: string, slug: string): string {
  const safeName = learnerName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${safeName || "learner"}-${slug}-certificate.png`;
}
