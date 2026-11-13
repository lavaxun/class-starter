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
const BLANK = "<to fill in>";
const ANSWER = /^(- \*\*(?:Who uses it|What it solves|What success looks like|Phone or computer)\*\*:)[ \t]*(.*)$/;
const POINTER = /^Earlier project notes are in `[^`]+`\./;
// A PROJECT.md title that holds no project facts.
const HEADING = /^#+\s*(what this project is|project|project\.md|project facts|project notes)?\s*$/i;

// The four project answers (keyed by their "- **Label**:" prefix) and any "Earlier project notes" pointer lines.
function readAnswers(text) {
  const answers = {};
  const pointers = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(ANSWER);
    if (m && m[2].trim() && m[2].trim() !== BLANK) answers[m[1]] = m[2].trim();
    else if (POINTER.test(line)) pointers.push(line.trim());
  }
  return { answers, pointers };
}

// AGENTS.md with LF line endings, every answer blanked and pointer lines dropped: equal to a course version
// when the student changed nothing else.
const normalize = (text) =>
  text.replace(/\r\n/g, "\n").split("\n").filter((l) => !POINTER.test(l))
    .map((l) => l.replace(ANSWER, `$1 ${BLANK}`)).join("\n").replace(/\n{3,}/g, "\n\n").trimEnd();

// Puts each answer into a line that still says <to fill in> and adds missing pointer lines after the answers.
// Keeps the file's line endings.
function fillAnswers(text, { answers, pointers }) {
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const lines = text.split(/\r?\n/);
  let last = -1;
  lines.forEach((line, i) => {
    const m = line.match(ANSWER);
    if (!m) return;
    last = i;
    if (m[2].trim() === BLANK && answers[m[1]]) lines[i] = `${m[1]} ${answers[m[1]]}`;
  });
  const missing = [...new Set(pointers)].filter((p) => !lines.some((l) => l.trim() === p));
  if (missing.length && last !== -1) lines.splice(last + 1, 0, ...missing.flatMap((p) => ["", p]));
  return lines.join(eol);
}

// Every AGENTS.md the course has shipped (blob ids), from main's history, or this copy's history when it has no upstream.
function courseVersions() {
  const ref = git("rev-parse", "--verify", "--quiet", "@{u}").status === 0 ? "@{u}" : "HEAD";
  return new Set(git("log", "--raw", "--no-abbrev", "--format=", ref, "--", "AGENTS.md").stdout.match(/[0-9a-f]{40}(?= [AM]\t)/g));
}

let saved = { answers: {}, pointers: [] };

// Students' agents write their project answers into AGENTS.md, which blocks `git pull`. Before pulling, keep the
// answers in memory, save any other edits in a new AGENTS.before-update*.md that AGENTS.md then points to, and restore
// AGENTS.md. Offline, or already on main's version: AGENTS.md is left untouched.
// Returns true when AGENTS.md now holds no student edits, so it is safe to replace with main's version.
function prepareAgentsFile() {
  if (git("fetch", "--quiet").status !== 0) return false;
  const upstream = git("rev-parse", "--verify", "--quiet", "@{u}:AGENTS.md").stdout.trim();
  if (!upstream || !existsSync(AGENTS)) return false;
  // hash-object applies git's line-ending rules, so a CRLF copy of main's file counts as unchanged.
  const current = git("hash-object", "AGENTS.md").stdout.trim();
  if (current === upstream) return true;
  const known = courseVersions();
  if (!known.has(current)) {
    const text = readFileSync(AGENTS, "utf8");
    saved = readAnswers(text);
    const mine = normalize(text);
    if (![...known].some((blob) => normalize(git("cat-file", "blob", blob).stdout) === mine)) {
      let name = "AGENTS.before-update.md";
      for (let n = 2; existsSync(join(root, name)); n++) name = `AGENTS.before-update-${n}.md`;
      writeFileSync(join(root, name), text);
      saved.pointers.push(`Earlier project notes are in \`${name}\`. Read it, move the project facts into this file, then delete it.`);
      console.log(`Saved your old AGENTS.md as ${name}; AGENTS.md points to it.`);
    }
  }
  return git("checkout", "HEAD", "--", "AGENTS.md").status === 0;
}

// After the update: put the kept answers back into AGENTS.md. A copy from the PROJECT.md era also gets PROJECT.md's
// answers. PROJECT.md is deleted when AGENTS.md now holds all of it, otherwise AGENTS.md points to it.
function restoreAnswers() {
  if (!existsSync(AGENTS)) return;
  const kept = { answers: { ...saved.answers }, pointers: [...saved.pointers] };
  const project = existsSync(PROJECT) ? readFileSync(PROJECT, "utf8") : null;
  const fromProject = project === null ? { answers: {}, pointers: [] } : readAnswers(project);
  kept.answers = { ...fromProject.answers, ...kept.answers };
  kept.pointers.push(...fromProject.pointers);
  const before = readFileSync(AGENTS, "utf8");
  let text = fillAnswers(before, kept);
  if (project !== null) {
    const result = readAnswers(text);
    const courseLines = new Set([...courseVersions()].flatMap((blob) => git("cat-file", "blob", blob).stdout.split(/\r?\n/).map((l) => l.trim())));
    const carried = project.split(/\r?\n/).map((l) => l.trim()).every((l) => {
      if (!l || HEADING.test(l) || courseLines.has(l)) return true;
      const m = l.match(ANSWER);
      if (m) return m[2].trim() === BLANK || result.answers[m[1]] === m[2].trim();
      return POINTER.test(l) && result.pointers.includes(l);
    });
    if (carried) {
      rmSync(PROJECT);
      console.log("Moved your project answers from PROJECT.md into AGENTS.md and deleted PROJECT.md.");
    } else {
      text = fillAnswers(text, { answers: {}, pointers: ["Earlier project notes are in `PROJECT.md`. Read it, move the project facts into this file, then delete it."] });
    }
  }
  if (text !== before) {
    writeFileSync(AGENTS, text);
    if (Object.keys(saved.answers).length) console.log("Kept your project answers in the updated AGENTS.md.");
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
