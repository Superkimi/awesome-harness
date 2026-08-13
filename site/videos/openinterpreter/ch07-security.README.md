# M07 · 安全：审批、能力授权与 OS 沙箱是三件事

- Project: Legacy Open Interpreter
- Fixed source commit: 984acc698cd038885ecb0b82721402b01e11a5ad
- Evidence ledger: data/legacy/evidence/openinterpreter/evidence.json
- Episode: ch07-security
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - codex-rs/core/src/tools/handlers/harness_fs.rs:39-94 · Harness 文件工具先过策略，且同时检查原路径与规范化路径
  - codex-rs/core/src/config/permissions.rs:170-260 · 审批和能力授权是两条轴，OS 沙箱是真实进程变换
