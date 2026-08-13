# M02 · 架构：EngineConfig 是运行时总闸

## Hook
架构评审只剩十分钟，我得讲清能力、预算、权限和 turn 冻结怎样汇合。

## Evidence anchors
- codewhale-arch-002: crates/tui/src/core/engine.rs:221-298 · EngineConfig 是把能力、预算和权限拧在一起的运行时总闸
  - CodeWhale 不是把安全、长任务和扩展散落在命令行参数里，而是先形成一份“本次会话的有效配置”，后面的 turn、工具和子 Agent 都从这份配置派生。
- codewhale-arch-003: crates/tui/src/core/engine.rs:1920-1942 · Turn 运行前冻结事实，运行后再做持久化与继续决策
  - 它先把“这次请求到底用哪个模型、哪些工具、什么权限”钉住，再让模型开跑；失败不会把会话炸掉，也不会误判成完成。
- codewhale-arch-004: crates/tui/src/core/engine.rs:3385-3418 · Tool catalog 与 preview 共享同一装配函数，但 preview 是纯观察
  - 用户点“查看这次会发给模型什么工具”时，不会因为预览动作偷偷启动 MCP 或子 Agent；预览和真实请求走同一个拼装逻辑，减少两套实现漂移。

## Takeaway
自研要区分静态配置、turn authority 和工具调用 authority；不要让每个工具重新解释一遍全局配置。
