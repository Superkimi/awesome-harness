# M08 · 扩展：MCP、Memory、Skills 和 Hooks

- Project: Legacy Gemini CLI
- Fixed source commit: 1ac3377395868295e128b96726d605a900b5946b
- Evidence ledger: data/legacy/evidence/gemini-cli/evidence.json
- Episode: ch08-ecosystem
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/core/src/tools/mcp-client.ts:188-292 · MCP 支持 stdio、Streamable HTTP、SSE fallback、OAuth、动态目录刷新和 progress
  - packages/core/src/utils/extensionLoader.ts:31-110 · 扩展是能力包：MCP、policy/checker、context、commands、hooks、agents 与 skills 可成组热装卸
  - packages/core/src/utils/memoryDiscovery.ts:383-454 · GEMINI.md/Memory 分 global、user-project、extension、project，并支持受信目录 JIT 加载
  - packages/core/src/skills/skillManager.ts:17-99 · Skills 有明确覆盖顺序，workspace skills 受 folder trust 保护
  - packages/core/src/core/client.ts:153-252 · Before/AfterAgent hooks 可停止、阻断、注入上下文或要求清空后继续
