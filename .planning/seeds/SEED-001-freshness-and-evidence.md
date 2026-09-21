# SEED-001 新鲜度审查与证据补齐

状态：planted（2026-09-21）

## 触发条件（满足任一即执行）

- 距上次全量验链超过一个季度。
- 主流平台发布新的设计语言或大版本（iOS / Android / HarmonyOS / Windows）。
- 模型代际更新（"生成感"特征清单需要重看）。
- DTCG 或 DESIGN.md 发布新版本。
- 用户反馈某个目录条目失效或授权变化。

## 要做的事

1. `scripts/check-links.py --write` 全量验链，按 `skills/iterate-design-lab/SKILL.md` 的 `link-check` 流程处理 dead / redirected / unreachable。
2. 复核 Perishable Register 里的每个文件，更新其中的"Last reviewed"日期。
3. **补齐证据缺口**（见 `skills/design-studio/references/source-map.md` 的 Known Evidence Gaps）：用浏览器工具读取 Apple HIG、Material 3、HarmonyOS 设计指南的正文并写摘要，把 `platforms.md` 与 `app-icons-and-favicons.md` 的证据等级从 practice 提升到 digest。
4. **建立最小验证集**：3–5 个固定 brief（一个企业后台页面、一个 SaaS 落地页、一套图标、一个动效、一份评审），分别在"使用 / 不使用套件"下各跑一遍，由只看 brief 与截图的新上下文按 `quality-rubric.md` 打分，记录结果。这是 `analysis/11-distilled-skill-design.md` 第一条自我违反的修复路径。
5. 把审查结论写入 `analysis/SOURCE_INDEX.md` 的 `## 新鲜度审查`。
