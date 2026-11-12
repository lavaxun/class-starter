// `npm run setup`: removes the course rules older versions wrote into AI Class, then runs the check and prints the
// checklist (stdout only: no checklist window, and it does not start the course page; `npm run finish` does that after
// the sign-ins). Exit 0 unless Node/npm or the installed course tools fail: pending sign-in rows and the course-page row
// are normal here. Safe to run again.
// ROOT is the folder that contains class-starter (C:\AI Class or ~/AI Class); STARTER is this project.
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { reportCheck, root as STARTER, runCheck } from "./check.mjs";

const ROOT = dirname(STARTER);
const START = "<!-- ai-class-house-rules:start -->";
const END = "<!-- ai-class-house-rules:end -->";
const OLD_LINES = {
  "AGENTS.md": ["The course project is in class-starter/; work there and follow class-starter/AGENTS.md."],
  "CLAUDE.md": ["@AGENTS.md", "@class-starter/AGENTS.md"],
};

// class-starter/AGENTS.md is the only rules file. Older setup and doctor runs wrote ROOT/AGENTS.md (house-rules block +
// project line) and ROOT/CLAUDE.md (two @ imports), which Claude Code also loads in any other project inside AI Class.
// Removes only what they wrote; deletes a file that is then empty, and keeps anything the student added.
export function removeOldHouseRules(aiRoot = ROOT) {
  for (const [name, lines] of Object.entries(OLD_LINES)) {
    const path = join(aiRoot, name);
    if (!existsSync(path)) continue;
    const before = readFileSync(path, "utf8");
    const after = withoutLines(withoutBlock(before), lines);
    if (!after.trim()) rmSync(path);
    else if (after !== before) writeFileSync(path, after);
  }
}

function withoutBlock(text) {
  const start = text.indexOf(START);
  const end = text.indexOf(END, start);
  return start === -1 || end === -1 ? text : text.slice(0, start) + text.slice(end + END.length);
}

function withoutLines(text, lines) {
  const kept = text.split(/\r?\n/).filter((l) => !lines.includes(l.trim()));
  return kept.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  removeOldHouseRules();
  const result = await runCheck();
  const { okNode, hasModules, modulesCurrent, hasSupabase, hasVercel } = result.state;
  // Real failures only: Node/npm, the npm install, or a missing Supabase/Vercel CLI.
  // Sign-in rows (GitHub, Vercel, Supabase) and the course-page row may still be pending.
  const code = okNode && hasModules && modulesCurrent && hasSupabase && hasVercel ? 0 : 1;
  result.aiHint = [
    result.aiHint,
    "For the AI: pending sign-in rows and a pending course-page row are normal after setup (exit 0 is success). Next: run the sign-ins, one at a time. The last step, after all three sign-ins, is `npm run finish` (Windows: `npm.cmd run finish`).",
  ]
    .filter(Boolean)
    .join("\n");
  reportCheck(result, { code });
}
