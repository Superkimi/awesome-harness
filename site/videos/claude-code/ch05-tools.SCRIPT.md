1. 工具越接越多，prompt cache 还要稳定；我先看工具池排序和 MCP 合并。
2. 这一章不猜官方意图，只沿固定版本的复原代码、协议和测试看事实。
3. 固定版本证据：src/tools.ts:378-420 · 工具池合并内建与 MCP，并为 prompt cache 做确定性排序；src/services/mcp/client.ts:596-678 · MCP 是完整连接层：stdio、SSE、Streamable HTTP、WebSocket 和 claude.ai proxy。
4. 事实一：工具箱每轮不能乱序，否则模型缓存会失效；外接工具也不能偷偷覆盖同名的原厂扳手。
5. 源码含义：工具发现和缓存稳定性被当作 Harness 核心问题，而不只是 UI 列表。
6. 事实二：它不是只会启动本地 MCP 子进程，也能连长连接、HTTP、WebSocket 和平台代理；线断了会丢掉旧工具清单重新握手。
7. 数据流：用户消息 → query/Provider → 工具与权限 → compaction/Agent → JSONL 会话与可回退结果。
8. 小白动作：先确认实现来源和许可边界，再用一个小任务验证循环、工具、权限、恢复四件事。
9. 第二个动作：失败时分别记录 provider、context、permission 和 sandbox，不要把所有错误归成“模型不行”。
10. 局限提醒：审计内建与 MCP 工具池、稳定排序、动态工具发现和运行中执行。
11. 这一章的结论：工具发现和缓存稳定性被当作 Harness 核心问题，而不只是 UI 列表。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 3bb6b5746238c418138eb96d57765d79012edd96
