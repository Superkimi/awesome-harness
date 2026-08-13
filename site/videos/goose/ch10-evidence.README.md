# M10 · 证据：怎样证明任务真的完成

- Project: Legacy Goose
- Fixed source commit: 11deb564d09db782a17878af7cfafd299d9fa461
- Evidence ledger: data/legacy/evidence/goose/evidence.json
- Episode: ch10-evidence
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/goose/src/session/session_manager.rs:45-96 · 会话、消息、成本与压缩指标落到 SQLite/WAL
  - crates/goose/src/tracing/observation_layer.rs:103-184 · Tracing 以 goose:: span 生成 trace/span 观测事件
