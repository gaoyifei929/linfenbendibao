# Git 工作流与换行符规范

> 适用范围：本仓库（临汾本地宝）全部文件
> 创建背景：Windows 环境（`core.autocrlf=true`）下引入 `.gitattributes` 统一 LF 时踩到了坑，本文记录规范、排查与解法

## 一、换行符规范

仓库根目录的 [.gitattributes](../.gitattributes) 是唯一权威来源：

```gitattributes
* text=auto eol=lf
```

| 规则 | 含义 |
|---|---|
| `text=auto` | 由 git 自动判断文件是文本还是二进制；**二进制不做任何转换** |
| `eol=lf` | 判定为文本的文件，**仓库内存储 LF，检出到工作区也是 LF** |

配套的显式声明：

- `*.png` / `*.jpg` / `*.svg` 之外的图片、字体（`woff2`、`ttf` 等）标为 `binary`，双重保险
- `pnpm-lock.yaml -diff`：锁文件仍按文本归一化，但在 diff 中隐藏，避免噪音
- `dist/`、`node_modules/` 加 `export-ignore`，`git archive` 时排除

### 为什么统一 LF

- Windows / Linux / macOS 协作与 CI 环境不再出现「整文件 diff」的换行符噪音
- Vue / Vite / ESLint / Prettier 工具链对 LF 支持最稳定
- Windows 下的编辑器（VS Code 等）原生支持 LF，不影响开发体验

## 二、本机 Git 配置建议

`.gitattributes` 已经能保证仓库内统一 LF，但**本机 `core.autocrlf` 建议显式关闭**，否则工作区行为容易与预期不符：

```bash
git config --global core.autocrlf false
```

| 配置 | 值 | 原因 |
|---|---|---|
| `core.autocrlf` | `false` | 不再自动做 CRLF 转换，工作区直接体现 `.gitattributes` 的结果 |
| `core.quotepath` | `false` | 中文文件名在 `git status` / `git log` 中正常显示，不再输出 `\344\270\264...` 转义 |

`core.quotepath=false` 建议按仓库设置（`git config core.quotepath false`），避免影响其他项目。

### 查看配置来源

```bash
git config --global --get core.autocrlf
git config --local  --get core.autocrlf
git config --get core.autocrlf            # 最终生效值
git config --global --list --show-origin  # 带文件路径，便于定位
```

## 三、核心诊断命令：`git ls-files --eol`

这是排查换行符问题**最重要的一条命令**：

```bash
git ls-files --eol
```

输出格式（每行三部分）：

```
i/lf    w/lf    attr/text=auto eol=lf    AGENTS.md
i/lf    w/crlf  attr/text=auto eol=lf    AGENTS.md   ← 问题状态
i/-text w/-text attr/-text               hero.png    ← 二进制，正常
```

| 字段 | 含义 |
|---|---|
| `i/...` | **索引（index，即仓库内存储）** 的换行符 |
| `w/...` | **工作区（working tree）** 的换行符 |
| `attr/...` | 命中的属性规则 |

判读要点：

- **`i/lf` 是正确的**：说明仓库内存储干净
- **`w/crlf` 是问题**：说明工作区文件是 CRLF，需要重新检出
- 只筛问题文件：`git ls-files --eol | grep 'w/crlf'`
- `i/-text w/-text` 表示二进制，**不需要处理**

## 四、已踩的坑（重要）

### 坑 1：`git add --renormalize` 修不了工作区

`renormalize` 只重写**索引**，不会重写已存在的工作区文件。若索引本来就是 LF，这条命令输出为空，看似「无事发生」，但工作区可能仍是 CRLF。

### 坑 2：`git checkout-index -a -f` 也可能不生效

即使加了 `-f`，git 仍可能依据 **stat 缓存** 判定文件「已是最新」而跳过重写。

### 坑 3：`git status` 会说谎（最危险）

本次实际遇到的现象：

```bash
git ls-files --eol -- AGENTS.md
# i/lf  w/crlf  ← 工作区是 CRLF
git status
# 干净，无任何修改  ← 假象
```

