// `npm run doctor`: runs the check, repairs each failed row, then prints the check again.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INSTALL_HINT, UPGRADE_HINT, ensureDevServer, reportCheck, root, runCheck } from "./check.mjs";
import { applyHouseRules } from "./setup.mjs";

const win = process.platform === "win32";
const BOOTSTRAP = win
  ? '$f="$env:TEMP\\aiclass-bootstrap.ps1"; iwr https://preclass.aiclassmalaysia.com/bootstrap.ps1 -UseBasicParsing -OutFile $f; powershell -NoProfile -ExecutionPolicy Bypass -File $f'
  : 'curl -fsSL https://preclass.aiclassmalaysia.com/bootstrap.sh -o "${TMPDIR:-/tmp}/aiclass-bootstrap.sh" && bash "${TMPDIR:-/tmp}/aiclass-bootstrap.sh"';

const gitEnv = { ...process.env, GIT_TERMINAL_PROMPT: "0" };
const git = (...args) => spawnSync("git", args, { cwd: root, encoding: "utf8", env: gitEnv, timeout: 60_000 });
const AGENTS = join(root, "AGENTS.md");
const PROJECT = join(root, "PROJECT.md");
const SECTION = "## What this project is";
const BLANK = "<to fill in>";
const ANSWER = /^(- \*\*(?:Who uses it|What it solves|What success looks like|Phone or computer)\*\*:)[ \t]*(.*)$/;
// A PROJECT.md title that holds no project facts.
const HEADING = /^#+\s*(what this project is|project|project\.md|project facts|project notes)?\s*$/i;
// The AGENTS.md versions that kept the answers in PROJECT.md.
const PROJECT_ERA = /`PROJECT\.md` (in this folder|does not exist)/;
const pointer = (name) => `Earlier project notes are in \`${name}\`. Read it, move the project facts into this file, then delete it.`;

// The "What this project is" section's lines (after the heading, up to the next "## " heading), and the file
// without them, with LF line endings.
function splitSection(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const start = lines.findIndex((l) => l.trim() === SECTION);
  if (start === -1) return { section: [], rest: lines.join("\n").trimEnd() };
  let end = lines.findIndex((l, i) => i > start && l.startsWith("## "));
  if (end === -1) end = lines.length;
  return { section: lines.slice(start + 1, end), rest: [...lines.slice(0, start + 1), ...lines.slice(end)].join("\n").trimEnd() };
}

// Every AGENTS.md the course has shipped, from main's history (this copy's history when it has no upstream):
// the parts outside "What this project is", and every line ever inside it.
let shipped;
function courseVersions() {
  if (shipped) return shipped;
  const ref = git("rev-parse", "--verify", "--quiet", "@{u}").status === 0 ? "@{u}" : "HEAD";
  const blobs = new Set((git("log", "--raw", "--no-abbrev", "--format=", ref, "--", "AGENTS.md").stdout ?? "").match(/[0-9a-f]{40}(?= [AM]\t)/g));
  const versions = [...blobs].map((blob) => splitSection(git("cat-file", "blob", blob).stdout ?? ""));
  shipped = { blobs, rests: versions.map((v) => v.rest), lines: new Set(versions.flatMap((v) => v.section.map((l) => l.trim()))) };
  return shipped;
}

