# M09 · 协作：多 Agent 是一棵控制面线程树

- Project: Legacy Open Interpreter
- Fixed source commit: 984acc698cd038885ecb0b82721402b01e11a5ad
- Evidence ledger: data/legacy/evidence/openinterpreter/evidence.json
- Episode: ch09-collaboration
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - codex-rs/core/src/agent/control.rs:88-180 · 多 Agent 是共享控制面的线程树
  - codex-rs/core/src/tools/spec_plan.rs:616-685 · Harness 自己的 Agent/Task 工具复用同一子 Agent 系统
