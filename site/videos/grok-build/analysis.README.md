# Grok Build · 技术分析总览

- Project: Legacy Grok Build
- Fixed source commit: e5fd4816d43260c15ba785f103990c1ed6cea230
- Evidence ledger: data/legacy/evidence/grok-build/evidence.json
- Episode: analysis
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/codegen/xai-grok-shell/src/session/acp_session_impl/run_loop.rs:120-183 · SessionActor 是事件驱动的长期存活 Actor
  - crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:355-449 · 工具执行明确拆成 prepare、并发 dispatch、post-flight
  - crates/codegen/xai-grok-sandbox/src/lib.rs:8-18 · 提供真正的内核级文件系统沙箱
  - crates/codegen/xai-grok-shell/src/session/compaction.rs:3-35 · 压缩是一条带预热、两阶段和恢复梯子的子系统
  - crates/codegen/xai-grok-agent/src/plugins/manifest.rs:103-170 · 一个插件可同时交付 Skills、Commands、Agents、Hooks、MCP、LSP
