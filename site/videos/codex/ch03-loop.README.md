# M03 · 主循环：流式采样和工具 Future 同时推进

- Project: Legacy OpenAI Codex
- Fixed source commit: 902bd9e06b3ecb32cbf7f8e64cd23b956be3e7fe
- Evidence ledger: data/legacy/evidence/codex/evidence.json
- Episode: ch03-loop
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - codex-rs/core/src/session/turn.rs:2034-2168 · 流式采样与工具 Future 同时推进，并可被新消息抢占
  - codex-rs/core/src/session/turn.rs:1176-1273 · 重试预算属于 turn-scoped client session，窗口超限不当作普通网络错误重试
