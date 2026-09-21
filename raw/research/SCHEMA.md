# Research Candidate Schema

`raw/research/` 保存每一轮资源调研的**原始候选**（未经最终筛选）。它是证据与采集历史，不是 skill 运行时读取的内容；筛选后的结论进入 `skills/design-studio/references/resources/`。

每轮调研一个文件：`raw/research/YYYY-MM-DD-<cluster>.jsonl`，每行一个 JSON 对象。

## Fields

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `name` | ✓ | 资源名 |
| `url` | ✓ | 规范化首页 URL（https，无追踪参数） |
| `kind` | ✓ | 见下方 Kind 枚举 |
| `domain` | ✓ | 主归属域（单值），见下方 Domain 枚举。一个资源只有一个"家" |
| `tags` | ✓ | 自由标签数组（小写 kebab-case），如 `landing` `hero` `pricing` `ios` `dashboard` `cjk` `lottie` `app-icon` |
| `best_for` | ✓ | 一句话：设计师会为了什么来这里（具体，不写空话） |
| `how_to_use` |  | 给运行时 agent 的直达方式：筛选维度、可深链的 URL 模式（如 `/category/pricing`）、搜索参数 |
| `access` | ✓ | `free` / `freemium` / `paid` |
| `login` | ✓ | 主要内容是否需要登录才能看：`true` / `false` |
| `agent_access` | ✓ | `static`（内容在 HTML 里，WebFetch 可读）/ `js`（SPA 空壳，需浏览器）/ `blocked`（反爬/人机验证）/ `unknown`，以实际尝试为准 |
| `license_note` |  | 素材/字体/图标/代码的授权要点（MIT、OFL、CC0、仅个人免费、商用需购买…） |
| `tier` | ✓ | `S` 同类首选 / `A` 可靠值得看 / `B` 小众、备选或有明显短板 |
| `tier_reason` | ✓ | 为什么是这个档 |
| `updated` | ✓ | `active` / `slow` / `archived`（不再更新但仍有价值）/ `unknown` |
| `lang` | ✓ | 主要语言：`en` / `zh` / `ja` / … |
| `verified` | ✓ | `true` / `false`；`false` 时在 `notes` 说明原因 |
| `origin` | ✓ | `user-2026-09-20`（用户提供）/ `research-2026-09-20`（本轮调研发现） |
| `notes` |  | 其他提醒：付费墙比例、内容同质化、被收购、域名变更、替代品等 |

## Kind

`gallery` 人工精选的灵感画廊 ｜ `pattern-library` 系统化的 UI 模式/流程库 ｜ `archive` 历史/典藏型档案 ｜ `feed` 每日聚合/newsletter ｜ `community` 社区（Dribbble/Behance 类）｜ `tool` 生成器/检查器/编辑器 ｜ `assets` 可下载素材（字体/图标/插画/样机…）｜ `library` 代码库/开源仓库 ｜ `design-system` 已发布的设计系统文档 ｜ `guideline` 官方平台规范/标准 ｜ `article` ｜ `book` ｜ `course` ｜ `blog` 作者/工作室博客 ｜ `skill` 面向 AI agent 的设计 skill / prompt / MCP

## Domain

`web` 网站（落地页、营销站、作品集、电商、区块级：hero/nav/footer/pricing）｜ `app-ui` 产品界面（移动/桌面/Web App 的流程、屏幕、组件、平台规范、仪表盘/大屏、AI 产品界面）｜ `motion` 动效 ｜ `icons` 图标 ｜ `brand` 品牌/Logo/规范/重塑 ｜ `graphic` 平面（海报、版式、包装、演示文稿、社媒图）｜ `type` 字体与排版 ｜ `color` 色彩 ｜ `assets` 插画/照片/3D/样机/纹理/渐变/Shader ｜ `code` 设计系统与组件库、动效/图形库、token 工具、以代码为媒介的设计工具 ｜ `reading` 文章/书/课程/规范解读 ｜ `general` 跨学科社区与聚合

## Rules

- 只收**真实且已核验**的资源，禁止凭印象编造 URL。
- 质量优先于数量：剔除死站、垃圾站、SEO 农场、AI 内容农场、纯导购站。
- 过时但仍有价值的典藏标 `updated: "archived"`，不要因为旧就删。
- `best_for` / `how_to_use` 要写到"agent 拿到就能直达正确页面"的程度。
