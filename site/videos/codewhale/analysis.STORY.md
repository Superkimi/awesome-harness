# CodeWhale · 技术分析总览

## Hook
评审问我：这个 TUI Core 怎么把 EngineConfig、工具权限、MCP、Fleet 和子 Agent 变成可审计控制面？我沿固定证据拆。

## Evidence anchors
- codewhale-arch-001: crates/tui/src/core/mod.rs:1-15 · Core 把 UI 与 AI 交互拆成事件驱动的控制面
  - 终端画面只是一个事件消费者；真正决定模型、工具和会话怎么走的是 Core Engine。这样换成 Web、ACP 或测试宿主时，不必再复制一套 Agent Loop。
- codewhale-arch-002: crates/tui/src/core/engine.rs:221-298 · EngineConfig 是把能力、预算和权限拧在一起的运行时总闸
  - CodeWhale 不是把安全、长任务和扩展散落在命令行参数里，而是先形成一份“本次会话的有效配置”，后面的 turn、工具和子 Agent 都从这份配置派生。
- codewhale-tools-001: crates/tui/src/tools/spec.rs:1158-1217 · ToolSpec 把能力、审批、只读、并行和资源声明放到同一输入特化接口
  - 工具不是只有一个名字和一个函数；系统会问“这一次具体参数是否只读、能否并行、需要什么审批、会占什么资源”。
- codewhale-security-001: crates/execpolicy/src/lib.rs:10-32 · ExecPolicy 是 Builtin/Agent/User 三层规则，deny 优先且支持 arity-aware shell 判断
  - 用户自己的规则可以补充策略，但不能把更高优先级的拒绝抹掉；`cargo test` 和 `cargo test --config ...` 也不会被当成同一件事。
- codewhale-collab-001: crates/tui/src/tools/subagent/mod.rs:1-11 · agent 是模型可见的创建面，coordination tools 复用同一 mailbox/checkpoint machinery
  - 子 Agent 不是一套旁路脚本：父子共享结构化协调协议，但子 Agent 默认不会继承主 Agent 的全权模式。
- codewhale-persistence-001: crates/tui/src/session_manager.rs:26-40 · Session 保存是原子写，恢复会校验 schema 并修复 tool history
  - 进程崩溃时不会留下半个 JSON；下一次加载也不会把孤儿 tool result 原样塞回 provider。

## Takeaway
自研时应先定义 operation/event 契约，再让 TUI、HTTP 和自动化入口共享同一运行时；禁止 UI 层私自执行工具或改会话。
