# M05 · 参数恢复：模型写错一点也不能全盘失败

- Project: Legacy Grok Build
- Fixed source commit: e5fd4816d43260c15ba785f103990c1ed6cea230
- Evidence ledger: data/legacy/evidence/grok-build/evidence.json
- Episode: ch05-tools
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:878-950 · 工具参数对模型瑕疵有恢复层
