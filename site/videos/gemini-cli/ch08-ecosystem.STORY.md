# M08 · 扩展：MCP、Memory、Skills 和 Hooks

## Hook
团队要装一组能力包，我先看动态 MCP、GEMINI.md、trust 目录和 Before/After hooks。

## Evidence anchors
- gemini-mcp-001: packages/core/src/tools/mcp-client.ts:188-292 · MCP 支持 stdio、Streamable HTTP、SSE fallback、OAuth、动态目录刷新和 progress
  - 本地子进程和远程服务都能接；服务器换工具会热刷新，远程登录不是自动偷偷弹出，必须配置允许 OAuth。
- gemini-extension-001: packages/core/src/utils/extensionLoader.ts:31-110 · 扩展是能力包：MCP、policy/checker、context、commands、hooks、agents 与 skills 可成组热装卸
  - 扩展不是单个脚本，而是一箱可协同变化的工具、规则、记忆、钩子和 Agent。
- gemini-memory-001: packages/core/src/utils/memoryDiscovery.ts:383-454 · GEMINI.md/Memory 分 global、user-project、extension、project，并支持受信目录 JIT 加载
  - 常驻规章分层保存，走进更深目录时才加载当地规则；不受信目录不会因为读一个文件就注入它的说明。
- gemini-skills-001: packages/core/src/skills/skillManager.ts:17-99 · Skills 有明确覆盖顺序，workspace skills 受 folder trust 保护
  - 越靠近项目的技能优先级越高，但项目没被信任前不会让它改 Agent 的做事方式。
- gemini-hooks-001: packages/core/src/core/client.ts:153-252 · Before/AfterAgent hooks 可停止、阻断、注入上下文或要求清空后继续
  - 钩子既能在开工前加背景/拦截，也能在收工时验收，不合格可清空现场后让 Agent 按理由重做。

## Takeaway
连接器成熟，且认证意图边界清楚；热刷新仍需依赖 registry sort 与 policy validation。