// The student's project notes in some lines: the 4 answers, and every other line no course version has.
function readNotes(lines) {
  const { lines: course } = courseVersions();
  const notes = { answers: {}, extra: [] };
  for (const line of lines) {
    const m = line.trim().match(ANSWER);
    if (m) {
      if (m[2].trim() && m[2].trim() !== BLANK) notes.answers[m[1]] = m[2].trim();
    } else if (line.trim() && !course.has(line.trim()) && !HEADING.test(line.trim())) {
      // A "#" or "##" title from PROJECT.md would end the section in AGENTS.md: make it a "###" title.
      notes.extra.push(line.trimEnd().replace(/^#{1,2}\s+/, "### "));
    }
  }
  return notes;
}

// Puts each answer into its line that still says <to fill in>, and adds the extra lines AGENTS.md lacks after the
// answers. Keeps the file's line endings.
function fillNotes(text, { answers, extra }) {
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const lines = text.split(/\r?\n/);
  let last = -1;
  lines.forEach((line, i) => {
    const m = line.match(ANSWER);
    if (!m) return;
    last = i;
    if (m[2].trim() === BLANK && answers[m[1]]) lines[i] = `${m[1]} ${answers[m[1]]}`;
  });
  const missing = [...new Set(extra)].filter((e) => !lines.some((l) => l.trim() === e.trim()));
  if (missing.length && last !== -1) lines.splice(last + 1, 0, "", ...missing);
  return lines.join(eol);
}

let saved = { answers: {}, extra: [] };

// Students' agents write their project answers into AGENTS.md, which blocks `git pull`. Before pulling, keep the
// student's project notes in memory, save any edits outside "What this project is" in a new AGENTS.before-update*.md
// that AGENTS.md then points to, and restore AGENTS.md. Offline, or already on main's version: AGENTS.md is left untouched.
// Returns true when AGENTS.md now holds no student edits, so it is safe to replace with main's version.
function prepareAgentsFile() {
  if (git("fetch", "--quiet").status !== 0) return false;
  const upstream = git("rev-parse", "--verify", "--quiet", "@{u}:AGENTS.md").stdout.trim();
  if (!upstream || !existsSync(AGENTS)) return false;
  // hash-object applies git's line-ending rules, so a CRLF copy of main's file counts as unchanged.
  const current = git("hash-object", "AGENTS.md").stdout.trim();
  if (current === upstream) return true;
  const { blobs, rests } = courseVersions();
  if (!blobs.has(current)) {
    const text = readFileSync(AGENTS, "utf8");
    const mine = splitSection(text);
    saved = readNotes(mine.section);
    if (!rests.includes(mine.rest)) {
      let name = "AGENTS.before-update.md";
      for (let n = 2; existsSync(join(root, name)); n++) name = `AGENTS.before-update-${n}.md`;
      writeFileSync(join(root, name), text);
      saved.extra.push(pointer(name));
      console.log(`Saved your old AGENTS.md as ${name}; AGENTS.md points to it.`);
    }
  }
  return git("checkout", "HEAD", "--", "AGENTS.md").status === 0;
}

// After the update: put the kept project notes back into AGENTS.md. Once AGENTS.md is a version that keeps the answers
// itself, a copy from the PROJECT.md era also gets PROJECT.md's notes, and PROJECT.md is deleted. When an answer there
// differs from the one in AGENTS.md, PROJECT.md stays and AGENTS.md points to it.
function restoreAnswers() {
  if (!existsSync(AGENTS)) return;
  const before = readFileSync(AGENTS, "utf8");
  const notes = { answers: { ...saved.answers }, extra: [...saved.extra] };
  const fromProject = existsSync(PROJECT) && !PROJECT_ERA.test(before) ? readNotes(readFileSync(PROJECT, "utf8").split(/\r?\n/)) : null;
  if (fromProject) {
    notes.answers = { ...fromProject.answers, ...notes.answers };
    notes.extra.push(...fromProject.extra);
  }
  let text = fillNotes(before, notes);
  if (fromProject) {
    const now = {};
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(ANSWER);
      if (m) now[m[1]] = m[2].trim();
    }
    if (Object.entries(fromProject.answers).every(([label, answer]) => now[label] === answer)) {
      rmSync(PROJECT);
      console.log("Moved your project notes from PROJECT.md into AGENTS.md and deleted PROJECT.md.");
    } else text = fillNotes(text, { answers: {}, extra: [pointer("PROJECT.md")] });
  }
  if (text !== before) {
    writeFileSync(AGENTS, text);
    if (Object.keys(saved.answers).length || saved.extra.length) console.log("Kept your project notes in the updated AGENTS.md.");
  }
}

// Update class-starter first, so an old copy gets the latest login fixes. Doctor starts login.mjs as a child, which reads the new file.
const agentsReady = prepareAgentsFile();
const pull = spawnSync("git", ["pull", "--ff-only"], { cwd: root, stdio: "inherit", env: gitEnv });
if (pull.status !== 0) {
  console.log("Could not update class-starter automatically; continuing with this copy.");
  // Own commits or other edits block the pull: still give the agent main's AGENTS.md.
  if (agentsReady && git("diff", "--quiet", "@{u}", "--", "AGENTS.md").status === 1) {
    git("checkout", "@{u}", "--", "AGENTS.md");
  }
}
restoreAnswers();

let { state } = await runCheck();

if (!state.okNode) console.log(`Node.js or npm is missing or too old. Run the bootstrap line in a new terminal window:\n${BOOTSTRAP}`);
else if (!state.hasModules || !state.modulesCurrent) {
  console.log("Installing the course tools (npm install)...");
  spawnSync("npm install", { cwd: root, stdio: "inherit", shell: true });
  ({ state } = await runCheck());
}

applyHouseRules();

if (!state.hasSupabase || !state.hasVercel) console.log(`The Supabase or Vercel CLI is missing. ${INSTALL_HINT}\nBootstrap line, for a new terminal window:\n${BOOTSTRAP}`);

if (state.supa === "old") console.log(UPGRADE_HINT);

if (state.gh === "missing") console.log(`The GitHub CLI is missing. Run the bootstrap line in a new terminal window:\n${BOOTSTRAP}`);

const signedOut = [["github", state.gh], ["vercel", state.vercel], ["supabase", state.supa]].filter(([, s]) => s === "out").map(([n]) => n);
if (signedOut.length) spawnSync(process.execPath, [join(root, "scripts", "login.mjs"), ...signedOut], { cwd: root, stdio: "inherit" });

if (state.modulesCurrent) await ensureDevServer();

reportCheck(await runCheck(), { window: true });
