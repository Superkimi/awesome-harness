1. 老板让我跑一条长任务，我先确认 Prime Agent 的三层分离各自守哪条边界。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/coding-agent/src/core/agent-session.ts:1-13 · 最值得借鉴的是“纯 loop + coding host + extension bus”三层分离；packages/agent/src/agent-loop.ts:178-205 · 低层 Agent Loop 是可复用的 provider-neutral 状态机。
4. 事实一：这套分层让我们既能复用基础 loop，又能按产品需要装配 TUI、RPC、daemon 或插件，而不是把所有能力塞进一个巨型 Agent 类。
5. 源码含义：自研架构建议沿此边界拆包：Core Loop、Harness Session、Policy/Extension Bus、Execution Adapters、Persistence/Control Plane。
6. 事实二：Prime Agent 把“模型怎么流式回答、什么时候执行工具、用户插话后是否继续”抽成一个不依赖 TUI 的小内核，上层入口只负责喂配置和消费事件。
7. 数据流：纯 loop → coding host → resources/extensions → RLM/daemon → JSONL events 和恢复。
8. 小白动作：先把任务拆成 loop、工具、上下文、协作和持久化五格。
9. 第二个动作：为每个后台任务记录 admission、heartbeat、lease 和完成释放，避免幽灵进程。
10. 局限提醒：纯 AgentMessage loop、AgentSession host、interactive/print/rpc/daemon 入口。
11. 这一章的结论：自研架构建议沿此边界拆包：Core Loop、Harness Session、Policy/Extension Bus、Execution Adapters、Persistence/Control Plane。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 7787f07415d843b9a800f6a4720e0c739bd608e5
