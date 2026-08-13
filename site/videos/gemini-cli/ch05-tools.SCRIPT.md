1. 工具结果很大又可能被取消，我先看 event-driven Scheduler 如何落盘并返回合法响应。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：packages/core/src/core/turn.ts:236-320 · Turn 只解析模型流，工具执行交给独立 event-driven Scheduler；packages/core/src/scheduler/tool-executor.ts:250-297 · 超大工具结果在调度阶段落盘，取消也返回合法 functionResponse。
4. 事实一：模型流负责开任务单，调度器负责审批、排队、执行和回执；两者不是揉在一个 switch 里。
5. 源码含义：主 Agent 和子 Agent 能复用同一工具治理链，同时各自限定工具集。
6. 事实二：工具被叫停也必须交一张正式回执；已经产生的大输出不会硬塞回上下文。
7. 数据流：用户消息 → sendMessageStream → Context/Policy → Scheduler/AgentProtocol → JSONL checkpoint。
8. 小白动作：先把长任务拆成循环、上下文、策略、工具和回放五格。
9. 第二个动作：为超限、取消、拒绝和重试分别写终态，不要只看“执行成功”。
10. 局限提醒：Turn 工具提取、event-driven Scheduler、输出落盘/截断和取消。
11. 这一章的结论：主 Agent 和子 Agent 能复用同一工具治理链，同时各自限定工具集。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 1ac3377395868295e128b96726d605a900b5946b
