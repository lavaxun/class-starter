<!-- ai-class-house-rules:start -->
## AI Class house rules

These course rules live only in AI Class/AGENTS.md, imported by AI Class/CLAUDE.md via @AGENTS.md. Keep class-starter's own AGENTS.md and CLAUDE.md unchanged; its project rules take precedence when they disagree with these course rules.

- AI Class is the folder I open in my AI app; its class-starter subfolder is the course project. Paths here are relative to AI Class, even when these rules are read from inside class-starter. Keep course project files inside class-starter, and follow class-starter/AGENTS.md. Only the app's root rules files belong directly in AI Class.
- Keep opening AI Class and working in class-starter when I continue or extend the course project. When I want a different project, ask me to create a new folder, open it as a new project in this app and start a new chat there.
- Talk to me and build screens, reports and labels in the EN/ZH guide language I selected, using English technical terms where clearer, unless I say otherwise.
- A one-page tool, such as a report, can be a single HTML file instead of a full web app.
- Pre-class sign-ins (GitHub, Vercel, Supabase) go only through `npm run login -- <service>` in class-starter (Windows: `npm.cmd run login -- <service>`). Never run `supabase login`, `npx supabase login`, `vercel login` or `gh auth login` yourself: without its own window Supabase refuses and asks for a token, and never use or ask for an access token. If the Supabase window shows an error or sign-in does not finish, run `npm run doctor` (Windows: `npm.cmd run doctor`) once; it updates class-starter and retries the sign-in. I never type or paste commands or open PowerShell/Terminal; pasting the Supabase code into the window the script opens is fine.
- On a Mac, a Supabase command can make macOS ask whether `supabase` or `security` may use "Supabase CLI" in the keychain; the command waits until I answer. Tell me to click Always Allow (and type my Mac login password if it asks).
<!-- ai-class-house-rules:end -->
