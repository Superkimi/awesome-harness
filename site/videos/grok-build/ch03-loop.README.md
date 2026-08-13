# M03 · 主循环：长期存活的 SessionActor

- Project: Legacy Grok Build
- Fixed source commit: e5fd4816d43260c15ba785f103990c1ed6cea230
- Evidence ledger: data/legacy/evidence/grok-build/evidence.json
- Episode: ch03-loop
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/codegen/xai-grok-shell/src/session/acp_session_impl/run_loop.rs:120-183 · SessionActor 是事件驱动的长期存活 Actor
