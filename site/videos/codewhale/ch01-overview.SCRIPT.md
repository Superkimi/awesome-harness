1. 老板让我交付一个长任务，我先确认 CodeWhale 的 Core 如何把界面动作变成可观察事件。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：crates/tui/src/core/mod.rs:1-15 · Core 把 UI 与 AI 交互拆成事件驱动的控制面；crates/tui/src/core/engine.rs:1920-1942 · Turn 运行前冻结事实，运行后再做持久化与继续决策。
4. 事实一：终端画面只是一个事件消费者；真正决定模型、工具和会话怎么走的是 Core Engine。这样换成 Web、ACP 或测试宿主时，不必再复制一套 Agent Loop。
5. 源码含义：自研时应先定义 operation/event 契约，再让 TUI、HTTP 和自动化入口共享同一运行时；禁止 UI 层私自执行工具或改会话。
6. 事实二：它先把“这次请求到底用哪个模型、哪些工具、什么权限”钉住，再让模型开跑；失败不会把会话炸掉，也不会误判成完成。
7. 数据流：Core/EngineConfig → turn freeze → ToolSpec/MCP → policy/sandbox → session/checkpoint/receipt。
8. 小白动作：先把任务拆成能力、预算、审批、执行和证据五格。
9. 第二个动作：为并行、心跳、取消、恢复和用量归属各留一个明确状态。
10. 局限提醒：事件驱动 Core、EngineConfig、宿主 turn admission、工具目录单一装配点与异常收尾。
11. 这一章的结论：自研时应先定义 operation/event 契约，再让 TUI、HTTP 和自动化入口共享同一运行时；禁止 UI 层私自执行工具或改会话。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cfc2f2b13c070e900ee10dbeffb07028d3beaebd
