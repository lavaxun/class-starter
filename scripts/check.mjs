// Pre-class checklist: `npm run check`. Language from PRECLASS_LANG=en|zh, default en.
// Prints five rows and one next step. Exit code 0 only when all five pass.
// Read-only: it runs each tool's own status command and asks the course page on
// ports 3000-3010. It never starts or stops the course page.
import { spawn, spawnSync } from "node:child_process";
import { chmodSync, existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const en = !process.env.PRECLASS_LANG || process.env.PRECLASS_LANG === "en";
export const t = (english, chinese) => (en ? english : chinese);
const ports = Array.from({ length: 11 }, (_, i) => 3000 + i); // Next moves to the next free port.

// Runs a fixed command in the project folder with no keyboard input and a time limit,
// so a login prompt or a slow network cannot hang the checklist.
export function run(command, seconds) {
  return new Promise((resolve) => {
    let out = "";
    let err = "";
    let timedOut = false;
    const child = spawn(command, {
      cwd: root,
      shell: true,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
      env: { ...process.env, CI: "1", NO_UPDATE_NOTIFIER: "1", npm_config_update_notifier: "false" },
    });
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    let done = false;
    const finish = (code) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve({ code: timedOut ? -1 : code, out, err, timedOut });
    };
    // Too slow: report "unknown" and stop waiting. The command is left to end by itself.
    const timer = setTimeout(() => {
      timedOut = true;
      child.stdout.destroy();
      child.stderr.destroy();
      child.unref();
      finish(-1);
    }, seconds * 1000);
    child.on("error", () => finish(-1));
    child.on("close", finish);
  });
}

const signedOutPattern =
  /Access token not provided|No existing credentials found|You are not logged in|Not logged in|Logged out|(invalid|expired).*token|token.*(invalid|not valid|expired)/i;

// in / out / unknown / missing. "unknown" means the network or the tool did not answer:
// the student must not be told to sign in again.
export function signInState(result) {
  if (result.code === 0) return "in";
  if (result.timedOut) return "unknown";
  return signedOutPattern.test(`${result.out}\n${result.err}`) ? "out" : "unknown";
}

function signInNote(state) {
  if (state === "missing") return t("Not installed", "还没装");
  if (state === "unknown") return t("Could not check — sign-in status is unknown", "暂时查不到（登录状态未能确认）");
  return t("Not signed in", "还没登录");
}

function lastLine(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("<") && !line.startsWith(">"))
    .pop() ?? "";
}

// The course template needs Node ^20.19.0 || ^22.13.0 || >=24.
function nodeSupported(version) {
  const [major, minor] = version.replace(/^v/, "").split(".").map(Number);
  return major >= 24 || (major === 22 && minor >= 13) || (major === 20 && minor >= 19);
}

// npm writes node_modules/.package-lock.json last; changed package files need a new install.
export function dependenciesCurrent() {
  const installed = join(root, "node_modules", ".package-lock.json");
  if (!existsSync(installed)) return false;
  const installedTime = statSync(installed).mtimeMs;
  return ["package.json", "package-lock.json"].every((name) => {
    const path = join(root, name);
    return !existsSync(path) || statSync(path).mtimeMs <= installedTime;
  });
}

export const cliInstalled = (name) => existsSync(join(root, "node_modules", name, "package.json"));

// The supabase package is a small launcher; the real program is in @supabase/cli-<os>-<cpu>.
export function supabaseInstalled() {
  const scope = join(root, "node_modules", "@supabase");
  const os = { win32: "windows" }[process.platform] ?? process.platform;
  return (
    cliInstalled("supabase") &&
    existsSync(scope) &&
    readdirSync(scope).some((name) => name.startsWith(`cli-${os}-${process.arch}`))
  );
}

// Returns the URL of the lowest port where a Next.js page answers, or "". Any HTTP status
// counts: students may change the page. The first answer can take a minute while Next.js
// builds the page, so a slow answer is waited for, not taken as "not running".
export async function findPage() {
  const answers = await Promise.all(
    ports.map((port) =>
      fetch(`http://localhost:${port}/`, { redirect: "manual", signal: AbortSignal.timeout(120_000) }).then(
        (response) => /next\.js/i.test(response.headers.get("x-powered-by") ?? ""),
        () => false,
      ),
    ),
  );
  const index = answers.indexOf(true);
  return index === -1 ? "" : `http://localhost:${ports[index]}`;
}

