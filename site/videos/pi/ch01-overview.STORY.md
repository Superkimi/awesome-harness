# M01 · 总览：通用内核与产品层双轨

## Hook
老板让我交付一条复杂任务，我先确认 Pi 的 Harness 内核和 Coding Agent 产品层分别负责什么。

## Evidence anchors
- pi-architecture-001: packages/agent/src/harness/agent-harness.ts:171-223 · 仓库是“通用 Harness 内核 + 完整 Coding Agent 产品层”的双轨架构
  - 一边是可嵌入任何产品的发动机，一边是已经带 CLI、会话、扩展和交互界面的整车；当前两套代码有重叠，不能把发动机的新接口直接当成整车每条路径都已采用。
- pi-harness-001: packages/agent/src/harness/agent-harness.ts:354-497 · 新 AgentHarness 把请求 hooks、消息持久化和运行时变更统一到 turn boundary
  - 每轮开始先拍一张配置快照，模型请求前后都能挂钩；消息落盘和配置变化在明确边界完成，减少并发写乱序。

## Takeaway
架构抽象领先，但迁移期会产生两个 session/compaction/tool 生命周期，需要明确长期收敛边界。
