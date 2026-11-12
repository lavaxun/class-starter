// `npm run doctor`: runs the check, repairs each failed row, then prints the check again.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INSTALL_HINT, UPGRADE_HINT, ensureDevServer, reportCheck, root, runCheck } from "./check.mjs";
import { removeOldHouseRules } from "./setup.mjs";

const win = process.platform === "win32";
const BOOTSTRAP = win
  ? '$f="$env:TEMP\\aiclass-bootstrap.ps1"; iwr https://preclass.aiclassmalaysia.com/bootstrap.ps1 -UseBasicParsing -OutFile $f; powershell -NoProfile -ExecutionPolicy Bypass -File $f'
  : 'curl -fsSL https://preclass.aiclassmalaysia.com/bootstrap.sh -o "${TMPDIR:-/tmp}/aiclass-bootstrap.sh" && bash "${TMPDIR:-/tmp}/aiclass-bootstrap.sh"';

const gitEnv = { ...process.env, GIT_TERMINAL_PROMPT: "0" };
const git = (...args) => spawnSync("git", args, { cwd: root, encoding: "utf8", env: gitEnv, timeout: 60_000 });
const AGENTS = join(root, "AGENTS.md");
const SECTION = "## What this project is";

// The "What this project is" section (heading to the next "## " heading), with LF line endings.
function projectSection(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const start = lines.findIndex((l) => l.trim() === SECTION);
  if (start === -1) return { section: "", rest: lines.join("\n") };
  let end = lines.findIndex((l, i) => i > start && l.startsWith("## "));
  if (end === -1) end = lines.length;
  return { section: lines.slice(start + 1, end).join("\n").trim(), rest: [...lines.slice(0, start), ...lines.slice(end)].join("\n") };
}

// Student agents used to write their project answers into AGENTS.md, which blocks `git pull`. Before pulling, move
// edited answers into PROJECT.md (git-ignored), keep any other edits in a new AGENTS.before-update*.md that PROJECT.md
// points to, and restore AGENTS.md. Offline, or already on main's version: AGENTS.md is left untouched.
// Returns true when AGENTS.md now holds no student edits, so it is safe to replace with main's version.
function prepareAgentsFile() {
  if (git("fetch", "--quiet").status !== 0) return false;
  const upstream = git("rev-parse", "--verify", "--quiet", "@{u}:AGENTS.md").stdout.trim();
  if (!upstream || !existsSync(AGENTS)) return false;
  // hash-object applies git's line-ending rules, so a CRLF copy of main's file counts as unchanged.
  const current = git("hash-object", "AGENTS.md").stdout.trim();
  if (current === upstream) return true;
  const known = new Set(git("log", "--raw", "--no-abbrev", "--format=", "@{u}", "--", "AGENTS.md").stdout.match(/[0-9a-f]{40}(?= [AM]\t)/g));
  if (!known.has(current)) {
    const text = readFileSync(AGENTS, "utf8");
    const mine = projectSection(text);
    const versions = [...known].map((blob) => projectSection(git("cat-file", "blob", blob).stdout));
    const answers = mine.section && !versions.some((v) => v.section === mine.section);
    const projectFile = join(root, "PROJECT.md");
    const moved = answers && !existsSync(projectFile);
    if (moved) {
      writeFileSync(projectFile, `# What this project is\n\n${mine.section}\n`);
      console.log("Moved your project answers from AGENTS.md to PROJECT.md.");
    }
    if ((answers && !moved) || !versions.some((v) => v.rest === mine.rest)) {
      let name = "AGENTS.before-update.md";
      for (let n = 2; existsSync(join(root, name)); n++) name = `AGENTS.before-update-${n}.md`;
      writeFileSync(join(root, name), text);
      const pointer = `Earlier project notes are in \`${name}\`. Read it, move the project facts into this file, then delete it.`;
      const project = existsSync(projectFile) ? readFileSync(projectFile, "utf8") : "# What this project is\n";
      writeFileSync(projectFile, `${project.trimEnd()}\n\n${pointer}\n`);
      console.log(`Saved your old AGENTS.md as ${name}; PROJECT.md points to it.`);
    }
  }
  return git("checkout", "HEAD", "--", "AGENTS.md").status === 0;
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

let { state } = await runCheck();

if (!state.okNode) console.log(`Node.js or npm is missing or too old. Run the bootstrap line in a new terminal window:\n${BOOTSTRAP}`);
else if (!state.hasModules || !state.modulesCurrent) {
  console.log("Installing the course tools (npm install)...");
  spawnSync("npm install", { cwd: root, stdio: "inherit", shell: true });
  ({ state } = await runCheck());
}

removeOldHouseRules();

if (!state.hasSupabase || !state.hasVercel) console.log(`The Supabase or Vercel CLI is missing. ${INSTALL_HINT}\nBootstrap line, for a new terminal window:\n${BOOTSTRAP}`);

if (state.supa === "old") console.log(UPGRADE_HINT);

if (state.gh === "missing") console.log(`The GitHub CLI is missing. Run the bootstrap line in a new terminal window:\n${BOOTSTRAP}`);

const signedOut = [["github", state.gh], ["vercel", state.vercel], ["supabase", state.supa]].filter(([, s]) => s === "out").map(([n]) => n);
if (signedOut.length) spawnSync(process.execPath, [join(root, "scripts", "login.mjs"), ...signedOut], { cwd: root, stdio: "inherit" });

if (state.modulesCurrent) await ensureDevServer();

reportCheck(await runCheck(), { window: true });
