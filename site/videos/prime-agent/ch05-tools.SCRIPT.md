1. 模型要并行读文件，我先看 before/after hook、预检和串并行两条执行路径。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/agent/src/agent-loop.ts:608-623 · 工具调用先预检再执行，支持串行和并行两条路径；packages/agent/src/agent-loop.ts:795-848 · before/after tool hook 是可编程的策略门。
4. 事实一：多个独立查询可以并发跑，但带副作用的工具能强制串行；模型给错参数时不会直接进 shell，而是先变成错误 tool result。
5. 源码含义：工具调度应把“可并行性”和“参数校验”写进 ToolDefinition，而不是让模型提示词决定。
6. 事实二：审批、审计、脱敏、工具白名单和“这个结果是否要终止 Agent”都可以在一个统一钩子里实现，而且 block 发生在真正执行前。
7. 数据流：纯 loop → coding host → resources/extensions → RLM/daemon → JSONL events 和恢复。
8. 小白动作：先把任务拆成 loop、工具、上下文、协作和持久化五格。
9. 第二个动作：为每个后台任务记录 admission、heartbeat、lease 和完成释放，避免幽灵进程。
10. 局限提醒：参数验证、before/after hook、串行/并行、流式结果和终止提示。
11. 这一章的结论：工具调度应把“可并行性”和“参数校验”写进 ToolDefinition，而不是让模型提示词决定。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 7787f07415d843b9a800f6a4720e0c739bd608e5
