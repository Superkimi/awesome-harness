# M02 · 架构：turn、step 和上下文快照

- Project: Legacy OpenAI Codex
- Fixed source commit: 902bd9e06b3ecb32cbf7f8e64cd23b956be3e7fe
- Evidence ledger: data/legacy/evidence/codex/evidence.json
- Episode: ch02-architecture
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - codex-rs/core/src/session/turn.rs:153-274 · 每个 turn 由多个 step 组成，step 内共享一次不可漂移的上下文快照
  - codex-rs/core/src/session/turn.rs:1176-1273 · 重试预算属于 turn-scoped client session，窗口超限不当作普通网络错误重试
