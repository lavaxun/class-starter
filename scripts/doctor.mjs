// `npm run doctor`: runs the check, repairs each failed row, then prints the check again.
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { INSTALL_HINT, UPGRADE_HINT, ensureDevServer, reportCheck, root, runCheck } from "./check.mjs";
import { applyHouseRules } from "./setup.mjs";

const win = process.platform === "win32";
const BOOTSTRAP = win
  ? '$f="$env:TEMP\\aiclass-bootstrap.ps1"; iwr https://preclass.aiclassmalaysia.com/bootstrap.ps1 -UseBasicParsing -OutFile $f; powershell -NoProfile -ExecutionPolicy Bypass -File $f'
  : 'curl -fsSL https://preclass.aiclassmalaysia.com/bootstrap.sh -o "${TMPDIR:-/tmp}/aiclass-bootstrap.sh" && bash "${TMPDIR:-/tmp}/aiclass-bootstrap.sh"';

// Update class-starter first, so an old copy gets the latest login fixes. Doctor starts login.mjs as a child, which reads the new file.
const pull = spawnSync("git", ["pull", "--ff-only"], { cwd: root, stdio: "inherit", env: { ...process.env, GIT_TERMINAL_PROMPT: "0" } });
if (pull.status !== 0) console.log("Could not update class-starter automatically; continuing with this copy.");

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
