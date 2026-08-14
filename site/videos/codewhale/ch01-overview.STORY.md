# M01 · 总览：UI 和 AI 交互由事件驱动控制面接管

## Hook
老板让我交付一个长任务，我先确认 CodeWhale 的 Core 如何把界面动作变成可观察事件。

## Evidence anchors
- codewhale-arch-001: crates/tui/src/core/mod.rs:1-15 · Core 把 UI 与 AI 交互拆成事件驱动的控制面
  - 终端画面只是一个事件消费者；真正决定模型、工具和会话怎么走的是 Core Engine。这样换成 Web、ACP 或测试宿主时，不必再复制一套 Agent Loop。
- codewhale-arch-003: crates/tui/src/core/engine.rs:1920-1942 · Turn 运行前冻结事实，运行后再做持久化与继续决策
  - 它先把“这次请求到底用哪个模型、哪些工具、什么权限”钉住，再让模型开跑；失败不会把会话炸掉，也不会误判成完成。

## Takeaway
自研时应先定义 operation/event 契约，再让 TUI、HTTP 和自动化入口共享同一运行时；禁止 UI 层私自执行工具或改会话。
