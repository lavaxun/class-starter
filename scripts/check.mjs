// Pre-class checklist: `npm run check`. Language from PRECLASS_LANG=en|zh, default en.
// Prints five rows and one next step. Exit code 0 only when all five pass.
// `npm run check` is read-only: it runs each tool's own status command and asks the course page on
// ports 3000-3010. It never starts or stops the course page (ensureDevServer, used by finish and doctor, does).
import { spawn, spawnSync } from "node:child_process";
import { chmodSync, existsSync, openSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { delimiter, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const en = !process.env.PRECLASS_LANG || process.env.PRECLASS_LANG === "en";
export const t = (english, chinese) => (en ? english : chinese);
const ports = Array.from({ length: 11 }, (_, i) => 3000 + i); // Next moves to the next free port.

// The Claude desktop app on Windows is a Store-style package: GitHub CLI and Vercel sign-ins made from it are saved
// in its own private copy of AppData (%LOCALAPPDATA%\Packages\Claude_<id>\LocalCache\Roaming), which a normal
// window cannot see. Supabase saves to the home folder, which both share. When a person runs these scripts in a
// normal window (a terminal, not an AI), point both tools at the Claude copy if it exists, so the window checks and
// signs in the same place Claude reads. Inside Claude (no terminal) the tools already see that copy.
function claudeAppConfig() {
  const none = { gh: "", vercel: "" };
  if (process.platform !== "win32" || !process.stdout.isTTY || !process.env.LOCALAPPDATA) return none;
  const packages = join(process.env.LOCALAPPDATA, "Packages");
  const app = existsSync(packages) ? readdirSync(packages).find((name) => name.startsWith("Claude_")) : undefined;
  if (!app) return none;
  const roaming = join(packages, app, "LocalCache", "Roaming");
  const gh = join(roaming, "GitHub CLI");
  const vercel = join(roaming, "com.vercel.cli", "Data");
  return { gh: existsSync(gh) ? gh : "", vercel: existsSync(vercel) ? vercel : "" };
}
const claudeApp = claudeAppConfig();
if (claudeApp.gh) process.env.GH_CONFIG_DIR = claudeApp.gh; // every gh this process starts uses it
// The computer-wide `vercel <sub>` command line, with Vercel pointed at the Claude copy when that applies. "" when Vercel is not installed.
export function vercelCommand(sub) {
  const program = computerProgram("vercel");
  return program ? `"${program}" ${sub}${claudeApp.vercel ? ` --global-config "${claudeApp.vercel}"` : ""}` : "";
}

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
  if (state === "old") return t("Too old", "版本太旧");
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

// Message for the AI when Supabase or Vercel is not installed on the computer.
export const INSTALL_HINT =
  "For the AI: refresh PATH first (see AGENTS.md); if still missing, run the setup guide's Step 2 bootstrap line again; it installs the Supabase and Vercel CLIs for the whole computer.";

// The pre-class bootstrap upgrades a Scoop/Homebrew copy; a copy from another installer can stay old and needs the hint below.
// 3.0.0 is the first v3 CLI: `db push` and `db query` need `--remote` to reach the hosted project.
const MIN_SUPABASE = "3.0.0";
// Intel Mac: Homebrew 7 dropped Intel bottles, so the bootstrap installs the Supabase CLI into ~/.aiclass/bin instead.
// A Rosetta Terminal on Apple Silicon reports x64 but hw.optional.arm64 = 1, so it stays Apple Silicon.
export const isIntelMac = (platform = process.platform, arch = process.arch, arm64 = () => spawnSync("sysctl", ["-n", "hw.optional.arm64"], { encoding: "utf8" }).stdout) =>
  platform === "darwin" && arch === "x64" && String(arm64() ?? "").trim() !== "1";
export const intelBin = () => join(homedir(), ".aiclass", "bin");
export const upgradeCommand = (platform = process.platform, intel = isIntelMac(platform)) =>
  platform === "win32"
    ? "scoop update supabase"
    : intel
      ? 'curl -fsSL https://preclass.aiclassmalaysia.com/cli.sh -o "${TMPDIR:-/tmp}/aiclass-cli.sh" && bash "${TMPDIR:-/tmp}/aiclass-cli.sh"'
      : "brew upgrade supabase";
const olderThan = (version, minimum) => {
  const [a, b] = [version, minimum].map((v) => v.split(".").map(Number));
  const i = a.findIndex((part, index) => part !== b[index]);
  return i !== -1 && a[i] < b[i];
};
export const UPGRADE_HINT = `For the AI: the Supabase CLI is too old (needs ${MIN_SUPABASE} or newer). Run \`${upgradeCommand()}\`, then \`npm run login -- supabase\` again.`;

// Windows: the Claude app's private copy of %APPDATA%\npm (see claudeAppConfig), where `npm install -g` lands when Claude runs the bootstrap.
function claudeAppNpmFolder() {
  if (process.platform !== "win32" || !process.env.LOCALAPPDATA) return "";
  const packages = join(process.env.LOCALAPPDATA, "Packages");
  const app = existsSync(packages) ? readdirSync(packages).find((name) => name.startsWith("Claude_")) : undefined;
  return app ? join(packages, app, "LocalCache", "Roaming", "npm") : "";
}

// Full path of the computer-wide supabase (Scoop, Homebrew, or ~/.aiclass/bin on an Intel Mac) or vercel (npm install -g), or "" when it is not installed.
// There is no copy inside this project. `npm run` puts this project's node_modules/.bin first on PATH, so folders
// containing node_modules are skipped. Folders where the installers put the programs are always searched too: an app
// opened from the Mac Dock may not have Homebrew's folders on PATH, and a Windows window may not have Scoop's or npm's.
const programFound = {};
export function computerProgram(name) {
  if (programFound[name]) return programFound[name];
  useSavedWindowsPath();
  const win = process.platform === "win32";
  const file = win ? (name === "vercel" ? "vercel.cmd" : "supabase.exe") : name;
  const known = win
    ? [join(process.env.SCOOP || join(homedir(), "scoop"), "shims"), process.env.APPDATA && join(process.env.APPDATA, "npm"), claudeAppNpmFolder()]
    : ["/opt/homebrew/bin", "/usr/local/bin"];
  // Intel Mac: ~/.aiclass/bin comes first, so a stale Homebrew copy on PATH cannot hide the current one; the folder is
  // searched even when the app's PATH lacks the ~/.zprofile line.
  const first = isIntelMac() && name === "supabase" ? [intelBin()] : [];
  const found = [...first, ...(process.env.PATH ?? process.env.Path ?? "").split(delimiter), ...known]
    .filter((folder) => folder && !folder.includes("node_modules"))
    .map((folder) => join(folder, file))
    .find((candidate) => existsSync(candidate));
  if (found) programFound[name] = found;
  return found ?? "";
}
export const computerSupabase = () => computerProgram("supabase");

// Supabase sign-in: in / out / unknown / missing / old, from the computer-wide supabase (with a time limit).
// On a Mac the sign-in sits in the Keychain, which lets only the program that saved it read it freely, so
// login.mjs signs in with this same program.
export async function supabaseState() {
  const computer = computerSupabase();
  if (!computer) return "missing";
  const version = (await run(`"${computer}" --version`, 15)).out.match(/\d+\.\d+\.\d+/)?.[0];
  if (version && olderThan(version, MIN_SUPABASE)) return "old";
  return signInState(await run(`"${computer}" whoami`, 20));
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

// Starts `npm run dev` hidden (no terminal window) and waits up to 30 s for it to answer. Does nothing if it already does.
// Output goes to class-dev.log in the project folder. Returns the page URL, or "" if it did not answer in time.
// Windows: cmd.exe runs npm.cmd with windowsHide, detached so it keeps running after this script ends.
// Mac/Linux: `npm run dev` detached with its output in the log.
export async function ensureDevServer() {
  const running = await findPage();
  if (running) return running;
  const log = openSync(join(root, "class-dev.log"), "a");
  const options = { cwd: root, stdio: ["ignore", log, log], detached: true, windowsHide: true };
  const child =
    process.platform === "win32" ? spawn("cmd.exe", ["/c", "npm.cmd run dev"], options) : spawn("npm", ["run", "dev"], options);
  child.on("error", () => {});
  child.unref();
  console.log("Starting the course page (hidden)...");
  for (let i = 0; i < 15; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const url = await findPage();
    if (url) return url;
  }
  return "";
}

// Opens the URL in the default browser. Windows: cmd.exe start; Mac: open; Linux: xdg-open.
export function openInBrowser(url) {
  const [program, args] =
    process.platform === "win32" ? ["cmd.exe", ["/c", "start", "", url]] : process.platform === "darwin" ? ["open", [url]] : ["xdg-open", [url]];
  spawn(program, args, { stdio: "ignore", windowsHide: true }).on("error", () => {});
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
  if (name === "supabase") return supabaseState();
  const whoami = vercelCommand("whoami");
  return whoami ? signInState(await run(whoami, 30)) : "missing";
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
  const hasSupabase = Boolean(computerSupabase());
  const hasVercel = Boolean(computerProgram("vercel"));
  const [npmRun, supa, vercelRun, ghVersionRun, ghRun, pageUrl] = await Promise.all([
    run("npm --version", 15),
    supabaseState(),
    hasVercel ? run(vercelCommand("whoami"), 30) : null,
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

  // ---- 2. Supabase signed in (computer-wide supabase)
  const okSupa = supa === "in";
  const noteSupa = okSupa ? "" : signInNote(supa);

  // ---- 3. Vercel signed in (computer-wide vercel)
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
  const signInHint = signedOut.length
    ? `For the AI: run ${signedOut.map((n) => `npm run login -- ${n}`).join(" and ")} in class-starter (Windows: ${signedOut.map((n) => `npm.cmd run login -- ${n}`).join(" and ")}). ${signedOut.includes("supabase") ? "Supabase opens its own window; never run supabase login yourself or use an access token." : "Never run the service's own login command yourself or use an access token."}`
    : "";
  const aiHint = [!hasSupabase || !hasVercel ? INSTALL_HINT : "", supa === "old" ? UPGRADE_HINT : "", signInHint].filter(Boolean).join("\n");
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
  if (supa === "old") todo.push(t("Update the Supabase CLI — your AI assistant does this; you do not need to do anything", "更新 Supabase CLI — 您的 AI 助手会处理，您不用做什么"));
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
        "Course template — after all sign-ins, your AI assistant runs `npm run finish`: it starts the course page in the background and opens it in your browser",
        "课程模板 — 全部登录完成后，您的 AI 助手会运行 `npm run finish`：它在后台启动课程页面，并在浏览器里打开",
      ),
    );
  return todo;
}

// Shows the box in its own window, so an AI app that folds or summarises its tool output cannot hide it.
// Only when nobody is watching a terminal (an AI ran the script); a person in a terminal already sees the box.
// Callers opt in (reportCheck's { window: true }); setup never does, so no window opens before the sign-ins.
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

// The final report of check, setup, finish and doctor: prints the box, shows it in a window when { window: true }, sets the exit code.
// setup passes its own exit code in { code }.
export function reportCheck(result, { window = false, code = result.code } = {}) {
  console.log(result.text);
  if (result.aiHint) console.log(result.aiHint);
  if (!process.stdout.isTTY) console.log(`\n${PASTE_NOTE}`);
  if (window) showChecklistWindow(result.text);
  process.exitCode = code;
}

// `node scripts/check.mjs` prints the box and sets the exit code; doctor, setup and finish import runCheck.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  reportCheck(await runCheck(), { window: true });
}
