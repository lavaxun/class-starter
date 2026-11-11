// `npm run finish`: the last step, after all sign-ins. Starts the course page hidden in the background,
// opens it in the default browser once, then runs the check and shows the one checklist window.
// Exit code = the check result.
import { ensureDevServer, openInBrowser, reportCheck, runCheck } from "./check.mjs";

const url = await ensureDevServer();
if (url) openInBrowser(url);
reportCheck(await runCheck(), { window: true });
