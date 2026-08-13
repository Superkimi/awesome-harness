1. 模型一次发来多个动作，我先看 Grok Build 如何准备、并发执行，再做收尾。
2. 这一章不猜作者意图，只沿着固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:355-449 · 工具执行明确拆成 prepare、并发 dispatch、post-flight；crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:878-950 · 工具参数对模型瑕疵有恢复层。
4. 事实一：能并行的尽量并行，但两个工具若同时写同一个文件会排队，避免互相覆盖。
5. 源码含义：并发策略不是简单 all-at-once，而是带资源锁的调度。
6. 事实二：模型偶尔把两个 JSON 粘在一起，Grok Build 会先抢救，不是一看到格式错就整轮失败。
7. 数据流：事件 → SessionActor → prepare/dispatch → 权限或沙箱 → 结构化结果。
8. 小白动作：先把动作分成准备、执行、收尾三段，再给每段留一个失败出口。
9. 第二个动作：把安全边界写成只读约束、访问类型、隔离方式和降级策略。
10. 局限提醒：已审计 preflight、权限、并发、同文件锁、postflight。
11. 这一章的结论：并发策略不是简单 all-at-once，而是带资源锁的调度。
12. 下一章继续沿着固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: e5fd4816d43260c15ba785f103990c1ed6cea230
