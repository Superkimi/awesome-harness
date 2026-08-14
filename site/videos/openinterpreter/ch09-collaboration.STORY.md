# M09 · 协作：多 Agent 是一棵控制面线程树

## Hook
研究与实现要并行，我先看 control plane 如何管理线程树，以及 Harness 工具怎样复用子 Agent。

## Evidence anchors
- oi-agent-001: codex-rs/core/src/agent/control.rs:88-180 · 多 Agent 是共享控制面的线程树
  - 子 Agent 不是主函数里临时递归一下，而是有独立会话和持久关系的线程树。
- oi-agent-002: codex-rs/core/src/tools/spec_plan.rs:616-685 · Harness 自己的 Agent/Task 工具复用同一子 Agent 系统
  - 外面看像 Claude 的 Agent 工具或 OpenCode 的 task，里面其实都在同一棵线程树上派工。

## Takeaway
可以跨步等待、续跑和观测；也需要全局驻留数、运行数和深度限制。
