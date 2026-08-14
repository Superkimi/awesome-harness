# M05 · 工具：内建与 MCP 怎样稳定合并

- Project: Legacy Claude Code (reconstruction)
- Fixed source commit: 3bb6b5746238c418138eb96d57765d79012edd96
- Evidence ledger: data/legacy/evidence/claude-code/evidence.json
- Episode: ch05-tools
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - src/tools.ts:378-420 · 工具池合并内建与 MCP，并为 prompt cache 做确定性排序
  - src/services/mcp/client.ts:596-678 · MCP 是完整连接层：stdio、SSE、Streamable HTTP、WebSocket 和 claude.ai proxy