// gh only suggests `gh auth login` when signed out or the token expired; a network failure does not.
function ghState(ghVersion, ghRun) {
  if (!ghVersion) return "missing";
  if (ghRun.code === 0) return "in";
  if (ghRun.timedOut) return "unknown";
  return /not logged in|gh auth login|(invalid|expired).*token|token.*(invalid|expired)/i.test(`${ghRun.out}\n${ghRun.err}`) ? "out" : "unknown";
}

// Sign-in state of one service: github | supabase | vercel -> in / out / unknown / missing.
export async function serviceState(name) {
  if (name === "github") {
    const [v, r] = await Promise.all([run("gh --version", 15), run("gh auth status", 30)]);
    return ghState(v.out.match(/^gh version (\S+)/m)?.[1] ?? "", r);
  }
  if (name === "supabase" ? !supabaseInstalled() : !cliInstalled("vercel")) return "missing";
  return signInState(await run(`npx --no ${name} whoami`, 30));
}

// Windows installers change the saved PATH, but an AI app's open shell keeps the old one. Checking with the
// saved PATH proves the tools work in any new window, so the student never has to open one to check.
function useSavedWindowsPath() {
  if (process.platform !== "win32") return;
  const saved = spawnSync(
    "powershell.exe",
    ["-NoProfile", "-Command", "[Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')"],
    { encoding: "utf8", windowsHide: true, timeout: 15000 },
  );
  if (saved.status === 0 && saved.stdout.trim()) process.env.Path = saved.stdout.trim();
}

