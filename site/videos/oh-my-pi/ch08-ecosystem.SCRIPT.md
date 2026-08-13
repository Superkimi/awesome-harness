1. 团队要接 Claude、Gemini 和 OpenCode 的 MCP，我先看 manager、discovery 和高权限扩展边界。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/coding-agent/src/mcp/manager.ts:282-380 · MCP 是完整内建连接器，不是插件样例；packages/coding-agent/src/discovery/opencode.ts:88-167 · 可直接吸收 Claude、Gemini、OpenCode 等生态的 MCP 配置；packages/coding-agent/src/extensibility/extensions/loader.ts:120-230 · Extensions、hooks、custom tools 与 marketplace 都是同进程高权限扩展。
4. 事实一：它不仅能调用 MCP 工具，还管理连接、认证、资源订阅、服务端推送和重连生命周期。
5. 源码含义：连接器成熟度高，适合企业工具生态；同时需审计远端 URL、headers 和本地 command 配置。
6. 事实二：用户换工具时不必手工重写全部 MCP 配置，OMP 会读取其他 Agent 的配置并统一格式。
7. 数据流：用户消息 → Agent loop/Session → Provider/工具 → compaction/Task → 账本与观测。
8. 小白动作：先把长任务拆成主循环、上下文、工具、协作和观测五格。
9. 第二个动作：为并发、预算、审批和恢复都写一个可见的终态，不要只看“运行中”。
10. 局限提醒：已审计多来源配置、stdio/SSE/HTTP、OAuth、缓存、订阅、reconnect 与动态工具刷新。
11. 这一章的结论：连接器成熟度高，适合企业工具生态；同时需审计远端 URL、headers 和本地 command 配置。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: a53e4e790d3939a08708bf0d3c912d0763237a2d
