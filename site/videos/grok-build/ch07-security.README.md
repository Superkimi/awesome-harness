# M07 · 权限：Plan Mode 和 Hook 先于按钮批准

- Project: Legacy Grok Build
- Fixed source commit: e5fd4816d43260c15ba785f103990c1ed6cea230
- Evidence ledger: data/legacy/evidence/grok-build/evidence.json
- Episode: ch07-security
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:157-205 · Plan Mode 的只读约束独立于 Always Approve
  - crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:1035-1102 · 权限判断理解访问类型和会话上下文
  - crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:977-1034 · PreToolUse Hook 可在权限前阻断
