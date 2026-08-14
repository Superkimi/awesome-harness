# M02 · 架构：turn boundary 怎么把系统接起来

## Hook
架构评审只剩十分钟，我得讲清 request hooks、消息持久化和 runtime 变更在哪个边界汇合。

## Evidence anchors
- pi-harness-001: packages/agent/src/harness/agent-harness.ts:354-497 · 新 AgentHarness 把请求 hooks、消息持久化和运行时变更统一到 turn boundary
  - 每轮开始先拍一张配置快照，模型请求前后都能挂钩；消息落盘和配置变化在明确边界完成，减少并发写乱序。
- pi-session-001: packages/coding-agent/src/core/session-manager.ts:30-153 · 会话是 append-only JSONL 树，可移动叶子、fork 和保存扩展状态
  - 聊天不是一条会被覆盖的直线，而是一棵只追加的版本树；回到旧节点不会删除未来分支。

## Takeaway
适合作为自研 Harness 的可复用内核参考，尤其是 transport、storage 和 execution capability 的解耦。
