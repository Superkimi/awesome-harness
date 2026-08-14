1. 团队要装一组能力包，我先看动态 MCP、GEMINI.md、trust 目录和 Before/After hooks。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：packages/core/src/tools/mcp-client.ts:188-292 · MCP 支持 stdio、Streamable HTTP、SSE fallback、OAuth、动态目录刷新和 progress；packages/core/src/utils/extensionLoader.ts:31-110 · 扩展是能力包：MCP、policy/checker、context、commands、hooks、agents 与 skills 可成组热装卸；packages/core/src/utils/memoryDiscovery.ts:383-454 · GEMINI.md/Memory 分 global、user-project、extension、project，并支持受信目录 JIT 加载。
4. 事实一：本地子进程和远程服务都能接；服务器换工具会热刷新，远程登录不是自动偷偷弹出，必须配置允许 OAuth。
5. 源码含义：连接器成熟，且认证意图边界清楚；热刷新仍需依赖 registry sort 与 policy validation。
6. 事实二：扩展不是单个脚本，而是一箱可协同变化的工具、规则、记忆、钩子和 Agent。
7. 数据流：用户消息 → sendMessageStream → Context/Policy → Scheduler/AgentProtocol → JSONL checkpoint。
8. 小白动作：先把长任务拆成循环、上下文、策略、工具和回放五格。
9. 第二个动作：为超限、取消、拒绝和重试分别写终态，不要只看“执行成功”。
10. 局限提醒：MCP transports/OAuth/refresh/admin policy，扩展热装卸，GEMINI.md/JIT memory，skills 和 hooks。
11. 这一章的结论：连接器成熟，且认证意图边界清楚；热刷新仍需依赖 registry sort 与 policy validation。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 1ac3377395868295e128b96726d605a900b5946b
