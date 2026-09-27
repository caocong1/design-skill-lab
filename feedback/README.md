# 使用反馈与自我迭代闭环

套件在本地各个项目里被使用时，遇到的问题和可优化点按固定格式落进
`feedback/inbox/`，由脚本聚合、由仓库内维护 skill `iterate-design-lab`
（`.claude/skills/iterate-design-lab/`，只在本仓库里可用，不随插件安装）的
`evolve` 模式消化。整个闭环：

```
各项目使用 skill → 记录条目（feedback/inbox/）
        ↓  scripts/collect-feedback.py
聚合排序（feedback/report.md）
        ↓  iterate-design-lab 的 evolve 模式（交互式，或定时无人值守）
分流：交互式 → Tier A/B 直接改 skill、升版本、写 CHANGELOG、跑 gates；Tier C 进提案
      无人值守 → 只写提案和 Tier A 措辞修正，在 evolve/<日期> 分支上，等主人合并
        ↓
条目归档到 feedback/archive/，处置记录写进 feedback/log.md
```

## 各部分的约定

- **捕获**：agent 使用套件时遵循
  `skills/design-studio/references/feedback.md`：静默、不打断任务，只有能解析到
  本仓库的 `feedback/inbox/`（本地路径或符号链接安装）时才写；解析不到（拷贝安装、
  插件安装）就不记。每轮收尾跑一次三问复盘（被纠正 / 偏离了指引 / skill 缺失或出错），
  最后一句写 `Skill feedback: N entries` 或 `none`。宿主项目里另存的条目可以用
  `scripts/collect-feedback.py --import <路径>` 收进来。
- **条目格式**：一个事件一个文件，`YYYY-MM-DD-<slug>.md`，头部字段
  date / skill / project / type / severity + 两段自由文本，模板见
  `feedback/TEMPLATE.md`。`skill` 只能是三个随套件发布的 skill 之一；`project`
  写宿主**形态**的通用标签（如 `zh-admin-web`、`office-addin-web`），不写产品名、
  客户名或目录名。
- **聚合**：`scripts/collect-feedback.py` 校验字段、按 skill × 类型分组、按严重度
  加权排序，生成 `feedback/report.md`（生成物，不要手改；内容没变时不重写）。
  `--check` 只校验不写文件（gates 的 G5 调它）；`--archive` 把 inbox 里全部条目移进
  `feedback/archive/YYYY-MM/`。
- **消化**：分级策略写在 `.claude/skills/iterate-design-lab/SKILL.md` 的 evolve 模式。
  处置历史追加到 `feedback/log.md`；被否决的条目也记录原因，避免重复提出。
- **自动化**：`scripts/evolve.sh` 是无头入口，可挂 launchd（示例
  `scripts/com.design-skill-lab.evolve.plist`）。

## 补录：会话里没记下来时

在本仓库对 agent 说"用 iterate-design-lab 的 evolve 模式，从 <宿主项目> 补录反馈"。
它会读宿主的 `.design/decisions.md`、评审报告、这一轮的提交和会话记录，提炼条目写进
inbox（宿主只按形态描述），先给你过目再分流。

## 手动跑一轮

```bash
scripts/collect-feedback.py            # 刷新 feedback/report.md
# 然后在本仓库里对 agent 说：用 iterate-design-lab 的 evolve 模式处理反馈
```

## 定时无人值守（macOS launchd）

```bash
scripts/evolve.sh --dry-run            # 先看它会做什么：找到哪个 agent、会不会跑、提示词
cp scripts/com.design-skill-lab.evolve.plist ~/Library/LaunchAgents/
launchctl bootstrap gui/$UID ~/Library/LaunchAgents/com.design-skill-lab.evolve.plist
# 立即触发一次：launchctl kickstart gui/$UID/com.design-skill-lab.evolve
# 卸载：launchctl bootout gui/$UID/com.design-skill-lab.evolve
```

默认每周一 09:00 跑。`evolve.sh` 的规矩：

- 工作区不干净就拒绝运行（不会把主人进行中的改动卷进去）；inbox 为空就直接退出。
- 在新分支 `evolve/<日期>` 上工作，只 commit，不 push、不合并；跑完切回原分支。
- **只出提案**：写 `feedback/proposals.md`，外加 Tier A 措辞/失效路径修正；
  Tier B/C 一律不在无人值守时动手。
- agent 用绝对路径定位（`AGENT_BIN` > `command -v claude` > 已知安装位置），
  工具白名单（`--allowedTools`），有超时（`EVOLVE_TIMEOUT`，默认 1800 秒）。
- 日志只写一处：`feedback/evolve.log`；最近一次结果写在 `feedback/evolve.status`，
  下次交互会话可以先看它。

## 边界

- inbox 会进 git 历史：条目里不写秘密、不写绝对路径、不写客户数据和产品名。
- `feedback/report.md` 是生成物；`feedback/log.md` 只追加不改写。
- evolve 一轮只做有反馈证据的事，不替 skill 发明问题。
