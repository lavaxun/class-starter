// `npm run setup`: writes the AI Class house rules, then runs the check and prints the checklist (stdout only: no
// checklist window, and it does not start the course page; `npm run finish` does that after the sign-ins).
// Exit 0 unless Node/npm or the installed course tools fail: pending sign-in rows and the course-page row are normal here.
// Safe to run again.
// ROOT is the folder that contains class-starter (C:\AI Class or ~/AI Class); STARTER is this project.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { reportCheck, root as STARTER, runCheck } from "./check.mjs";

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
  writeIfChanged(join(aiRoot, "AGENTS.md"), (text) => withLine(withHouseRulesBlock(text, block), PROJECT_LINE));
  writeIfChanged(join(aiRoot, "CLAUDE.md"), (text) => withLine(withLine(text, "@AGENTS.md"), "@class-starter/AGENTS.md"));
}

// Replaces the text between the markers, or appends the block when the markers are not there.
function withHouseRulesBlock(text, block) {
  const start = text.indexOf(START);
  const end = text.indexOf(END, start);
  if (start !== -1 && end !== -1) return text.slice(0, start) + block + text.slice(end + END.length);
  return text ? `${text.trimEnd()}\n\n${block}\n` : `${block}\n`;
}

function writeIfChanged(path, update) {
  const before = readText(path);
  const after = update(before);
  if (after !== before) writeFileSync(path, after);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  applyHouseRules();
  console.log(`House rules written to ${ROOT}`);
  const result = await runCheck();
  const { okNode, hasModules, modulesCurrent } = result.state;
  // Real failures only. Sign-in rows (GitHub, Vercel, Supabase) and the course-page row may still be pending.
  const code = okNode && hasModules && modulesCurrent ? 0 : 1;
  result.aiHint = [
    result.aiHint,
    "For the AI: pending sign-in rows and a pending course-page row are normal after setup (exit 0 is success). Next: run the sign-ins, one at a time. The last step, after all three sign-ins, is `npm run finish` (Windows: `npm.cmd run finish`).",
  ]
    .filter(Boolean)
    .join("\n");
  reportCheck(result, { code });
}
