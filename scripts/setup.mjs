// `npm run setup`: writes the AI Class house rules, starts the course page if it is not running,
// then runs the check and exits with its code. Safe to run again.
// ROOT is the folder that contains class-starter (C:\AI Class or ~/AI Class); STARTER is this project.
import { spawn } from "node:child_process";
import { existsSync, openSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { findPage, root as STARTER, runCheck } from "./check.mjs";

const ROOT = dirname(STARTER);
const START = "<!-- ai-class-house-rules:start -->";
const END = "<!-- ai-class-house-rules:end -->";
const PROJECT_LINE = "The course project is in class-starter/; work there and follow class-starter/AGENTS.md.";

const readText = (path) => (existsSync(path) ? readFileSync(path, "utf8") : "");

// Adds the line at the end unless a line with exactly this text is already there.
function withLine(text, line) {
  if (text.split(/\r?\n/).some((l) => l.trim() === line)) return text;
  return `${text && !text.endsWith("\n") ? `${text}\n` : text}${line}\n`;
}

// Writes ROOT/AGENTS.md (house-rules block + project line) and ROOT/CLAUDE.md (two @ imports).
// Only the text between the markers is ever replaced; class-starter/AGENTS.md is never touched.
export function applyHouseRules(aiRoot = ROOT) {
  const block = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "house-rules.md"), "utf8").trim();
  const agents = join(aiRoot, "AGENTS.md");
  let text = readText(agents);
  const s = text.indexOf(START);
  const e = text.indexOf(END, s);
  if (s !== -1 && e !== -1) text = text.slice(0, s) + block + text.slice(e + END.length);
  else text = text ? `${text.trimEnd()}\n\n${block}\n` : `${block}\n`;
  text = withLine(text, PROJECT_LINE);
  if (text !== readText(agents)) writeFileSync(agents, text);

  const claude = join(aiRoot, "CLAUDE.md");
  const before = readText(claude);
  const after = withLine(withLine(before, "@AGENTS.md"), "@class-starter/AGENTS.md");
  if (after !== before) writeFileSync(claude, after);
}

// Starts `npm run dev` in its own place and waits up to 30 s for it to answer. Does nothing if it already does.
export async function ensureDevServer() {
  if (await findPage()) return;
  if (process.platform === "win32") {
    // A new visible PowerShell window; the path goes through an env var so spaces need no quoting.
    spawn(
      "powershell.exe",
      ["-NoProfile", "-Command", "Start-Process powershell.exe -WorkingDirectory $env:AICLASS_DIR -ArgumentList '-NoProfile','-NoExit','-Command','npm.cmd run dev'"],
      { env: { ...process.env, AICLASS_DIR: STARTER }, stdio: "ignore", detached: true, windowsHide: true },
    ).unref();
  } else {
    const log = openSync(join(ROOT, "class-dev.log"), "a");
    spawn("npm", ["run", "dev"], { cwd: STARTER, stdio: ["ignore", log, log], detached: true }).unref();
  }
  console.log("Starting the course page...");
  for (let i = 0; i < 15; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    if (await findPage()) return;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  applyHouseRules();
  console.log(`House rules written to ${ROOT}`);
  await ensureDevServer();
  const result = await runCheck();
  console.log(result.text);
  process.exitCode = result.code;
}
