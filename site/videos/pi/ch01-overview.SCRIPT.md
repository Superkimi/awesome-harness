1. 老板让我交付一条复杂任务，我先确认 Pi 的 Harness 内核和 Coding Agent 产品层分别负责什么。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/agent/src/harness/agent-harness.ts:171-223 · 仓库是“通用 Harness 内核 + 完整 Coding Agent 产品层”的双轨架构；packages/agent/src/harness/agent-harness.ts:354-497 · 新 AgentHarness 把请求 hooks、消息持久化和运行时变更统一到 turn boundary。
4. 事实一：一边是可嵌入任何产品的发动机，一边是已经带 CLI、会话、扩展和交互界面的整车；当前两套代码有重叠，不能把发动机的新接口直接当成整车每条路径都已采用。
5. 源码含义：架构抽象领先，但迁移期会产生两个 session/compaction/tool 生命周期，需要明确长期收敛边界。
6. 事实二：每轮开始先拍一张配置快照，模型请求前后都能挂钩；消息落盘和配置变化在明确边界完成，减少并发写乱序。
7. 数据流：用户消息 → turn/session → Provider 与工具 → compaction/权限 → JSONL 会话和交付。
8. 小白动作：先把长任务拆成主循环、上下文、工具、信任和观测五格。
9. 第二个动作：为并发、重试、编辑和回退各写一个明确终态，不要只看“运行中”。
10. 局限提醒：已审计低层 agent loop、通用 AgentHarness 和产品 AgentSession 的衔接与重叠。
11. 这一章的结论：架构抽象领先，但迁移期会产生两个 session/compaction/tool 生命周期，需要明确长期收敛边界。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 581d75a89cea21e50d6a26df840352f94427f633
