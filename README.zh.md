# Awesome Harness

独立维护的开源 Agent Harness 源码教程合集。当前包含 26 个固定提交的项目，每个项目都从本地拉取的源码、测试与事件契约生成页面。

- 中文/English 单页技术分析
- 11 章独立源码阅读页面（含指令执行章）
- 架构图、时序图、能力图、主循环图、指令执行图（可点击节点）
- 每章源码地图：本地仓库命中的 6 个真实文件与固定提交短段
- 单页实现面清单：入口、manifest、插件/MCP、测试、命令线索
- 21 项概念审计：session log、approval、projection、jobs、transaction、queues、parallelism 等
- 固定 commit、源码行号和 GitHub 跳转
- 本仓库只发布图文教程、源码证据和交互图；视频单独维护在 video 仓库

站点入口：site/zh/index.html。版本账本：site/data/versions.json。

sources/ 是本地审计输入，不提交到仓库；需要复现源码摘录时先运行 node scripts/fetch-sources.mjs，它会按 data/projects.mjs 中的 commit checkout。然后运行 node scripts/generate-site.mjs，最后运行 node scripts/validate-site.mjs。

注意：Diagram Design 是一个图形生成 Skill/Harness，不是可执行 Agent runtime；报告会把它放在同一横向矩阵里，但不会把它冒充成沙箱执行器。

> 生成页面：node scripts/generate-site.mjs
