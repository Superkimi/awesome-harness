1. 团队要接远端 MCP 和插件，我先看 secrets 边界、reviewed authority、hash 失信和 fail-closed hook。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：crates/tui/src/mcp.rs:1-37 · MCP 连接器覆盖 stdio、Streamable HTTP、SSE 和 OAuth，并有连接池；crates/tui/src/mcp.rs:57-90 · MCP secrets 不进入错误文本，远端响应和 body 也有边界；crates/tui/src/mcp.rs:641-695 · reviewed plugin 的 MCP 在 launch、origin 和 catalog 暴露前都要复核 authority。
4. 事实一：MCP 在这里不是一个 HTTP helper，而是有连接生命周期、能力发现、超时和认证的子系统；不同 server 的连接可以复用。
5. 源码含义：连接器层要把 transport、auth、discovery、timeout 和 pool 分开，避免某个网络协议细节侵入 Agent loop。
6. 事实二：API key 可以来自环境而不是 mcp.json；服务端返回一个超大 chunk 或把密码塞进 URL，也不会原样写进日志或无限吃内存。
7. 数据流：Core/EngineConfig → turn freeze → ToolSpec/MCP → policy/sandbox → session/checkpoint/receipt。
8. 小白动作：先把任务拆成能力、预算、审批、执行和证据五格。
9. 第二个动作：为并行、心跳、取消、恢复和用量归属各留一个明确状态。
10. 局限提醒：stdio/Streamable HTTP/SSE/OAuth、secret placeholder、body cap、reviewed plugin recheck 与连接池。
11. 这一章的结论：连接器层要把 transport、auth、discovery、timeout 和 pool 分开，避免某个网络协议细节侵入 Agent loop。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cfc2f2b13c070e900ee10dbeffb07028d3beaebd
