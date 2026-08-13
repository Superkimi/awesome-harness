1. 同事说 follow-up、steer、continuation 都一样，我沿 agent loop 拆三种改道方式。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/agent/src/agent-loop.ts:317-345 · Steering、follow-up、continuation 是三个不同的队列语义；packages/agent/src/agent-loop.ts:608-623 · 工具调用先预检再执行，支持串行和并行两条路径。
4. 事实一：用户正在打断时是一种消息，用户等 Agent 停下来再追加是另一种消息，系统为了长目标自动继续又是第三种消息，三者不会混成一个 pending 数组。
5. 源码含义：长任务产品应给消息定义明确的 admission boundary，才能保证“插话”不会跳过当前工具调用或错误地重放。
6. 事实二：多个独立查询可以并发跑，但带副作用的工具能强制串行；模型给错参数时不会直接进 shell，而是先变成错误 tool result。
7. 数据流：纯 loop → coding host → resources/extensions → RLM/daemon → JSONL events 和恢复。
8. 小白动作：先把任务拆成 loop、工具、上下文、协作和持久化五格。
9. 第二个动作：为每个后台任务记录 admission、heartbeat、lease 和完成释放，避免幽灵进程。
10. 局限提醒：纯 AgentMessage loop、AgentSession host、interactive/print/rpc/daemon 入口。
11. 这一章的结论：长任务产品应给消息定义明确的 admission boundary，才能保证“插话”不会跳过当前工具调用或错误地重放。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 7787f07415d843b9a800f6a4720e0c739bd608e5
