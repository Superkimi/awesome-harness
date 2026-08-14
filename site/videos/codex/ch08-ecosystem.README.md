# M08 · 扩展：MCP、AGENTS、Skills 和 Hooks 受预算控制

- Project: Legacy OpenAI Codex
- Fixed source commit: 902bd9e06b3ecb32cbf7f8e64cd23b956be3e7fe
- Evidence ledger: data/legacy/evidence/codex/evidence.json
- Episode: ch08-ecosystem
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - codex-rs/codex-mcp/src/connection_manager.rs:66-117 · MCP 是带复用、认证、required gate 和 catalog revision 的运行时
  - codex-rs/codex-mcp/src/connection_manager/tool_catalog.rs:34-55 · 模型只能看到显式可见且能绑定到同一目录版本的 MCP 工具
  - codex-rs/core/src/agents_md.rs:1-16 · AGENTS.md 从项目根向 cwd 分层合并，局部 override 优先且有总字节预算
  - codex-rs/core/src/session/mod.rs:3336-3397 · Skills、plugins 和 extensions 都在初始上下文构建期受预算与来源控制
  - codex-rs/core/src/hook_runtime.rs:103-220 · Hooks 覆盖 session、prompt、permission、tool、compact、stop 与 subagent 生命周期
