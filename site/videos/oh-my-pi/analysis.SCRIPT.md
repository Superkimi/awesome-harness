1. 评审问我：这个 Agent 为什么能同时做 steering、压缩、MCP、子任务和观测？我不念宣传页，直接沿源码证据拆。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/agent/src/agent-loop.ts:879-918 · 核心是强化 Agent loop，产品层再叠加大型 Session maintenance 状态机；packages/agent/src/agent-loop.ts:999-1048 · steering 不只在轮间排队，还能在工具执行中协作中断；packages/agent/src/compaction/compaction.ts:148-189 · 压缩不是单一摘要，而是 context-full/handoff/shake/snapcompact 多策略。
4. 事实一：内层发动机负责每一步，外层管家负责一步结束后判断要不要重试、压缩、换模型、继续目标或等待后台工作。
5. 源码含义：自治恢复能力强，但 session maintenance 已成为复杂调度器，修改顺序容易产生竞态。
6. 事实二：用户插话时，纯等待可以立刻停；正在改文件的工具不会粗暴半路杀死，而是完成到安全边界再让模型听新指令。
7. 数据流：用户消息 → Agent loop/Session → Provider/工具 → compaction/Task → 账本与观测。
8. 小白动作：先把长任务拆成主循环、上下文、工具、协作和观测五格。
9. 第二个动作：为并发、预算、审批和恢复都写一个可见的终态，不要只看“运行中”。
10. 局限提醒：已审计 loop、session maintenance、steering/asides、yield、错误恢复和 goal continuation。
11. 这一章的结论：自治恢复能力强，但 session maintenance 已成为复杂调度器，修改顺序容易产生竞态。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: a53e4e790d3939a08708bf0d3c912d0763237a2d
