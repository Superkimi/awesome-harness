1. 架构评审只剩十分钟，我得讲清 request hooks、消息持久化和 runtime 变更在哪个边界汇合。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/agent/src/harness/agent-harness.ts:354-497 · 新 AgentHarness 把请求 hooks、消息持久化和运行时变更统一到 turn boundary；packages/coding-agent/src/core/session-manager.ts:30-153 · 会话是 append-only JSONL 树，可移动叶子、fork 和保存扩展状态。
4. 事实一：每轮开始先拍一张配置快照，模型请求前后都能挂钩；消息落盘和配置变化在明确边界完成，减少并发写乱序。
5. 源码含义：适合作为自研 Harness 的可复用内核参考，尤其是 transport、storage 和 execution capability 的解耦。
6. 事实二：聊天不是一条会被覆盖的直线，而是一棵只追加的版本树；回到旧节点不会删除未来分支。
7. 数据流：用户消息 → turn/session → Provider 与工具 → compaction/权限 → JSONL 会话和交付。
8. 小白动作：先把长任务拆成主循环、上下文、工具、信任和观测五格。
9. 第二个动作：为并发、重试、编辑和回退各写一个明确终态，不要只看“运行中”。
10. 局限提醒：已审计低层 agent loop、通用 AgentHarness 和产品 AgentSession 的衔接与重叠。
11. 这一章的结论：适合作为自研 Harness 的可复用内核参考，尤其是 transport、storage 和 execution capability 的解耦。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 581d75a89cea21e50d6a26df840352f94427f633
