# M01 · 总览：一个会持续工作的安全执行器

- Project: Legacy Grok Build
- Fixed source commit: e5fd4816d43260c15ba785f103990c1ed6cea230
- Evidence ledger: data/legacy/evidence/grok-build/evidence.json
- Episode: ch01-overview
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/codegen/xai-grok-shell/src/session/acp_session_impl/run_loop.rs:120-183 · SessionActor 是事件驱动的长期存活 Actor
  - crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:355-449 · 工具执行明确拆成 prepare、并发 dispatch、post-flight
