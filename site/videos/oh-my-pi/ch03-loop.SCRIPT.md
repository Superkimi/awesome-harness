1. 同事说只能等工具完成再改方向，我沿 steering 和 shared/exclusive 调度看协作中断。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/agent/src/agent-loop.ts:999-1048 · steering 不只在轮间排队，还能在工具执行中协作中断；packages/agent/src/agent-loop.ts:2067-2200 · 工具调度支持 shared/exclusive 并发和完整 pre-dispatch 改写。
4. 事实一：用户插话时，纯等待可以立刻停；正在改文件的工具不会粗暴半路杀死，而是完成到安全边界再让模型听新指令。
5. 源码含义：中断语义按工具类型区分，明显优于统一 AbortController。
6. 事实二：先把所有施工单审核、改好并固化，再按“可并行/独占”排程，日志看到的参数就是实际执行参数。
7. 数据流：用户消息 → Agent loop/Session → Provider/工具 → compaction/Task → 账本与观测。
8. 小白动作：先把长任务拆成主循环、上下文、工具、协作和观测五格。
9. 第二个动作：为并发、预算、审批和恢复都写一个可见的终态，不要只看“运行中”。
10. 局限提醒：已审计 loop、session maintenance、steering/asides、yield、错误恢复和 goal continuation。
11. 这一章的结论：中断语义按工具类型区分，明显优于统一 AbortController。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: a53e4e790d3939a08708bf0d3c912d0763237a2d