原因是 `core.autocrlf=true` 的 **clean filter 在比较时会归一化 CRLF**，归一化后与索引一致，于是判定「未修改」。同时 stat 缓存（mtime/size）也认为文件没变。**两个机制叠加，把工作区的 CRLF 完全掩盖了。**

> 结论：**不要只用 `git status` 判断换行符问题，必须用 `git ls-files --eol`。**

### 坑 4：`.gitattributes` 不会追溯修改工作区

新增或修改 `.gitattributes` 后，**已存在的工作区文件不会被自动重写**。必须显式重新检出。

## 五、规范操作流程

### 场景 A：新增 `.gitattributes` 后规范化

```bash
# 1. 确认索引状态，找出问题文件
git ls-files --eol | grep 'w/crlf'

# 2. 重写索引（若索引本已 LF，此步无输出，属正常）
git add --renormalize .

# 3. 强制工作区按属性重新落盘
git update-index --refresh
git checkout-index -a -f

# 4. 仍残留的文件：删除后重新检出（最可靠）
git rm --cached --quiet -- <file>   # 或直接删文件
Remove-Item <file>                  # Windows PowerShell
git checkout -- <file>

# 5. 验证（必须做）
git ls-files --eol | grep 'w/crlf'  # 期望无输出
git status                          # 期望干净
```

### 场景 B：验证规范化是否真的生效（克隆往返测试）

**本机工作区会被 stat 缓存和 clean filter 干扰，最可信的验证是全新克隆：**

```bash
git clone --local --no-hardlinks . ../verify-clone
cd ../verify-clone
git ls-files --eol | grep 'w/crlf'   # 期望无输出
git status                           # 期望干净
```

> 注意：二进制文件（如 `hero.png`）内部可能天然含 `0D 0A` 字节，**这是原始数据，不是被转换的结果**，不要误判为 CRLF 文本。

### 场景 C：彻底清除 stat 缓存

```bash
git update-index --refresh
git update-index --really-refresh
```

## 六、提交规范

采用**约定式提交（Conventional Commits）+ 中文描述**，前缀用英文：

| 前缀 | 用途 | 本仓库示例 |
|---|---|---|
| `feat:` | 新功能 / 新模块 | `feat: 初始化临汾美食地图 Vue3 项目` |
| `fix:` | 修复缺陷 | `fix: 修复地图标记偏移问题` |
| `docs:` | 文档变更 | `docs: 添加项目文档与协作规范` |
| `chore:` | 构建 / 配置 / 杂项 | `chore: 新增 .gitattributes 统一换行符为 LF` |
| `refactor:` | 重构（不改行为） | `refactor: 抽取坐标转换工具` |
| `style:` | 格式调整（不改逻辑） | `style: 统一缩进` |

写法建议：

```bash
git commit -m "chore: 新增 .gitattributes 统一换行符为 LF" \
           -m "设置 * text=auto eol=lf，并显式声明图片/字体为二进制；索引经 renormalize 校验已全为 LF。"
```

- 标题一行说清「做了什么」，控制在 50 字内
- 正文用 `-m` 追加，说明「为什么」和验证方式
- 一个提交只做一件事，便于回溯与回滚

## 七、命令速查

```bash
# —— 诊断 ——
git ls-files --eol                          # 索引/工作区换行符全量对照
git ls-files --eol | grep 'w/crlf'          # 只列问题文件
git check-attr -a -- <file>                 # 查看某文件命中的属性
git check-ignore -v <path>                  # 查看是否被忽略及命中哪条规则

# —— 规范化 ——
git add --renormalize .                     # 重写索引为归一化内容
git checkout-index -a -f                    # 强制按属性重写工作区
git update-index --refresh                  # 刷新 stat 缓存

# —— 验证 ——
git clone --local --no-hardlinks . ../verify-clone
git status -sb                              # 分支与远程同步状态

# —— 配置 ——
git config --global core.autocrlf false
git config core.quotepath false
```

## 八、相关文件

- [.gitattributes](../.gitattributes) —— 换行符与属性规则的唯一权威来源
- [AGENTS.md](../AGENTS.md) —— 协作规范入口
