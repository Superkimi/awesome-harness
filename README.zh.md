# Awesome Harness

独立维护的开源 Agent Harness 教程合集。当前锁定 7 个最新源码提交，每个项目提供：

- 中文/English 单页技术分析
- 10 章独立小白教程页面
- 架构图、时序图、能力图（可点击节点）
- 固定 commit、源码行号和 GitHub 跳转
- 技术分析视频与章节视频的发布位

站点入口：site/zh/index.html。版本账本：site/data/versions.json。

sources/ 是本地审计输入，不提交到仓库；需要复现源码摘录时先运行 node scripts/fetch-sources.mjs，它会按 data/projects.mjs 中的 commit checkout。然后运行 node scripts/generate-site.mjs，最后运行 node scripts/validate-site.mjs。

注意：Diagram Design 是一个图形生成 Skill/Harness，不是可执行 Agent runtime；报告会把它放在同一横向矩阵里，但不会把它冒充成沙箱执行器。

> 生成页面：node scripts/generate-site.mjs
