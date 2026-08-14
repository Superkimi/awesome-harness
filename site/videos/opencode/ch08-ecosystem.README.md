# M08 · 扩展：Skills、MCP 和插件进入同一工作流

- Project: Legacy OpenCode
- Fixed source commit: cc4b45612974f735ddec46009ede07729511fba4
- Evidence ledger: data/legacy/evidence/opencode/evidence.json
- Episode: ch08-ecosystem
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/opencode/src/skill/index.ts:21-43 · Skills 支持 OpenCode、Claude、agents 目录与远程 discovery
  - packages/opencode/src/mcp/index.ts:164-198 · MCP 同时支持 stdio、Streamable HTTP、SSE、OAuth、prompts 和 resources
  - packages/opencode/src/mcp/index.ts:123-125 · MCP OAuth 有 state 校验，但远程连接没有内建 SSRF 私网拦截
  - packages/opencode/src/plugin/loader.ts:76-144 · 插件是进程内代码，可改 prompt、请求、工具定义和执行结果
