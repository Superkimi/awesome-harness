# M09 · 协作：Planner、Executor 与受限 parallel_tasks

## Hook
研究要并行但不能乱写，我先看 fail-closed 审批、读操作上限和子 Agent 资源隔离。

## Evidence anchors
- reasonix-collab-001: internal/agent/coordinator.go:36-81 · Planner 与 Executor 是两份独立 session，显式审批路线 fail-closed
  - 规划模型负责读和写计划，执行模型负责改东西；规划挂掉时，普通请求可继续，但“必须先批准”的路线不会偷偷绕过去。
- reasonix-collab-002: internal/agent/parallel_tasks.go:17-65 · parallel_tasks 只允许读操作，最多 64 个并发请求并受 scheduler/depth 限制
  - 它能同时派 64 个“查代码/查资料”的小工，但这些小工不能写文件，且仍要遵守并发和嵌套深度额度。
- reasonix-collab-003: internal/boot/boot.go:756-779 · 子 Agent 复用父工具基座，但单独限制模型、深度、并发、沙箱和 transcript
  - 子 Agent 不是复制一份全局进程；它们共享已经治理过的工具目录，却有自己的会话、额度和后台审批边界。

## Takeaway
双模型不是简单串两个 API，而是要有独立上下文、路由决策和不同的失败语义。
