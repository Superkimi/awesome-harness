1. 有人要开 Fleet worker，我把 deny 优先、capability 收窄和 headless authority envelope 拆开。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：crates/execpolicy/src/lib.rs:10-32 · ExecPolicy 是 Builtin/Agent/User 三层规则，deny 优先且支持 arity-aware shell 判断；crates/tui/src/tools/execution_envelope.rs:1-59 · 子 Agent 的执行权限从真实 capability 和 input 分类出来，并且只能收窄；crates/tui/src/tools/spec.rs:150-218 · ToolAuthorityEnvelope 对 headless/Fleet worker 做一次性外层封顶。
4. 事实一：用户自己的规则可以补充策略，但不能把更高优先级的拒绝抹掉；`cargo test` 和 `cargo test --config ...` 也不会被当成同一件事。
5. 源码含义：命令策略需要明确层级、优先级、链式命令和参数形态；只做字符串前缀 allowlist 很容易漏洞。
6. 事实二：即使未来加了一个新 MCP 或插件，只要它声明会写文件/跑代码/联网，就会自动落入相应门槛；子 Agent 不能通过自定义角色把权限变宽。
7. 数据流：Core/EngineConfig → turn freeze → ToolSpec/MCP → policy/sandbox → session/checkpoint/receipt。
8. 小白动作：先把任务拆成能力、预算、审批、执行和证据五格。
9. 第二个动作：为并行、心跳、取消、恢复和用量归属各留一个明确状态。
10. 局限提醒：ExecPolicy 分层规则、ExecutionEnvelope 能力分类、子进程 authority envelope 与路径边界。
11. 这一章的结论：命令策略需要明确层级、优先级、链式命令和参数形态；只做字符串前缀 allowlist 很容易漏洞。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cfc2f2b13c070e900ee10dbeffb07028d3beaebd
