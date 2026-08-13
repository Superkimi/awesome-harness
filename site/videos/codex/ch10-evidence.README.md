# M10 · 证据：JSONL、SQLite 和跨面观测

- Project: Legacy OpenAI Codex
- Fixed source commit: 902bd9e06b3ecb32cbf7f8e64cd23b956be3e7fe
- Evidence ledger: data/legacy/evidence/codex/evidence.json
- Episode: ch10-evidence
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - codex-rs/rollout/src/recorder.rs:93-171 · 会话采用 JSONL rollout 作为事件事实源，后台 writer 支持 persist、flush 与失败记忆
  - codex-rs/state/src/lib.rs:1-10 · SQLite 是可查询镜像，并把状态、日志、目标和记忆拆库降低锁竞争
  - codex-rs/core/src/client.rs:74-91 · 观测横跨模型、工具、hooks、MCP、rollout 与 SQLite，不只是一份 CLI 日志
