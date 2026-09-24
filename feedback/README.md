# 使用反馈与自我迭代闭环

套件在本地各个项目里被使用时，遇到的问题和可优化点按固定格式落进
`feedback/inbox/`，由脚本聚合、由 `iterate-design-lab` 的 `evolve` 模式消化，
小的修复自动应用，结构性改动进入提案队列。整个闭环：

```
各项目使用 skill → 记录条目（feedback/inbox/）
        ↓  scripts/collect-feedback.py
聚合排序（feedback/report.md）
        ↓  iterate-design-lab 的 evolve 模式（手动或定时自动）
分流：立即修（Tier A/B）→ 改 skill、升版本、写 CHANGELOG、跑机械校验
      仅提案（Tier C）→ feedback/proposals.md 等主人拍板
        ↓
条目归档到 feedback/archive/，处置记录写进 feedback/log.md
```

## 各部分的约定

- **捕获**：agent 在使用任何套件 skill 时遵循
  `skills/design-studio/references/feedback.md`——遇到问题就地写一条
  条目进 `feedback/inbox/`（按本地路径或符号链接解析回本仓库）；每轮收尾
  **必须**跑一次三问复盘（被纠正 / 偏离了指引 / skill 缺失或出错），最后一句
  写 `Skill feedback: N entries` 或 `none`。拷贝安装、解析
  不到本仓库时写到宿主项目的 `.design/skill-feedback/`，之后用
  `scripts/collect-feedback.py --import <路径>` 收进来。
- **条目格式**：一个事件一个文件，`YYYY-MM-DD-<slug>.md`，头部字段
  （date / skill / project / type / severity）+ 两段自由文本。模板见
  `feedback/TEMPLATE.md`。
- **聚合**：`scripts/collect-feedback.py` 校验字段、按 skill × 类型分组、
  按严重度加权排序，生成 `feedback/report.md`（生成物，不要手改）。
  `--check` 只校验不写文件（机械校验脚本会调它）；`--archive` 把 inbox
  里全部条目移进 `feedback/archive/YYYY-MM/`。
- **消化**：`evolve` 模式的分级策略写在
  `skills/iterate-design-lab/SKILL.md`。处置历史追加到 `feedback/log.md`；
  被否决的条目也记录原因，避免重复提出。
- **自动化**：`scripts/evolve.sh` 是无头执行入口，可挂 launchd（示例
  `scripts/com.design-skill-lab.evolve.plist`）或 cron，定期聚合并让 agent
  自动消化 Tier A/B 条目。

## 补录：会话里没记下来时

在本仓库对 agent 说"用 iterate-design-lab 的 evolve 模式，从 <宿主项目> 补录
反馈"。它会读宿主的 `.design/decisions.md`、评审报告、这一轮的提交和会话记录，
提炼条目写进 inbox，先给你过目再分流。

## 手动跑一轮

```bash
scripts/collect-feedback.py            # 刷新 feedback/report.md
# 然后在本仓库里对 agent 说一句：
#   用 iterate-design-lab 的 evolve 模式处理反馈
```

## 定时自动跑（macOS launchd）

```bash
cp scripts/com.design-skill-lab.evolve.plist ~/Library/LaunchAgents/
launchctl bootstrap gui/$UID ~/Library/LaunchAgents/com.design-skill-lab.evolve.plist
# 立即手动触发一次：launchctl kickstart gui/$UID/com.design-skill-lab.evolve
# 卸载：launchctl bootout gui/$UID/com.design-skill-lab.evolve
```

默认每周一 09:00 跑；日志在 `feedback/evolve.log`。自动模式只应用 Tier A
（措辞、事实性错误、失效路径）和 Tier B（现有章节内的补充指导）改动，
结构性的 Tier C 一律写进 `feedback/proposals.md` 等人工确认。不想让
agent 直接改 skill 时，把 `scripts/evolve.sh` 里的 `PROPOSE_ONLY=1`
取消注释即可——全自动聚合，全部改动都走提案。

## 边界

- inbox 会进 git 历史：条目里不写秘密、不写绝对路径、不写客户数据。
- `feedback/report.md` 是生成物；`feedback/log.md` 只追加不改写。
- evolve 一轮只做有反馈证据的事，不替 skill 发明问题。
