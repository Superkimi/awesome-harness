# M09 · 插件与子 Agent：能力如何成套交付

- Project: Legacy Grok Build
- Fixed source commit: e5fd4816d43260c15ba785f103990c1ed6cea230
- Evidence ledger: data/legacy/evidence/grok-build/evidence.json
- Episode: ch09-collaboration
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/codegen/xai-grok-agent/src/plugins/manifest.rs:103-170 · 一个插件可同时交付 Skills、Commands、Agents、Hooks、MCP、LSP
  - crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:811-839 · 子 Agent 支持后台执行、恢复、深度限制与 worktree 隔离
