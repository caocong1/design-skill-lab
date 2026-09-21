# raw/repos

上游仓库的 shallow clone 放在这里，作为学习资料与证据来源。目录内容被 git 忽略：仓库只保存**固定的 commit**（记录在 `analysis/SOURCE_INDEX.md` 的 `## Repositories`），不保存代码副本，需要时重新克隆：

```bash
git clone --depth 1 <upstream-url> raw/repos/<slug>
git -C raw/repos/<slug> rev-parse HEAD   # 记入 SOURCE_INDEX.md
```

首版没有做本地检出：同类 skill 项目的结论来自 README 级材料与维护者本机已安装的副本。
