// `npm run login [-- github|vercel|supabase ...]`: signs in the services that are not signed in yet.
// Order: github, vercel, supabase. Each waits up to 10 minutes. Exit 0 only when all are signed in.
import { spawn } from "node:child_process";
import { chmodSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { computerSupabase, INSTALL_HINT, root as STARTER, serviceState, vercelCommand } from "./check.mjs";

const win = process.platform === "win32";
const mac = process.platform === "darwin";
const LIMIT_MS = 10 * 60 * 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const say = (text) => console.log(text);

function open(url) {
  const [cmd, args, env] = win
    ? ["powershell.exe", ["-NoProfile", "-Command", "Start-Process $env:AICLASS_URL"], { AICLASS_URL: url }]
    : [mac ? "open" : "xdg-open", [url], {}];
  spawn(cmd, args, { env: { ...process.env, ...env }, stdio: "ignore", windowsHide: true }).on("error", () => {});
}

function copy(code) {
  const child = win
    ? spawn("powershell.exe", ["-NoProfile", "-Command", "Set-Clipboard -Value $env:AICLASS_CODE"], { env: { ...process.env, AICLASS_CODE: code }, stdio: "ignore", windowsHide: true })
    : mac
      ? spawn("pbcopy", { stdio: ["pipe", "ignore", "ignore"] })
      : null;
  if (!child) return;
  child.on("error", () => {});
  if (mac) child.stdin.end(code);
}

// Resolves with the exit code, or "timeout" after 10 minutes (the child is killed).
function exited(child) {
  return new Promise((resolveExit) => {
    const timer = setTimeout(() => {
      if (win) spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
      else child.kill();
      resolveExit("timeout");
    }, LIMIT_MS);
    child.on("error", () => (clearTimeout(timer), resolveExit(-1)));
    child.on("close", (code) => (clearTimeout(timer), resolveExit(code)));
  });
}

// gh prints a one-time code and a URL when it has no terminal, then waits for the browser step.
async function github() {
  const child = spawn("gh", ["auth", "login", "--hostname", "github.com", "--git-protocol", "https", "--web", "--clipboard"], {
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
  let text = "";
  let code = "";
  let opened = false;
  const scan = (chunk) => {
    text += chunk;
    if (!code) {
      const m = /one-time code[^\n]*?([A-Z0-9]{4}-[A-Z0-9]{4})/i.exec(text);
      if (m) {
        code = m[1];
        if (!/copied/i.test(m[0])) copy(code);
        say(`GitHub one-time code: ${code} (already on the clipboard; paste it on the GitHub page)`);
      }
    }
    if (!opened) {
      const m = /https:\/\/github\.com\/login\/device\S*/.exec(text);
      if (m) {
        opened = true;
        say(`Opening ${m[0]} in the browser. Enter the code, then click Authorize.`);
        open(m[0]);
      }
    }
  };
  child.stdout.on("data", scan);
  child.stderr.on("data", scan);
  const exitCode = await exited(child);
  if (exitCode === "timeout") return "timeout";
  if (exitCode !== 0) return "failed";
  await new Promise((r) => spawn("gh", ["auth", "setup-git"], { stdio: "inherit" }).on("close", r).on("error", r));
  return "done";
}

// vercel opens the browser itself with the code filled in; its own lines say where.
async function vercel() {
  // One command string: Node warns (DEP0190) when separate args go through a shell.
  const child = spawn(vercelCommand("login"), { cwd: STARTER, shell: true, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
  child.stdout.pipe(process.stdout, { end: false });
  child.stderr.pipe(process.stderr, { end: false });
  const code = await exited(child);
  return code === "timeout" ? "timeout" : code === 0 ? "done" : "failed";
}

// supabase login only accepts its verification code from a real terminal, so it gets its own window. --agent no: Claude sets CLAUDECODE, which makes the CLI switch to JSON output and fail with NonInteractiveError.
// It runs the computer-wide program, the same one the check asks: on a Mac only that program reads the Keychain sign-in without an Allow window.
async function supabase() {
  const computer = computerSupabase();
  if (win) {
    spawn(
      "powershell.exe",
      ["-NoProfile", "-Command", "Start-Process powershell.exe -WorkingDirectory $env:AICLASS_DIR -ArgumentList '-NoProfile','-NoExit','-Command','& $env:AICLASS_SUPABASE login --agent no'"],
      { env: { ...process.env, AICLASS_DIR: STARTER, AICLASS_SUPABASE: computer }, stdio: "ignore", windowsHide: true },
    ).on("error", () => {});
  } else if (mac) {
    const file = join(process.env.TMPDIR || tmpdir(), "supabase-login.command");
    writeFileSync(file, `#!/bin/bash\ncd "${STARTER}" && "${computer}" login --agent no\n`);
    chmodSync(file, 0o755);
    spawn("open", ["-a", "Terminal", file], { stdio: "ignore" }).on("error", () => {});
  } else say(`No window can be opened here. A person must run this in their own terminal (an AI must not run it itself): cd "${STARTER}" && "${computer}" login --agent no`);
  say("A new terminal window opened for Supabase. In that window:");
  say("  1. Press Enter (a browser page opens).");
  say("  2. Sign in with GitHub and click Authorize.");
  say("  3. Click Copy on the verification code, paste it into the terminal window and press Enter.");
  const end = Date.now() + LIMIT_MS;
  while (Date.now() < end) {
    await sleep(5000);
    if ((await serviceState("supabase")) === "in") return "done";
  }
  return "timeout";
}

// Said to the AI, not the student: the sign-in did not finish.
const SUPABASE_AI_HINT =
  "For the AI: retry `npm run login -- supabase` in class-starter (Windows: `npm.cmd run login -- supabase`). Never run `supabase login` yourself (without its own window Supabase refuses and asks for a token) and never use or ask for an access token. If the Supabase window showed an error, run `npm run doctor` (Windows: `npm.cmd run doctor`) once.";

const flows = { github, vercel, supabase };
const labels = { github: "GitHub", vercel: "Vercel", supabase: "Supabase" };

export async function login(names) {
  let failed = 0;
  for (const name of names) {
    const label = labels[name];
    let state = await serviceState(name);
    if (state === "in") {
      say(`✅ ${label}: already signed in`);
      continue;
    }
    if (state === "missing") {
      say(`⬜ ${label}: not installed. ${name === "github" ? "Run the bootstrap line again to install the GitHub CLI." : INSTALL_HINT}`);
      failed++;
      continue;
    }
    say(`Signing in to ${label}...`);
    const result = await flows[name]();
    state = await serviceState(name);
    if (state === "in") say(`✅ ${label}: signed in`);
    else {
      failed++;
      say(result === "timeout" ? `⬜ ${label}: did not finish within 10 minutes` : `⬜ ${label}: sign-in did not complete`);
      if (name === "supabase") say(SUPABASE_AI_HINT);
    }
  }
  return failed === 0 ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const asked = process.argv.slice(2);
  const bad = asked.filter((n) => !flows[n]);
  if (bad.length) {
    say(`Unknown service: ${bad.join(", ")}. Use github, vercel or supabase.`);
    process.exit(2);
  }
  process.exitCode = await login(Object.keys(flows).filter((n) => !asked.length || asked.includes(n)));
}
