1. 评审问我：这个 Agent 怎么把纯 loop、coding host、扩展总线、daemon 和 RLM 组织起来？我沿固定证据拆。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/agent/src/agent-loop.ts:178-205 · 低层 Agent Loop 是可复用的 provider-neutral 状态机；packages/agent/src/agent-loop.ts:608-623 · 工具调用先预检再执行，支持串行和并行两条路径；packages/coding-agent/src/core/compaction/compaction.ts:122-132 · 默认压缩预留 16384 token，尾部保留 20000 token。
4. 事实一：Prime Agent 把“模型怎么流式回答、什么时候执行工具、用户插话后是否继续”抽成一个不依赖 TUI 的小内核，上层入口只负责喂配置和消费事件。
5. 源码含义：自研时可把 loop 做成纯运行时，再让 CLI、RPC、桌面 UI 共用；不要让界面组件自己复制一套 tool loop。
6. 事实二：多个独立查询可以并发跑，但带副作用的工具能强制串行；模型给错参数时不会直接进 shell，而是先变成错误 tool result。
7. 数据流：纯 loop → coding host → resources/extensions → RLM/daemon → JSONL events 和恢复。
8. 小白动作：先把任务拆成 loop、工具、上下文、协作和持久化五格。
9. 第二个动作：为每个后台任务记录 admission、heartbeat、lease 和完成释放，避免幽灵进程。
10. 局限提醒：纯 AgentMessage loop、AgentSession host、interactive/print/rpc/daemon 入口。
11. 这一章的结论：自研时可把 loop 做成纯运行时，再让 CLI、RPC、桌面 UI 共用；不要让界面组件自己复制一套 tool loop。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 7787f07415d843b9a800f6a4720e0c739bd608e5
