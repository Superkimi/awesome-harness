# M08 · 扩展：MCP、AGENTS、Skills 和动态 memory

- Project: Legacy JCode
- Fixed source commit: 71fa60c4dc875ebdaf089e6e84b29cbd61cbb478f
- Evidence ledger: data/legacy/evidence/jcode/evidence.json
- Episode: ch08-ecosystem
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/jcode-base/src/mcp/manager.rs:1-59 · MCP 区分共享池与 session-owned client
  - crates/jcode-app-core/src/agent/turn_execution.rs:335-393 · MCP schema 晚到只允许一次 cache miss，JSON-RPC 请求按 ID 隔离
  - crates/jcode-base/src/prompt.rs:374-448 · 指令层有稳定优先级：base、AGENTS、overlay、preferred tools、skills、动态 memory
  - crates/jcode-base/src/skill.rs:11-60 · Skills 跨 Jcode/Agents/Claude/Codex 生态并做 per-workspace overlay
