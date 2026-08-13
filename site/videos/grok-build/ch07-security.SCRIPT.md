1. 同事说 Always Approve 就够安全，我把只读约束、访问类型和 PreToolUse Hook 一起查。
2. 这一章不猜作者意图，只沿着固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:157-205 · Plan Mode 的只读约束独立于 Always Approve；crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:1035-1102 · 权限判断理解访问类型和会话上下文；crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:977-1034 · PreToolUse Hook 可在权限前阻断。
4. 事实一：“全部自动批准”也不等于“计划阶段可以乱改代码”。计划模式另有一把更早、更硬的锁。
5. 源码含义：工作流阶段约束不能依赖通用权限模式，否则高权限模式会破坏阶段不变量。
6. 事实二：它不是只看工具名，而是知道“这是读哪个路径、改哪个文件、跑什么命令、访问哪个网站”，自动模式还会参考最近几轮对话。
7. 数据流：事件 → SessionActor → prepare/dispatch → 权限或沙箱 → 结构化结果。
8. 小白动作：先把动作分成准备、执行、收尾三段，再给每段留一个失败出口。
9. 第二个动作：把安全边界写成只读约束、访问类型、隔离方式和降级策略。
10. 局限提醒：已审计 Ask/Auto/Always Approve、Plan gate、folder/plugin trust 与 hook deny。
11. 这一章的结论：工作流阶段约束不能依赖通用权限模式，否则高权限模式会破坏阶段不变量。
12. 下一章继续沿着固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: e5fd4816d43260c15ba785f103990c1ed6cea230
