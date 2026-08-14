1. 研究要并行但不能乱写，我先看 fail-closed 审批、读操作上限和子 Agent 资源隔离。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：internal/agent/coordinator.go:36-81 · Planner 与 Executor 是两份独立 session，显式审批路线 fail-closed；internal/agent/parallel_tasks.go:17-65 · parallel_tasks 只允许读操作，最多 64 个并发请求并受 scheduler/depth 限制；internal/boot/boot.go:756-779 · 子 Agent 复用父工具基座，但单独限制模型、深度、并发、沙箱和 transcript。
4. 事实一：规划模型负责读和写计划，执行模型负责改东西；规划挂掉时，普通请求可继续，但“必须先批准”的路线不会偷偷绕过去。
5. 源码含义：双模型不是简单串两个 API，而是要有独立上下文、路由决策和不同的失败语义。
6. 事实二：它能同时派 64 个“查代码/查资料”的小工，但这些小工不能写文件，且仍要遵守并发和嵌套深度额度。
7. 数据流：Boot → Controller/Agent → Provider/工具 → Policy/Sandbox → event wire/Evidence Ledger。
8. 小白动作：先把一轮任务拆成装配、动作、策略、回放和验收五格。
9. 第二个动作：为 thinking、工具、恢复和协作分别记录证据，不要把日志当成事实账本。
10. 局限提醒：Planner/Executor 两模型、parallel_tasks 64 上限、深度/并发/读写调度和持久 transcript。
11. 这一章的结论：双模型不是简单串两个 API，而是要有独立上下文、路由决策和不同的失败语义。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 9aaf8d381a214cd2cb6df774d3b207a646ddd651
