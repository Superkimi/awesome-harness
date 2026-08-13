1. 要让 Agent 改文件但不能越界，我先看内核沙箱、网络隔离和失败降级。
2. 这一章不猜作者意图，只沿着固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：crates/codegen/xai-grok-sandbox/src/lib.rs:8-18 · 提供真正的内核级文件系统沙箱；crates/codegen/xai-grok-sandbox/src/lib.rs:107-129 · 沙箱不支持或应用失败时会降级继续；crates/codegen/xai-grok-sandbox/src/lib.rs:8-18 · 子进程网络隔离与主进程网络分离。
4. 事实一：这不只是“执行前问一下”，操作系统内核会真的挡住不允许的文件访问。
5. 源码含义：在这 14 个项目里，Grok Build 的安全边界属于更强的系统级设计。
6. 事实二：配置了沙箱不等于一定锁住；系统不支持时默认是“报警后继续”，不是整个 Agent 拒绝启动。
7. 数据流：事件 → SessionActor → prepare/dispatch → 权限或沙箱 → 结构化结果。
8. 小白动作：先把动作分成准备、执行、收尾三段，再给每段留一个失败出口。
9. 第二个动作：把安全边界写成只读约束、访问类型、隔离方式和降级策略。
10. 局限提醒：已审计 nono/Landlock/Seatbelt、bwrap、seccomp 子进程网络与失效语义。
11. 这一章的结论：在这 14 个项目里，Grok Build 的安全边界属于更强的系统级设计。
12. 下一章继续沿着固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: e5fd4816d43260c15ba785f103990c1ed6cea230
