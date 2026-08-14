1. 团队要加项目 MCP 和 Skill，我先看无 secret 授权、惰性连接、索引和封闭写入路径。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：internal/plugin/plugin.go:1-7 · MCP 以统一 JSON-RPC 适配 stdio、Streamable HTTP 和 legacy SSE；internal/plugin/security.go:17-66 · MCP 项目服务器先做无 secret 的身份授权，再做 live safety 对账；internal/plugin/plugin.go:243-279 · MCP 启动是 catalog-first、cache-aware、可惰性连接的。
4. 事实一：外部工具可以是本地进程，也可以是远程 HTTP/SSE，但 Agent 看到的都是同一个 Tool；连接、超时、取消和响应大小在连接层处理。
5. 源码含义：连接器治理应是独立 runtime 层，不能让每个工具自己实现 JSON-RPC、超时和取消。
6. 事实二：换了 MCP 二进制、目标地址或工具安全标记，不会因为旧 schema cache 还在就直接执行；同时默认插件是受信任 host 进程，不能误以为它自动继承 Agent shell 沙箱。
7. 数据流：Boot → Controller/Agent → Provider/工具 → Policy/Sandbox → event wire/Evidence Ledger。
8. 小白动作：先把一轮任务拆成装配、动作、策略、回放和验收五格。
9. 第二个动作：为 thinking、工具、恢复和协作分别记录证据，不要把日志当成事实账本。
10. 局限提醒：stdio/HTTP/SSE JSON-RPC、惰性 schema cache、启动并发、身份摘要与 live safety recheck。
11. 这一章的结论：连接器治理应是独立 runtime 层，不能让每个工具自己实现 JSON-RPC、超时和取消。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 9aaf8d381a214cd2cb6df774d3b207a646ddd651