// Runs the five checks. Returns { code, text, state }: text is the printed box, code is 0 only when all pass.
export async function runCheck() {
  useSavedWindowsPath();
  const hasSupabase = supabaseInstalled();
  const hasVercel = cliInstalled("vercel");
  const [npmRun, supaRun, vercelRun, ghVersionRun, ghRun, pageUrl] = await Promise.all([
    run("npm --version", 15),
    hasSupabase ? run("npx --no supabase whoami", 30) : null,
    hasVercel ? run("npx --no vercel whoami", 30) : null,
    run("gh --version", 15),
    run("gh auth status", 30),
    findPage(),
  ]);

  // ---- 1. Node.js + npm
  const nodeV = process.version;
  const npmV = npmRun.code === 0 ? npmRun.out.trim() : "";
  const npmOk = /^\d+\.\d+\.\d+/.test(npmV);
  const okNode = nodeSupported(nodeV) && npmOk;
  const noteNode = !nodeSupported(nodeV)
    ? t(`${nodeV} — needs v20.19+, v22.13+ or v24+`, `${nodeV} 版本不符合要求，需要 v20.19+、v22.13+ 或 v24+`)
    : !npmOk
      ? t(`${nodeV} — npm failed or did not return a valid version`, `${nodeV}，但 npm 执行失败或没有返回有效版本`)
      : `${nodeV} / ${npmV}`;

  // ---- 2. Supabase signed in (npx supabase from this project)
  const supa = supaRun ? signInState(supaRun) : "missing";
  const okSupa = supa === "in";
  const noteSupa = okSupa ? "" : signInNote(supa);

  // ---- 3. Vercel signed in (npx vercel from this project)
  const vercel = vercelRun ? signInState(vercelRun) : "missing";
  const who = vercelRun && vercel === "in" ? lastLine(vercelRun.out) : "";
  const okVercel = vercel === "in";
  const noteVercel = okVercel ? who : signInNote(vercel);

  // ---- 4. GitHub CLI signed in
  const ghVersion = ghVersionRun.out.match(/^gh version (\S+)/m)?.[1] ?? "";
  const ghMessage = `${ghRun.out}\n${ghRun.err}`;
  const gh = ghState(ghVersion, ghRun);
  const okGh = gh === "in";
  const ghWho = ghMessage.match(/Logged in to \S+ (?:account|as) ([A-Za-z0-9-]+)/)?.[1] ?? "";
  let noteGh = okGh ? (ghWho ? `v${ghVersion} · ${ghWho}` : `v${ghVersion}`) : signInNote(gh);
  if (!okGh && ghVersion) noteGh = `v${ghVersion} · ${noteGh}`;

  // ---- 5. Course template opens
  const hasModules = existsSync(join(root, "node_modules"));
  const modulesCurrent = dependenciesCurrent();
  const okTpl = Boolean(pageUrl);
  const noteTpl = okTpl
    ? pageUrl
    : !hasModules
      ? t("The files needed by the course template are not installed yet", "课程模板需要的文件还没安装")
      : !modulesCurrent
        ? t("The files needed by the course template need updating; your AI assistant will update them", "课程模板需要的文件要更新；您的 AI 助手会更新")
        : t("The course page is not running yet (ports 3000–3010)", "课程页面还没开（3000–3010 都没有回应）");

  // ---- Print the checklist
  const mark = (ok) => (ok ? "✅" : "⬜");
  const computer = { win32: "Windows", darwin: "macOS" }[process.platform] ?? "Linux";
  const line = "=========================================";
  const rows = [
    [t("Node.js + npm          ", "Node.js + npm          "), okNode, noteNode],
    [t("Supabase signed in     ", "Supabase 已登录     "), okSupa, noteSupa],
    [t("Vercel CLI signed in   ", "Vercel CLI 已登录       "), okVercel, noteVercel],
    [t("GitHub CLI signed in   ", "GitHub CLI 已登录       "), okGh, noteGh],
    [t("Course template opens  ", "课程模板打得开          "), okTpl, noteTpl],
  ];
  const allPass = rows.every(([, ok]) => ok);
  const output = [
    line,
    allPass
      ? `✅ ${t("AI for Business · Pre-class checklist", "AI for Business · 课前准备完成清单")}`
      : `⬜ ${t("AI for Business · Pre-class checklist · not finished yet", "AI for Business · 课前准备清单 · 还没完成")}`,
    line,
    t(`Computer: ${computer}`, `电脑：${computer}`),
    ...rows.map(([label, ok, note], i) => `${i + 1}. ${label}${mark(ok)}  ${note}`.trimEnd()),
    line,
  ];

  const todo = pendingSteps({ okNode, supa, vercel, gh, okTpl, modulesCurrent });

  if (todo.length === 0) {
    output.push(
      t(
        `👉 Next step: Everything is ready 🎉 Open ${pageUrl} to see the course page. Bring this computer and its charger to class.`,
        `👉 下一步：全部好了 🎉 打开 ${pageUrl} 就能看到课程页面。上课那天带这台电脑来 — 就是这一台，加上充电器。`,
      ),
    );
  } else {
    output.push(t(`👉 Next step: ${todo[0]}`, `👉 下一步：${todo[0]}`));
    if (todo.length > 1) output.push(t(`   Remaining: ${todo.slice(1).join("; ")}`, `   之后还有：${todo.slice(1).join("；")}`));
  }
  output.push(line);
  const signedOut = [["github", gh], ["vercel", vercel], ["supabase", supa]].filter(([, s]) => s === "out").map(([n]) => n);
  const aiHint = signedOut.length
    ? `For the AI: run ${signedOut.map((n) => `npm run login -- ${n}`).join(" and ")} in class-starter (Windows: ${signedOut.map((n) => `npm.cmd run login -- ${n}`).join(" and ")}). ${signedOut.includes("supabase") ? "Supabase opens its own window; never run supabase login yourself or use an access token." : "Never run the service's own login command yourself or use an access token."}`
    : "";
  return {
    code: todo.length === 0 ? 0 : 1,
    text: output.join("\n"),
    aiHint,
    state: { okNode, npmOk, supa, vercel, gh, pageUrl, hasModules, modulesCurrent, hasSupabase, hasVercel },
  };
}

