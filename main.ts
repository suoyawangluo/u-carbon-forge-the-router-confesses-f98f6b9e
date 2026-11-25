// The Router Confesses — make.fun entry
// One line, at most 200 characters: a home Wi-Fi router excuses itself
// for dropping the connection at the climax of a movie.
// The joke: the router stopped the movie on purpose — after six years of
// carrying the household's streams, it wanted to see the ending first.
// Router voice: petty, a little smug, with a grudge. No buffering,
// bandwidth or firmware-update clichés.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The excuse, built from named parts so each beat is deliberate.
const SETUP = "I stopped the movie at the climax on purpose";
const TURN = "after six years of carrying your streams";
const PUNCH = "I wanted to see the ending first.";

function buildEntry(): string {
  return `${SETUP} — ${TURN}, ${PUNCH}`;
}

type GateReport = { ok: boolean; reason: string };

function validateEntry(text: string): GateReport {
  const chars = [...text].length;
  if (chars < 1 || chars > 200) return { ok: false, reason: `length ${chars} outside 1-200` };
  if (!text.trim()) return { ok: false, reason: "blank" };
  if (text.trim().split(/\n/).length !== 1) return { ok: false, reason: "not a single line" };
  return { ok: true, reason: "gate passes" };
}

function verifyWritten(path: string): string {
  const bytes = readFileSync(path);
  return createHash("sha256").update(bytes).digest("hex");
}

const entry = buildEntry();
const report = validateEntry(entry);
if (!report.ok) {
  console.error(`gate failed: ${report.reason}`);
  process.exit(1);
}
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, entry, "utf8");
const sha = verifyWritten(outPath);
console.log(`gate passes: ${[...entry].length} characters, 1 line, sha256 ${sha}`);
console.log(`wrote ${outPath}`);
console.log(`verified: ${JSON.stringify(entry)}`);
