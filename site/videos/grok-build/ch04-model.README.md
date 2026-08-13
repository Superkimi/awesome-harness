# M04 · 工具：prepare、dispatch、post-flight 三段式

- Project: Legacy Grok Build
- Fixed source commit: e5fd4816d43260c15ba785f103990c1ed6cea230
- Evidence ledger: data/legacy/evidence/grok-build/evidence.json
- Episode: ch04-model
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:355-449 · 工具执行明确拆成 prepare、并发 dispatch、post-flight
  - crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:878-950 · 工具参数对模型瑕疵有恢复层
