# class-starter · 起步项目（中文版）

[English → README.md](README.md)

这是一个起步项目，帮你确认开发工具已准备好，再开始做自己的项目。跑起来后，你会看到一个恭喜页面。

建议请编程助手设置；想自己运行命令，也可以走下面的可选路线。两种方法都把 starter 直接装进你选的 folder。

## 请编程助手帮你设置

1. 在自己的电脑上手动建一个**新的空 LOCAL folder**，建议放在 OneDrive、iCloud 等自动同步位置以外。
2. 在编程助手 app 把**这个 folder 本身**选为主要 **LOCAL 项目 folder**，不是它的上一级，然后开一个**新对话**。
3. 贴上下面这段话。助手说出完整路径后，确认是你刚建的 folder，才让它继续。

```text
我选择中文版（ZH）。除非我另有要求，请用中文沟通，并制作中文的界面、报告和标签。
先读取当前对话的实际工作路径，显示完整路径，等我确认后才下载或写入。
路径不对就停止，请我选对主要 LOCAL 项目 folder，再开新对话。
确认后只读检查：若 folder 非空就停止，不覆盖，请我另建空 folder。
把 https://github.com/lavaxun/class-starter 直接安装到已确认的 folder，不建立子项目 folder。
在这个 folder 按顺序运行下方「自己动手」的 4 条 Git 命令，任何命令失败就停止并说明错误。
保留 starter 的 AGENTS.md，按本 README「加入课堂 house rules」处理规则。
然后在同一个 folder 运行 npm install，再运行 npm run dev；失败就停止。
告诉我打开 localhost:3000 或 Terminal 显示的网址。
开始做项目之前，先读 AGENTS.md，逐个问我项目的问题，不要直接写代码。
```

## 加入课堂 house rules

**两种设置路线都需要这一步，请交给编程助手处理。**

- 先读 starter 的 `AGENTS.md`。从 https://preclass.aiclassmalaysia.com/house-rules.md 下载到**另一个临时文件**，绝不直接覆盖 `AGENTS.md`。下载失败就停止并说明错误。
- 取出下载内容中包含 `<!-- ai-class-house-rules:start -->` 和 `<!-- ai-class-house-rules:end -->` 两个标记的完整区块。
- `AGENTS.md` 没有这个区块时，在末尾加一个空行并追加区块，**只加一次**；已有相同区块就不改。已有不同区块时，先问要保留还是替换；**默认保留现有内容**，只有你明确同意才替换该区块。
- **区块外的原有文字一律保留**，包括 starter 的说明。完成后删除临时下载文件。

## 自己动手（可选）

先按上面的前两步建空 folder、选为主要 LOCAL 项目 folder，并开新对话。**不要贴完整设置提示词**：只请助手显示实际工作路径，等你确认后只读检查 folder 是否为空，不下载、不写入、不安装。路径不对就重新选择并开新对话；非空就停止，不覆盖，另建空 folder。

### 1. 打开 Terminal，进入已确认的 folder

Mac：按 `Cmd + Space`，搜索 `Terminal`。把 `<完整路径>` 换成刚确认的路径，保留引号：

```bash
cd "<完整路径>"
pwd -P
```

Windows：在 Start 搜索 `PowerShell`（不是 cmd）。路径内若有 `'`，写成 `''`：

```powershell
Set-Location -LiteralPath '<完整路径>'
(Get-Location).Path
```

一条一条运行。进入 folder 失败，或显示的路径与已确认的路径不同，就停止，不运行下面的命令。

### 2. 一条一条运行这 4 条 Git 命令

等上一条完成才运行下一条。**任何一条失败就停止，把错误交给助手。** 文件会直接装进当前 folder，不建立子项目 folder；成功时没有输出是正常的。

```bash
git init -q
git remote add origin https://github.com/lavaxun/class-starter.git
git fetch -q origin
git checkout -q -b main --track origin/main
```

### 3. 加入规则，再安装和启动

在同一个对话请助手按「加入课堂 house rules」处理 `AGENTS.md`，保留 starter 的原有说明。规则处理成功后，在同一个 folder 依次运行：

```bash
npm install
npm run dev
```

等安装完成才启动；任何命令失败就停止，请助手看错误。打开 **http://localhost:3000**；如果 Terminal 显示另一个网址，就用它。

## 跑起来后，开始你的项目

看到「Congrats!」页面就成功了（起步页面是英文的，这是正常的）。

![跑起来的样子](docs/success.png)

回到同一个项目和对话，告诉助手你选择**中文版（ZH）**：除非另有要求，用中文沟通，并制作中文的界面、报告和标签。

开始写代码前，请助手先读 `AGENTS.md`，**一次问一个问题**：项目给谁用、解决什么、怎样算成功、主要用手机还是电脑。沿用项目规则与技术栈：Next.js 16、TypeScript、Tailwind/shadcn、手机优先布局、recharts。

## 常见问题

| 问题 | 解决方法 |
|---|---|
| `npm` 显示「command not found」 | 装好 Node 后，关掉 Terminal 再重新打开 |
| 安装或设置命令失败 | 停下来，把错误信息交给助手；不要继续下一步 |
| 页面打不开 | 确认 `npm run dev` 仍在运行，并使用 Terminal 显示的网址 |
| 想停下来或重新开启 | 按 `Ctrl + C` 停止；以后进入同一个 folder，运行 `npm run dev` |
| 卡住超过 10 分钟 | 找帮你设置的人，把错误信息给对方看 |

## 同一个项目，继续用这个 folder

同一个项目继续用**同一个 folder 和对话**，不用重新安装 starter。不同项目才另建空 folder，选为新的主要 LOCAL 项目 folder，再开新对话；旧项目保持原样。
