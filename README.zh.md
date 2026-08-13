# Awesome Harness

独立维护的开源 Agent Harness 教程合集。当前包含 7 个本轮最新拉取的源码快照，以及 18 个从上一轮源码账本迁移的 legacy 项目。两类项目都明确记录 branch、commit 和源码行号；legacy 页面不会伪装成 2026-08 的最新 HEAD。

- 中文/English 单页技术分析
- 10 章独立小白教程页面
- 架构图、时序图、能力图（可点击节点）
- 固定 commit、源码行号和 GitHub 跳转
- 技术分析视频与章节视频的发布位
- legacy 项目的完整长报告保留在 site/legacy/reports/，新入口统一拆成十章教程

站点入口：site/zh/index.html。版本账本：site/data/versions.json。

sources/ 是本地审计输入，不提交到仓库；需要复现源码摘录时先运行 node scripts/fetch-sources.mjs，它会按 data/projects.mjs 中的 commit checkout。然后运行 node scripts/generate-site.mjs，最后运行 node scripts/validate-site.mjs。

注意：Diagram Design 是一个图形生成 Skill/Harness，不是可执行 Agent runtime；报告会把它放在同一横向矩阵里，但不会把它冒充成沙箱执行器。data/legacy/ 是上一轮审计的证据与版本账本；要把这 18 个项目升级到同一日期，运行新的抓取与审计流程后再替换该目录。

> 生成页面：node scripts/generate-site.mjs
