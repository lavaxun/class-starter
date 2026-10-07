# class-starter · 起步项目（中文版）

[English → README.md](README.md)

这是一个**起步项目**，你可以用它来做自己想做的东西。跑起来后，你会看到一个恭喜页面。

**先确认它能在你的电脑上跑起来。** 能跑起来，就代表你的开发工具（Node、git、编辑器）都装好了，可以开始做项目。

建议让编程助手帮你设置。想自己运行命令，也可以用下面的「自己动手」路线；两种方法都用**同一个项目 folder**。

---

## 请编程助手帮你设置

1. 在电脑上自己建一个**新的空 folder**，放哪里、叫什么都由你决定。建议不要放在 OneDrive 或 iCloud 等自动同步的位置。
2. 在你的编程助手 app 里，把**这个 folder 本身**选为主要的 **LOCAL 项目 folder**，然后在这里开一个**新对话**。不要选它的上一级 folder。
3. 贴上下面这段话。助手会先说出完整路径；确认是你刚建的 folder，才让它继续。

```text
我选择中文版（ZH）。除非我另外要求，请用中文跟我沟通，并制作中文的
界面、报告和标签；技术用词可以保留 English。

先读取这个新对话的实际工作路径（Mac 用 pwd -P；Windows 用
(Get-Location).Path），告诉我「我会在这个 folder 里工作：完整路径」，
等我确认后才下载或写入。把已确认的绝对路径称为 ROOT。
路径不对就停止，请我在 app 选对主要 LOCAL 项目 folder，再开新对话。

ROOT 本身就是项目。把 https://github.com/lavaxun/class-starter
安装到 ROOT，不建 class-starter 子 folder，不自动建立 AI Class
课程 folder，也不要求我在安装后再选另一个 folder。

先只读检查 ROOT，写入前若内容有变化，重新分类。
分类时只忽略 .DS_Store、Thumbs.db 和 desktop.ini：
- 空 folder：在 ROOT 按顺序运行：
  git init -q
  git remote add origin https://github.com/lavaxun/class-starter.git
  git fetch -q origin
  git checkout -q -b main --track origin/main
- 已有 starter：先用 git remote get-url origin 确认 origin 对应
  github.com/lavaxun/class-starter（HTTPS 或 SSH，有没有 .git 后缀都可以）。
  用 git rev-parse -q --verify HEAD 判断是否已有版本。
  没有 HEAD 就沿用已有 origin，只运行上面的 fetch 和 checkout。
  已有 HEAD 就只用 git pull --no-rebase --ff-only 更新。
  更新失败保留当前版本，不 stash、reset 或删除。
- 其他非空内容：不写入，不搬移、重命名、删除或覆盖。
  说明里面有什么，请我另建空 folder，选为主要 LOCAL 项目 folder，
  然后在那里开新对话。

所有 Git 命令都在已确认的 ROOT 里运行。任何命令失败就停下来，
说明错误，不继续下一条。

安装或更新 starter 后，按本 README「加入课堂 house rules」处理
AGENTS.md，保留 starter 原有规则。再在 ROOT 运行 npm install 和
npm run dev，告诉我浏览器要打开的网址。

跑起来后，先读 AGENTS.md，按它的问题逐个问我，确认我要做什么，
不要直接开始写项目代码。以后同一个项目继续用 ROOT；
不同项目才请我另建空 folder。
```

`AGENTS.md` 是给编程助手的项目说明，包含 **Next.js、TypeScript、Tailwind、shadcn/ui** 等 tech stack 和基本规则。助手会先问清楚项目给谁用、要解决什么、怎样算成功，以及主要用手机还是电脑。

---

## 加入课堂 house rules

**这一步交给编程助手做，两种设置路线都需要。** 把以下要求交给它；不要把下载内容直接盖过 `AGENTS.md`：

1. starter 安装或更新后，先读 ROOT 里的 `AGENTS.md`。从 https://preclass.aiclassmalaysia.com/house-rules.md **下载到另一个临时文件**，不是 `AGENTS.md`。下载失败就停下来说明错误，不凭空编写规则；重试时仍用临时文件。
2. 读取下载内容里从 `<!-- ai-class-house-rules:start -->` 到 `<!-- ai-class-house-rules:end -->` 的完整区块，包括两个标记。
3. 按以下情况处理：
   - **没有 `AGENTS.md`**：新建文件，放入下载的完整区块。
   - **文件里没有课堂规则区块**：在末尾加一个空行，再加完整区块，只加一次，保留原有所有文字。
   - **已有相同区块**：不改文件。
   - **已有不同区块**：先问「要保留现有课堂规则，还是只把课堂规则区块换成最新版？不确定的话建议保留。」默认保留；只有我明确同意，才替换两个标记之间的完整区块。**区块以外的文字一律保留**。
4. 用完删除临时下载文件，不删除项目文件。不覆盖整份 `AGENTS.md`，也不把特定 app 的操作方式或这台电脑的绝对路径写进可重复使用的项目规则。

