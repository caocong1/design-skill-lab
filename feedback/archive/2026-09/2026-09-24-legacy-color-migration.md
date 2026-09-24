---
date: 2026-09-24
skill: build-design-system
project: bidops-app
type: missing
severity: minor
---

## What happened

规则是"组件不直接引用原始色阶，模式通过语义层重映射"。宿主代码有约 4000 处写死的颜色（132 个文件里的 Tailwind 类），agent 有意偏离：先机械迁移到色阶类（如 `text-neutral-500`），主题靠整条色阶重映射实现，并在 decisions 里说明。还得自己发明"颜色归入哪个色系"的规则，并在很浅的带色背景被误归为中性灰后返工。

## Expected / suggestion

认可两阶段迁移：先机械迁到色阶类，再按区域逐步换成语义名；写明色阶重映射主题的局限（状态色、分类色不会随主题变）；提供一个把颜色归入色系的辅助脚本。
