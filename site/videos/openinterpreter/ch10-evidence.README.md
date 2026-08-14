# M10 · 证据：JSONL 是事实源，分析和诊断分层

- Project: Legacy Open Interpreter
- Fixed source commit: 984acc698cd038885ecb0b82721402b01e11a5ad
- Evidence ledger: data/legacy/evidence/openinterpreter/evidence.json
- Episode: ch10-evidence
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - codex-rs/core/src/session/rollout_reconstruction.rs:116-288 · JSONL rollout 是可恢复事件事实源，SQLite/trace 是查询与诊断层
  - codex-rs/analytics/src/client.rs:54-105 · Open Interpreter 使用独立分析端点，默认启用但可显式关闭
