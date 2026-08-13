# Pi · 技术分析总览

## Hook
评审问我：这个 Pi 为什么既像通用 Harness，又像完整 Coding Agent？我沿固定证据看循环、会话和扩展边界。

## Evidence anchors
- pi-architecture-001: packages/agent/src/harness/agent-harness.ts:171-223 · 仓库是“通用 Harness 内核 + 完整 Coding Agent 产品层”的双轨架构
  - 一边是可嵌入任何产品的发动机，一边是已经带 CLI、会话、扩展和交互界面的整车；当前两套代码有重叠，不能把发动机的新接口直接当成整车每条路径都已采用。
- pi-loop-001: packages/agent/src/agent-loop.ts:155-275 · 低层循环把 steering、工具执行和 follow-up 分成内外两层
  - 用户中途插话会先纠偏当前工作，排队的新任务则等当前回合稳定后再接着做。
- pi-harness-001: packages/agent/src/harness/agent-harness.ts:354-497 · 新 AgentHarness 把请求 hooks、消息持久化和运行时变更统一到 turn boundary
  - 每轮开始先拍一张配置快照，模型请求前后都能挂钩；消息落盘和配置变化在明确边界完成，减少并发写乱序。
- pi-session-001: packages/coding-agent/src/core/session-manager.ts:30-153 · 会话是 append-only JSONL 树，可移动叶子、fork 和保存扩展状态
  - 聊天不是一条会被覆盖的直线，而是一棵只追加的版本树；回到旧节点不会删除未来分支。
- pi-extension-001: packages/coding-agent/src/core/extensions/loader.ts:66-124 · 扩展在同一进程执行，覆盖面接近完整产品内核
  - 插件不是只能加一个小工具，它几乎能摸到 Agent 每个关节；代价是插件代码和主进程同等权限。

## Takeaway
架构抽象领先，但迁移期会产生两个 session/compaction/tool 生命周期，需要明确长期收敛边界。
