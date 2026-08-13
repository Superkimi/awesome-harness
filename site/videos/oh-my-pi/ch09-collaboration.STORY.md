# M09 · 协作：Task 是真正的多 Agent 调度器

## Hook
研究要 batch、async，还要让兄弟 Agent 实时协作；我沿 Task 合同看递归、预算和 hub。

## Evidence anchors
- omp-subagent-001: packages/coding-agent/src/task/index.ts:1-53 · Task 是内建多 Agent 调度器，支持 batch、async 与结构化 yield
  - 主 Agent 可以一次发一组有共同背景的任务，每个工人独立选角色和输出合同；结果不是随便一段聊天，而是显式交付。
- omp-subagent-002: packages/coding-agent/src/config/settings-schema.ts:4505-4614 · 递归、并发、预算、闲置 park 与冷恢复都有硬合同
  - 工人不会无限生工人，也能在闲置时卸载、之后按原权限复活；恢复时不凭猜测重建能力。
- omp-subagent-003: packages/coding-agent/src/task/index.ts:412-429 · 兄弟 Agent 可用 hub 实时协作，不只回传父节点
  - 几个工人不必各做各的等老板汇总，可以在工作中互相发消息、广播冲突和等待对方。

## Takeaway
比 subprocess 示例级子 Agent 更接近真正控制平面。