课堂规则会让助手沿用同一个项目 folder，并按我选的中文（ZH）沟通和制作界面、报告及标签；技术用词可以保留 English，除非我另外要求。

---

## 自己动手（可选，大约 10 分钟）

**先手动建立空 folder，在编程助手 app 选它为主要 LOCAL 项目 folder，再开新对话。** 不要贴上面的完整设置要求；先只把以下要求交给助手：

```text
先只读检查，不下载、不写入，也不安装或启动。
读取这个新对话的实际工作路径（Mac 用 pwd -P；Windows 用
(Get-Location).Path），告诉我完整路径，等我确认后把它称为 ROOT。
路径不对就停止，请我重新选对主要 LOCAL 项目 folder，再开新对话。
确认后只读分类 ROOT，只忽略 .DS_Store、Thumbs.db 和 desktop.ini，
告诉我是空 folder、已有或安装到一半的 starter，还是其他非空内容。
```

以下安装命令只用于**已确认的空 ROOT**，把 starter 装进同一个 ROOT，不建立另一个项目 folder。如果已有或安装到一半的 starter，改走上面的「请编程助手帮你设置」路线，沿用已有 origin，**不要重复运行 `git remote add origin`**；如果有其他非空内容，停止，不写入，另建空 folder 后重新选择并开新对话。运行命令前若内容变了，也要先只读重新分类。

**第 1 步 · 打开 Terminal**

- **Mac**：按 `Cmd + Space`，输入 `Terminal`，按 Enter
- **Windows**：在 Start 菜单搜索 `PowerShell` 并打开（不是「Command Prompt / cmd」）

**第 2 步 · 进入已确认的项目 ROOT**

把下面的 `<ROOT>` 换成你刚确认的完整路径，保留引号。这里是进入已有的空 folder，**不是建立子 folder**。

Mac：

```bash
cd "<ROOT>"
```

```bash
pwd -P
```

Windows PowerShell（路径内若有 `'`，写成 `''`）：

```powershell
Set-Location -LiteralPath '<ROOT>'
```

```powershell
(Get-Location).Path
```

一条一条运行；进入 folder 失败就停下来。显示的完整路径必须与已确认的 ROOT 一致；不一致就停止，不运行 Git 命令。

**第 3 步 · 一条一条运行下面 4 条 Git 命令**

两个平台用相同命令。等上一条完成才贴下一条；**任何一条失败就停下来**，把错误信息交给助手，不继续，也不运行 stash、reset 或删除命令。

```bash
git init -q
```

```bash
git remote add origin https://github.com/lavaxun/class-starter.git
```

```bash
git fetch -q origin
```

```bash
git checkout -q -b main --track origin/main
```

这些命令把 starter 文件直接放进 ROOT。成功时可能没有显示文字，这是正常的。

**第 4 步 · 请助手按「加入课堂 house rules」处理 `AGENTS.md`**

还是用刚才那个项目和对话，不需要再选 folder。请它先完成安全合并，保留 starter 原有说明。

**第 5 步 · 在同一个 ROOT 安装并启动**

```bash
npm install
```
> 安装项目需要的零件，**需要等几分钟**，屏幕滚动很多字是正常的。出现错误就停下来，请助手帮你看。

```bash
npm run dev
```
> 启动！看到 `Local: http://localhost:3000` 就表示跑起来了

**第 6 步 · 打开浏览器**，进入 **http://localhost:3000**。如果 Terminal 的 `Local:` 显示另一个网址，就用它显示的网址。

看到大大的「Congrats! 🎉」页面 = 成功 ✅（页面是英文的，这是正常的）

![跑起来的样子](docs/success.png)

**第 7 步 · 回到同一个编程助手项目和对话**，告诉它：「我选择中文版（ZH）。请先读 `AGENTS.md`，逐个问我项目的问题，再开始写代码。」

---

## 常见问题

| 问题 | 解决方法 |
|---|---|
| `npx` 或 `npm` 显示「command not found」 | Node 还没装好。装好 Node 后，**关掉 Terminal 再重新打开**，然后再试一次 |
| `npm install` 卡很久或出现错误 | 换个网络（手机热点通常会快一些），再运行一次 `npm install` |
| 页面打不开 | 请确认 Terminal 还开着，`npm run dev` 还在运行（关掉它，网页就会停） |
| 想停下来 | 在 Terminal 按 `Ctrl + C`。想再开启时，进入你原来的项目 ROOT，运行 `npm run dev` |
| 卡住超过 10 分钟 | 请找帮你设置的人，把错误信息给对方看 |

---

## 同一个项目，继续用这个 folder

请保留这个 folder，在里面继续做同一个项目。下次在编程助手 app 打开**同一个项目 folder**；不是再安装一份 starter。

想做**不同的项目**，自己另建一个空 folder，选为新的主要 LOCAL 项目 folder，开新对话，再按上面设置。旧项目原样保留，不需要改名、删除或覆盖。
