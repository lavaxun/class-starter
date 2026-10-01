# class-starter · 起步项目（中文版）

[English → README.md](README.md)

这是**课前准备检查项目**。跑起来后，你会看到一个恭喜页面。第一天的仪表板（dashboard）就直接在 `class-starter` 里做。之后的项目（例如 `AI HR`）各有一份自己的副本，放在 `class-starter` 旁边，Codex 会帮你复制。

**它只有一个任务：在你的电脑上跑起来。** 能跑起来，就代表你的开发工具（Node、git、编辑器）都装好了，第一天可以直接开工。

**最简单的方法：跟着 你的课前准备指南 做就可以了。** Codex 会把这个项目下载到你个人主 folder 里的 `AI Class/class-starter`，下载 `AI Class/AGENTS.md`（你直接在 `AI Class` 开工时，它会先帮你建好新项目的 folder），装好需要的东西，再帮你打开页面。下面的命令你不需要自己打。

只有在你想自己动手，或者助教请你这样做的时候，才需要看下面的步骤。

---

## 自己动手（大约 10 分钟）

**第 1 步 · 打开 Terminal**

- **Mac**：按 `Cmd + Space`，输入 `Terminal`，按 Enter
- **Windows**：在 Start 菜单搜索 `PowerShell` 并打开（⚠️ 不是「Command Prompt / cmd」哦）

**第 2 步 · 进入课程 folder**（个人主 folder 里的 `AI Class`，不要放在 Desktop 或 OneDrive；还没有的话这条命令会帮你建好）

Mac：
```bash
mkdir -p ~/"AI Class" && cd ~/"AI Class"
```

Windows（PowerShell）：
```powershell
New-Item -ItemType Directory -Force "$HOME\AI Class"; Set-Location "$HOME\AI Class"
```

**第 3 步 · 一条一条运行下面 4 条命令**（等上一条跑完，再贴下一条）

```bash
git clone https://github.com/lavaxun/class-starter.git
```
> 把项目下载到一个叫 `class-starter` 的 folder

继续下一条命令前，如果 `AI Class/AGENTS.md` 还不存在，请下载课堂规则。Mac 输入：`test -e AGENTS.md || curl -fsSL [link removed] -o AGENTS.md`。Windows（PowerShell）输入：`if (!(Test-Path .\AGENTS.md)) { Invoke-WebRequest [link removed] -OutFile .\AGENTS.md -UseBasicParsing }`。如果已经有这份文件，请不要直接覆盖；除非你决定使用新版，否则保留自己的版本。要换新版时，先把旧版保存在同一 folder，命名为 `AGENTS.backup.md`。

```bash
cd class-starter
```
> 进入这个 folder

```bash
npm install
```
> 安装项目需要的零件，**需要等几分钟**，屏幕滚动很多字是正常的，不用担心

```bash
npm run dev
```
> 启动！看到 `Local: http://localhost:3000` 就表示跑起来了

**第 4 步 · 打开浏览器**，进入 **http://localhost:3000**

看到大大的「Congrats! 🎉」页面 = 成功 ✅（页面是英文的，这是正常的）

![跑起来的样子](docs/success.png)

**第 5 步 · 上课时带上这台电脑**：就是这一台，所有东西都装在它里面 🎉

---

## 常见问题

| 问题 | 解决方法 |
|---|---|
| `npx` 或 `npm` 显示「command not found」 | Node 还没装好。装好 Node 后，**关掉 Terminal 再重新打开**，然后再试一次 |
| `npm install` 卡很久或出现错误 | 换个网络（手机热点通常会快一些），再运行一次 `npm install` |
| 页面打不开 | 请确认 Terminal 还开着，`npm run dev` 还在运行（关掉它，网页就会停） |
| 想停下来 | 在 Terminal 按 `Ctrl + C`。想再开启时，进入 `class-starter` folder 运行 `npm run dev` |
| 卡住超过 10 分钟 | 不用一个人硬撑。第一天早一点到，我们当场帮你搞定 😊 |

---

## 请不要删除这个 folder

`AI Class` 里每个项目各有一个 folder，并排放着：`class-starter`，还有你的课堂项目，例如 `AI HR`、`AI CRM`。每个项目都在自己的 folder 里做。这个项目的 `AGENTS.md` 自带完整规则（tech stack、`data/`、`src/`），你直接在 Codex 打开 `class-starter` 时，Codex 就会照着做。`AI Class/AGENTS.md` 只当「接待处」：如果你直接在 `AI Class` 开工，Codex 会先问你这个项目要放在哪里，建好它的 folder 和它自己的 `AGENTS.md`，再开始做。老师要更改这份文件，请修改 私有 repo 里的原稿 `site/house-rules.md`。你的生意介绍，以及 Codex 该怎么跟你说话（用简单的话、不用技术术语），都放在 `Settings › Personalization › Custom instructions › Codex`，Part 1 会带你完成。AGENTS.md 虽然是英文，你用中文跟 Codex 说话，它就会用中文回复。

想提前点点看也完全可以。不小心改坏了也没关系：把旧的 `class-starter` folder 改名为 `class-starter-old`，再重新运行上面的命令，就会有一份全新的。
