# class-starter · 起步项目（中文版）

[English → README.md](README.md)

这是一个**起步项目**，你可以用它来做自己想做的东西。跑起来后，你会看到一个恭喜页面。

**先确认它能在你的电脑上跑起来。** 能跑起来，就代表你的开发工具（Node、git、编辑器）都装好了，可以开始做项目。

你可以请你的编程助手帮你下载并设置这个项目，也可以自己照着下面的步骤做。

在你的编程助手里打开这个 folder。里面的 `AGENTS.md` 会让它在写代码前，先问清楚这个项目是做什么的。

---

## 自己动手（大约 10 分钟）

**第 1 步 · 打开 Terminal**

- **Mac**：按 `Cmd + Space`，输入 `Terminal`，按 Enter
- **Windows**：在 Start 菜单搜索 `PowerShell` 并打开（⚠️ 不是「Command Prompt / cmd」哦）

**第 2 步 · 进入你平时放项目的 folder**

在 Terminal 输入 `cd `（后面留一个空格），再输入这个 folder 的位置，然后按 Enter。请选择这台电脑上的 folder，不要用云端同步的 folder。

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

**第 5 步 · 在你的编程助手里打开这个 folder**，告诉它你想做什么。

---

## 常见问题

| 问题 | 解决方法 |
|---|---|
| `npx` 或 `npm` 显示「command not found」 | Node 还没装好。装好 Node 后，**关掉 Terminal 再重新打开**，然后再试一次 |
| `npm install` 卡很久或出现错误 | 换个网络（手机热点通常会快一些），再运行一次 `npm install` |
| 页面打不开 | 请确认 Terminal 还开着，`npm run dev` 还在运行（关掉它，网页就会停） |
| 想停下来 | 在 Terminal 按 `Ctrl + C`。想再开启时，进入 `class-starter` folder 运行 `npm run dev` |
| 卡住超过 10 分钟 | 请找帮你设置的人，把错误信息给对方看 |

---

## 请不要删除这个 folder

请在这个 folder 里继续做项目。里面的 `AGENTS.md` 自带项目规则，包括 tech stack 和怎样保护 `data/` 里的资料。`AGENTS.md` 虽然是英文，你用中文跟编程助手说话，它就会用中文回复。

想点点看也完全可以。如果想要一份全新的，先停止运行，把旧的 `class-starter` folder 改名为 `class-starter-old`，再从它的上一级 folder 重新运行上面的命令。确认需要的代码和资料都保留好之前，不要删除旧 folder。
