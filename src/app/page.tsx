// 环境验证页：这个页面能在 localhost:3000 打开 = 开发环境装好了。
// 之后我们就在这个项目上，把它一步步长成你部门的系统。
export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-100 px-6 font-sans">
      {/* 背景光晕 */}
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
        <p className="mt-2 text-base text-gray-500">
          恭喜！你的开发环境已经全部装好了。
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {["Node.js 运行正常", "依赖安装成功", "开发服务器已启动"].map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200"
            >
              <span aria-hidden>✓</span> {t}
            </span>
          ))}
        </div>

        <div className="mt-10 border-t border-gray-100 pt-6 text-sm leading-relaxed text-gray-500">
          下一步：<span className="font-semibold text-gray-700">带这台电脑来上课</span>
          （就是这一台，加上充电器 — 东西都装在它里面）
          <br />
          我们就从这里开始 👋
        </div>
      </div>
    </main>
  );
}
