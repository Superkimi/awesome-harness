1. 研究要后台跑，结果还要可中止；我沿 AgentProtocol 和 local subagent 的并发约束看边界。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：packages/core/src/agent/agent-session.ts:14-69 · 子 Agent 统一为可订阅、可重放、可中止的 AgentProtocol；packages/core/src/agents/local-subagent-protocol.ts:69-95 · Local 子 Agent 支持后台执行和取消，但同一 protocol 实例不允许并发 stream。
4. 事实一：无论子 Agent 在本机还是远程，上层看到的都是一条带编号、能续看的事件流。
5. 源码含义：UI、SDK 与 A2A server 可共享协议，断线恢复不必理解每种 executor。
6. 事实二：一个子 Agent 会话一次只接一单；主线程能先拿到 streamId，不必等它做完，但不能同时塞第二单。
7. 数据流：用户消息 → sendMessageStream → Context/Policy → Scheduler/AgentProtocol → JSONL checkpoint。
8. 小白动作：先把长任务拆成循环、上下文、策略、工具和回放五格。
9. 第二个动作：为超限、取消、拒绝和重试分别写终态，不要只看“执行成功”。
10. 局限提醒：local/remote protocol、AgentSession event replay、子 Agent 独立 registry/scheduler。
11. 这一章的结论：UI、SDK 与 A2A server 可共享协议，断线恢复不必理解每种 executor。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 1ac3377395868295e128b96726d605a900b5946b
