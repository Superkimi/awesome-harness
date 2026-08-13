# M08 · 扩展：MCP、插件与 Skill 三条链

- Project: Legacy Claude Code (reconstruction)
- Fixed source commit: 3bb6b5746238c418138eb96d57765d79012edd96
- Evidence ledger: data/legacy/evidence/claude-code/evidence.json
- Episode: ch08-ecosystem
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - src/services/mcp/client.ts:596-678 · MCP 是完整连接层：stdio、SSE、Streamable HTTP、WebSocket 和 claude.ai proxy
  - src/services/mcp/client.ts:210-229 · MCP 具备描述限长、请求超时与企业 allow/deny 管理
  - src/utils/plugins/pluginLoader.ts:1-29 · 插件是复合扩展包，不只是 prompt 文件
  - src/skills/loadSkillsDir.ts:78-108 · Skill 采用元数据先行、内容按需装载，并支持路径条件激活
