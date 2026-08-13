# M04 · Harness：不只换 Prompt，还会改历史和工具协议

- Project: Legacy Open Interpreter
- Fixed source commit: 984acc698cd038885ecb0b82721402b01e11a5ad
- Evidence ledger: data/legacy/evidence/openinterpreter/evidence.json
- Episode: ch04-model
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - codex-rs/core/src/harness/pi.rs:21-120 · 各 Harness 不只换 prompt，还重写历史和工具协议
  - codex-rs/core/src/harness/request.rs:75-231 · 优势是“一个安全底盘，多种模型原生手感”；主要成本是兼容矩阵爆炸
