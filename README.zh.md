# Awesome Harness

独立维护的开源 Agent Harness 教程合集。当前包含 8 个本轮源码快照，以及 18 个已刷新到当前远端分支 HEAD 的项目。legacy 项目沿用了上一轮 finding 账本的审计结构，但源码摘录、commit、行号和链接已重新生成；页面明确区分“重新拉取源码”和“历史 finding 仍需语义复核”。

- 中文/English 单页技术分析
- 10 章独立小白教程页面
- 架构图、时序图、能力图（可点击节点）
- 每章源码地图：本地仓库命中的 6 个真实文件与固定提交短段
- 单页实现面清单：入口、manifest、插件/MCP、测试、命令线索
- 21 项概念审计：session log、approval、projection、jobs、transaction、queues、parallelism 等
- 固定 commit、源码行号和 GitHub 跳转
- 技术分析视频与章节视频的发布位
- 旧 finding 的完整长报告保留在 site/legacy/reports/，新入口统一拆成十章教程

站点入口：site/zh/index.html。版本账本：site/data/versions.json。

sources/ 是本地审计输入，不提交到仓库；需要复现源码摘录时先运行 node scripts/fetch-sources.mjs，它会按 data/projects.mjs 中的 commit checkout。然后运行 node scripts/generate-site.mjs，最后运行 node scripts/validate-site.mjs。

注意：Diagram Design 是一个图形生成 Skill/Harness，不是可执行 Agent runtime；报告会把它放在同一横向矩阵里，但不会把它冒充成沙箱执行器。data/legacy/ 是历史 finding 与当前源码版本账本；运行 npm run refresh-legacy 可重新拉取/刷新 legacy 项目的版本和代码摘录。

> 生成页面：node scripts/generate-site.mjs
