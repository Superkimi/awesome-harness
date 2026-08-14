# M03 · 主循环：断流如何撤销再重播

- Project: Legacy JCode
- Fixed source commit: 71fa60c4dc875ebdaf089e6e84b29cbd61cbb478f
- Evidence ledger: data/legacy/evidence/jcode/evidence.json
- Episode: ch03-loop
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/jcode-app-core/src/agent/turn_loops.rs:17-68 · 循环在每次请求前修复工具配对并重建稳定快照
  - crates/jcode-app-core/src/agent/turn_loops.rs:455-484 · 中途断流先撤销半截状态再完整重播
  - crates/jcode-app-core/src/agent/turn_loops.rs:5-15 · 上下文、截断回复和工具后空回复各有独立止损上限
