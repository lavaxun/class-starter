# class-starter · 起步项目（中文版）

[English → README.md](README.md)

这是课程的**起步项目**。跑起来后，你会看到一个恭喜页面。第一天上课，我们就在这个项目上一步一步，把它变成你团队自己的系统。

**它只有一个任务：在你的电脑上跑起来。** 能跑起来，就代表你的开发工具（Node、git、编辑器）都装好了，第一天可以直接开工。

**最简单的方法：跟着 [课前准备 Part 2](https://pre-class-prep.vercel.app/part2?lang=zh) 做就可以了。** Codex（ChatGPT Desktop App 里的 coding agent）会帮你把这个项目下载到 Desktop 的 `AI Class/class-starter`，装好所有东西，再帮你打开页面。下面的命令你不需要自己打。

只有在你想自己动手，或者助教请你这样做的时候，才需要看下面的步骤。

---

## 自己动手（大约 10 分钟）

**第 1 步 · 打开 Terminal**

- **Mac**：按 `Cmd + Space`，输入 `Terminal`，按 Enter
- **Windows**：在 Start 菜单搜索 `PowerShell` 并打开（⚠️ 不是「Command Prompt / cmd」哦）

**第 2 步 · 进入课程 folder**（Desktop 上的 `AI Class`，还没有的话这条命令会帮你建好）

Mac：
```bash
mkdir -p ~/Desktop/"AI Class" && cd ~/Desktop/"AI Class"
```

Windows（PowerShell）：
```powershell
New-Item -ItemType Directory -Force "$HOME\Desktop\AI Class"; Set-Location "$HOME\Desktop\AI Class"
```

**第 3 步 · 一条一条运行下面 4 条命令**（等上一条跑完，再贴下一条）

```bash
git clone https://github.com/lavaxun/class-starter.git
```
> 把项目下载到一个叫 `class-starter` 的 folder

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

上课第 1 天，你会在 Codex 打开这个 `class-starter` folder。课堂规则在 [docs/house-rules.zh.md](docs/house-rules.zh.md)：一开课先把「沟通方式」贴进 ChatGPT app 的 custom instructions，之后 Codex 会把项目规则写进项目的 `AGENTS.md`（Codex 读取项目规则的文件）。课前不用另外设置这些规则。

想提前点点看也完全可以。不小心改坏了也没关系：把旧的 `class-starter` folder 改名为 `class-starter-old`，再重新运行上面的命令，就会有一份全新的。
