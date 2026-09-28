// Setup check page: if this opens at localhost:3000, the development environment is ready.
// From Day 1 we grow this project, step by step, into a system for your team.
export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-100 px-6 font-sans">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />

      <div className="relative w-full max-w-xl rounded-3xl border border-white/60 bg-white/80 p-10 text-center shadow-2xl shadow-indigo-200/50 backdrop-blur-sm sm:p-14">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-300/60">
          <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10 text-white" strokeWidth={3} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Congrats! 🎉
        </h1>
        <p className="mt-4 text-lg font-medium text-gray-700">
          You have successfully set up the development environment.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {["Node.js is running", "Dependencies installed", "Dev server is running"].map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200"
            >
              <span aria-hidden>✓</span> {t}
            </span>
          ))}
        </div>

        <div className="mt-10 border-t border-gray-100 pt-6 text-sm leading-relaxed text-gray-500">
          Next step: <span className="font-semibold text-gray-700">bring this laptop to class</span>
          {" "}(this exact one, plus its charger, since everything is installed on it)
          <br />
          This is where we start 👋
        </div>
      </div>
    </main>
  );
}