// The ordered list of things left to do, said to the student (never "I": the box also shows in the student's
// own window, where nobody speaks). The first one is the "next step".
function pendingSteps({ okNode, supa, vercel, gh, okTpl, modulesCurrent }) {
  const installTools = t(
    "Install the course tools — your AI assistant does this; you do not need to do anything",
    "装课程工具 — 您的 AI 助手会装，您不用做什么",
  );
  const unknownNote = (name) =>
    t(
      `${name} sign-in could not be confirmed. Please do not sign in again yet; ask your AI assistant to run the check again in a few minutes`,
      `${name} 登录状态暂时未能确认。请先不要重新登录；过几分钟请您的 AI 助手再检查一次`,
    );
  const todo = [];
  if (!okNode)
    todo.push(
      t(
        "Set up Node.js — your AI assistant checks and installs it; if an installer or approval window appears, it tells you what to click",
        "设置 Node.js — 您的 AI 助手会检查和安装；如果出现安装窗口或批准窗口，它会告诉您要按什么",
      ),
    );
  if (supa === "missing" || vercel === "missing") todo.push(installTools);
  if (supa === "unknown") todo.push(unknownNote("Supabase"));
  if (supa === "out")
    todo.push(t("Sign in to Supabase — your AI assistant opens the page; choose Continue with GitHub when it asks", "登录 Supabase — 您的 AI 助手会开页面；请选 Continue with GitHub 登录"));
  if (vercel === "unknown") todo.push(unknownNote("Vercel"));
  if (vercel === "out")
    todo.push(t("Sign in to Vercel — your AI assistant opens the page; choose Continue with GitHub when it asks", "登录 Vercel — 您的 AI 助手会开页面；请选 Continue with GitHub 登录"));
  if (gh === "missing")
    todo.push(t("Install the GitHub CLI — your AI assistant does this; you do not need to do anything", "装 GitHub CLI — 您的 AI 助手会装，您不用做什么"));
  if (gh === "unknown") todo.push(unknownNote("GitHub"));
  if (gh === "out")
    todo.push(
      t(
        "Sign in to GitHub — your AI assistant opens the page; sign up or sign in with the same Google email you use everywhere",
        "登录 GitHub — 您的 AI 助手会开页面；请用您到处都用的同一个 Google email 注册或登录",
      ),
    );
  if (okTpl) return todo;
  if (!modulesCurrent) {
    if (!todo.includes(installTools)) todo.push(installTools);
  } else
    todo.push(
      t(
        "Course template — your AI assistant starts it in a new window, then checks again",
        "课程模板 — 您的 AI 助手会在一个新窗口里启动它，然后再检查一次",
      ),
    );
  return todo;
}

// Shows the box in its own window, so an AI app that folds or summarises its tool output cannot hide it.
// Only when nobody is watching a terminal (an AI ran the script); a person in a terminal already sees the box.
function showChecklistWindow(text) {
  if (process.stdout.isTTY) return;
  const file = join(tmpdir(), "ai-class-checklist.txt");
  if (process.platform === "win32") {
    writeFileSync(file, `\uFEFF${text}\n`);
    // The path and title go through env vars, so spaces need no quoting. -NoExit keeps the window open.
    spawn(
      "powershell.exe",
      [
        "-NoProfile",
        "-Command",
        "Start-Process powershell.exe -ArgumentList '-NoProfile','-NoExit','-Command','$Host.UI.RawUI.WindowTitle = $env:AICLASS_TITLE; [Console]::OutputEncoding = [Text.Encoding]::UTF8; Get-Content -Raw -Encoding UTF8 -LiteralPath $env:AICLASS_CHECKLIST'",
      ],
      { env: { ...process.env, AICLASS_CHECKLIST: file, AICLASS_TITLE: "AI Class - Pre-class checklist" }, stdio: "ignore", windowsHide: true },
    ).on("error", () => {});
  } else if (process.platform === "darwin") {
    writeFileSync(file, `${text}\n`);
    // Terminal keeps the window open after the script ends.
    const command = join(tmpdir(), "ai-class-checklist.command");
    writeFileSync(command, `#!/bin/bash\nclear\ncat '${file.replaceAll("'", "'\\''")}'\n`);
    chmodSync(command, 0o755);
    spawn("open", ["-a", "Terminal", command], { stdio: "ignore" }).on("error", () => {});
  }
}

// Printed after the box when an AI ran the script: AI apps fold tool output, and the student only sees the reply.
const PASTE_NOTE =
  "AI assistant: the student cannot see this output. In your reply, paste the checklist block above word for word, " +
  "from the first ===== line to the last, inside a code block, whether it passed or not. Never summarise it or say \"see the checklist above\".";

// The final report of check, setup and doctor: prints the box, shows it in a window, sets the exit code.
export function reportCheck(result) {
  console.log(result.text);
  if (result.aiHint) console.log(result.aiHint);
  if (!process.stdout.isTTY) console.log(`\n${PASTE_NOTE}`);
  showChecklistWindow(result.text);
  process.exitCode = result.code;
}

// `node scripts/check.mjs` prints the box and sets the exit code; doctor and setup import runCheck.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  reportCheck(await runCheck());
}
