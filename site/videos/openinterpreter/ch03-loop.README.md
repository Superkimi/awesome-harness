# M03 · 主循环：一次 turn 里为什么有多个 step

- Project: Legacy Open Interpreter
- Fixed source commit: 984acc698cd038885ecb0b82721402b01e11a5ad
- Evidence ledger: data/legacy/evidence/openinterpreter/evidence.json
- Episode: ch03-loop
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - codex-rs/core/src/session/turn.rs:140-228 · 共享内核仍是 turn 内多 step 的流式工具循环
  - codex-rs/core/src/session/turn.rs:243-292 · step 快照让上下文、工具清单与工具执行看到同一世界
