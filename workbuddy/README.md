# WorkBuddy 发布源

本目录存放发布到 [WorkBuddy 开放平台](https://open.workbuddy.cn) 的源文件；技能本体仍以
`skills/` 为唯一来源，打包时由 `scripts/pack-workbuddy.py` 复制进各包。

## 结构

```
workbuddy/
├── avatar-src/avatars.html      # 头像源（Playwright 渲染 512×512）
└── experts/
    ├── design-suite/            # 单专家（expertType: agent），黛米 + 内嵌三技能
    │   ├── plugin.json          # → 打包时写入 .codebuddy-plugin/plugin.json
    │   ├── agents/design-lead.md
    │   └── avatars/expert.png
    └── design-team/             # 专家团（expertType: team），黛米+卡西+伊凡
        ├── plugin.json          # → .codebuddy-plugin/plugin.json；version 由脚本与套件对齐
        ├── setting.json         # 主理人指定
        ├── agents/              # design-team-lead / design-critic / design-implementer
        ├── rules/design-team_rules.md
        └── avatars/             # team.png + 三位成员头像
```

## 打包与上传

```bash
scripts/pack-workbuddy.py                # 生成 dist/workbuddy/*.zip（含校验）
scripts/pack-workbuddy.py --check        # 只校验，产物写到 dist/workbuddy-check/
```

脚本只校验头像（512×512、不超过 500 KB），不渲染。改了 `avatar-src/avatars.html` 之后逐个重拍，
`role` 取 `lead`（`design-team-lead.png` 与 `expert.png`）、`critic`、`implementer`、`team`：

```bash
npx playwright screenshot --viewport-size "512, 512" \
  "file://$PWD/workbuddy/avatar-src/avatars.html?role=critic" \
  workbuddy/experts/design-team/avatars/design-critic.png
```

产出五个 zip，各自上传到开放平台对应入口：

| zip | 入口 | 说明 |
| --- | --- | --- |
| `design-studio.zip` | 技能市场 → 添加技能 | 主技能：brief → handoff |
| `critique-design.zip` | 技能市场 → 添加技能 | 评审与验收 |
| `implement-design.zip` | 技能市场 → 添加技能 | 按稿实现 |
| `design-suite.zip` | 专家市场 → 创建专家 | 单专家，内嵌三技能 |
| `design-team.zip` | 专家团市场 → 创建专家团 | 三 agent 协作 |

注意：三个技能在 WorkBuddy 技能市场是独立包；`../critique-design/` 这类跨技能引用在
用户同时安装相邻技能时才解析。critique-design 与 implement-design 的 SKILL.md 写明了单独安装时
怎么做；design-studio 没写，单独安装时第 9 步的新鲜评审和 critique / implement 模式找不到相邻技能。专家包内
`skills/` 目录保持兄弟布局，跨技能引用始终成立。

## 版本

- 各 SKILL.md 的顶层 `version` 须等于 `metadata.version`（G4 强制）。
- 两个 plugin.json 的 `version` 由打包脚本与 design-studio 的 `metadata.version`（套件版本）对齐。
