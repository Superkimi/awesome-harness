1. 客户临时改需求，我不能只让模型回复一句；先确认 Grok Build 如何把会话、工具和交付接起来。
2. 这一章不猜作者意图，只沿着固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：crates/codegen/xai-grok-shell/src/session/acp_session_impl/run_loop.rs:120-183 · SessionActor 是事件驱动的长期存活 Actor；crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:355-449 · 工具执行明确拆成 prepare、并发 dispatch、post-flight。
4. 事实一：它不像一个简单 while 循环，更像一间控制室：用户输入、工具结果、文件变化、后台任务、模型切换都从不同通道进来，由同一个会话 Actor 排队处理。
5. 源码含义：这套 Harness 面向长会话、后台工作和 IDE/ACP 集成，控制面复杂度显著高于纯 CLI Agent。
6. 事实二：能并行的尽量并行，但两个工具若同时写同一个文件会排队，避免互相覆盖。
7. 数据流：事件 → SessionActor → prepare/dispatch → 权限或沙箱 → 结构化结果。
8. 小白动作：先把动作分成准备、执行、收尾三段，再给每段留一个失败出口。
9. 第二个动作：把安全边界写成只读约束、访问类型、隔离方式和降级策略。
10. 局限提醒：已审计 SessionActor select loop、turn 和 replay/command/event 通道。
11. 这一章的结论：这套 Harness 面向长会话、后台工作和 IDE/ACP 集成，控制面复杂度显著高于纯 CLI Agent。
12. 下一章继续沿着固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: e5fd4816d43260c15ba785f103990c1ed6cea230
