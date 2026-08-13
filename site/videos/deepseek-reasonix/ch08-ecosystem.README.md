# M08 · 扩展：MCP catalog-first 与 metadata-first Skills

- Project: Legacy DeepSeek-Reasonix
- Fixed source commit: 9aaf8d381a214cd2cb6df774d3b207a646ddd651
- Evidence ledger: data/legacy/evidence/deepseek-reasonix/evidence.json
- Episode: ch08-ecosystem
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - internal/plugin/plugin.go:1-7 · MCP 以统一 JSON-RPC 适配 stdio、Streamable HTTP 和 legacy SSE
  - internal/plugin/security.go:17-66 · MCP 项目服务器先做无 secret 的身份授权，再做 live safety 对账
  - internal/plugin/plugin.go:243-279 · MCP 启动是 catalog-first、cache-aware、可惰性连接的
  - internal/skill/index.go:10-28 · Skills 采用 metadata-first 索引，正文按需加载
  - internal/memory/memory.go:12-24 · Memory 写入有封闭路径集合，背景事实与高权指令分开
