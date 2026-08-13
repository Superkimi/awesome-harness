# M09 · 协作：Planner、Executor 与受限 parallel_tasks

- Project: Legacy DeepSeek-Reasonix
- Fixed source commit: 9aaf8d381a214cd2cb6df774d3b207a646ddd651
- Evidence ledger: data/legacy/evidence/deepseek-reasonix/evidence.json
- Episode: ch09-collaboration
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - internal/agent/coordinator.go:36-81 · Planner 与 Executor 是两份独立 session，显式审批路线 fail-closed
  - internal/agent/parallel_tasks.go:17-65 · parallel_tasks 只允许读操作，最多 64 个并发请求并受 scheduler/depth 限制
  - internal/boot/boot.go:756-779 · 子 Agent 复用父工具基座，但单独限制模型、深度、并发、沙箱和 transcript
