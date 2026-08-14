# M05 · 工具：内建与 MCP 怎样稳定合并

## Hook
工具越接越多，prompt cache 还要稳定；我先看工具池排序和 MCP 合并。

## Evidence anchors
- claude-code-tools-001: src/tools.ts:378-420 · 工具池合并内建与 MCP，并为 prompt cache 做确定性排序
  - 工具箱每轮不能乱序，否则模型缓存会失效；外接工具也不能偷偷覆盖同名的原厂扳手。
- claude-code-mcp-001: src/services/mcp/client.ts:596-678 · MCP 是完整连接层：stdio、SSE、Streamable HTTP、WebSocket 和 claude.ai proxy
  - 它不是只会启动本地 MCP 子进程，也能连长连接、HTTP、WebSocket 和平台代理；线断了会丢掉旧工具清单重新握手。

## Takeaway
工具发现和缓存稳定性被当作 Harness 核心问题，而不只是 UI 列表。
