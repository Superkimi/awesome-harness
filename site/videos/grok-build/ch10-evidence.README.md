# M10 · 证据：提示、事件与恢复如何可审计

- Project: Legacy Grok Build
- Fixed source commit: e5fd4816d43260c15ba785f103990c1ed6cea230
- Evidence ledger: data/legacy/evidence/grok-build/evidence.json
- Episode: ch10-evidence
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/codegen/xai-grok-agent/src/prompt/context.rs:80-152 · PromptContext 是可序列化、可检查的一等契约
  - crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:392-436 · 工具、权限、压缩和沙箱均产出结构化事件
  - crates/codegen/xai-grok-shell/src/session/compaction.rs:1282-1460 · 压缩后重建的是“任务状态”，不是纯聊天摘要
