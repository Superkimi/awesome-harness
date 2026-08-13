1. 架构评审只剩十分钟，我得讲清能力、预算、权限和 turn 冻结怎样汇合。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：crates/tui/src/core/engine.rs:221-298 · EngineConfig 是把能力、预算和权限拧在一起的运行时总闸；crates/tui/src/core/engine.rs:1920-1942 · Turn 运行前冻结事实，运行后再做持久化与继续决策；crates/tui/src/core/engine.rs:3385-3418 · Tool catalog 与 preview 共享同一装配函数，但 preview 是纯观察。
4. 事实一：CodeWhale 不是把安全、长任务和扩展散落在命令行参数里，而是先形成一份“本次会话的有效配置”，后面的 turn、工具和子 Agent 都从这份配置派生。
5. 源码含义：自研要区分静态配置、turn authority 和工具调用 authority；不要让每个工具重新解释一遍全局配置。
6. 事实二：它先把“这次请求到底用哪个模型、哪些工具、什么权限”钉住，再让模型开跑；失败不会把会话炸掉，也不会误判成完成。
7. 数据流：Core/EngineConfig → turn freeze → ToolSpec/MCP → policy/sandbox → session/checkpoint/receipt。
8. 小白动作：先把任务拆成能力、预算、审批、执行和证据五格。
9. 第二个动作：为并行、心跳、取消、恢复和用量归属各留一个明确状态。
10. 局限提醒：事件驱动 Core、EngineConfig、宿主 turn admission、工具目录单一装配点与异常收尾。
11. 这一章的结论：自研要区分静态配置、turn authority 和工具调用 authority；不要让每个工具重新解释一遍全局配置。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cfc2f2b13c070e900ee10dbeffb07028d3beaebd
