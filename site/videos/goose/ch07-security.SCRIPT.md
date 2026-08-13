1. 同事说点了允许就安全，我把 inspector 顺序、权限模式和 shell 的真实边界一起查出来。
2. 这一章不猜作者意图，只沿着固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：crates/goose/src/agents/agent.rs:659-688 · 工具检查顺序体现“危险优先”；crates/goose/src/permission/permission_inspector.rs:159-268 · Auto、Approve、SmartApprove 是不同权限语义；crates/goose/src/agents/platform_extensions/developer/shell.rs:25-49 · 内置开发者工具没有强制工作区边界。
4. 事实一：先看是否像恶意命令和数据外传，再做额外对抗审查，然后才判断用户是否需要点批准，最后检查重复循环。
5. 源码含义：审批不是唯一防线；危险检测应在便利性策略之前执行。
6. 事实二：“智能批准”不是无条件执行：读文件一类操作可能自动过，写文件或判断不清的操作仍会问人。
7. 数据流：输入 → Agent/Session → Provider 或工具 → inspector/持久化 → 可回放结果。
8. 小白动作：先找到一个入口函数，再画出它调用的下一步和结束条件。
9. 第二个动作：把每个风险写成“证据、边界、回退”三列，不要只记一个功能名。
10. 局限提醒：已审计安全、外连、对抗、权限、重复五级 inspector 顺序。
11. 这一章的结论：审批不是唯一防线；危险检测应在便利性策略之前执行。
12. 下一章继续沿着固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 11deb564d09db782a17878af7cfafd299d9fa461
