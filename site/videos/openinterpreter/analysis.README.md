# Open Interpreter · 技术分析总览

- Project: Legacy Open Interpreter
- Fixed source commit: 984acc698cd038885ecb0b82721402b01e11a5ad
- Evidence ledger: data/legacy/evidence/openinterpreter/evidence.json
- Episode: analysis
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - codex-rs/product-info/src/lib.rs:45-79 · 当前源码不是经典 Python Open Interpreter，而是 Rust/Codex 兼容分叉
  - codex-rs/core/src/harness/mod.rs:1-18 · 核心差异是一层多 Harness 仿真目录
  - codex-rs/core/src/session/turn.rs:140-228 · 共享内核仍是 turn 内多 step 的流式工具循环
  - codex-rs/core/src/config/permissions.rs:170-260 · 审批和能力授权是两条轴，OS 沙箱是真实进程变换
  - codex-rs/core/src/session/rollout_reconstruction.rs:116-288 · JSONL rollout 是可恢复事件事实源，SQLite/trace 是查询与诊断层
