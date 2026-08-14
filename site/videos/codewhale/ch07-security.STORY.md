# M07 · 安全：三层 ExecPolicy 与一次性外层封顶

## Hook
有人要开 Fleet worker，我把 deny 优先、capability 收窄和 headless authority envelope 拆开。

## Evidence anchors
- codewhale-security-001: crates/execpolicy/src/lib.rs:10-32 · ExecPolicy 是 Builtin/Agent/User 三层规则，deny 优先且支持 arity-aware shell 判断
  - 用户自己的规则可以补充策略，但不能把更高优先级的拒绝抹掉；`cargo test` 和 `cargo test --config ...` 也不会被当成同一件事。
- codewhale-security-002: crates/tui/src/tools/execution_envelope.rs:1-59 · 子 Agent 的执行权限从真实 capability 和 input 分类出来，并且只能收窄
  - 即使未来加了一个新 MCP 或插件，只要它声明会写文件/跑代码/联网，就会自动落入相应门槛；子 Agent 不能通过自定义角色把权限变宽。
- codewhale-security-003: crates/tui/src/tools/spec.rs:150-218 · ToolAuthorityEnvelope 对 headless/Fleet worker 做一次性外层封顶
  - Fleet 启动子进程时把“最多能写哪些地方”作为机器参数传进去；子 Agent 内部可以再收紧，但不能把它改成全盘写。
- codewhale-sandbox-001: crates/tui/src/sandbox/policy.rs:17-87 · 默认 sandbox policy 是 workspace-write，但所有政策仍允许全盘读
  - 默认不是“只能看到项目”，而是“能看全盘但只能写项目和指定目录”；这对分析工具方便，对密钥读取风险更敏感。

## Takeaway
命令策略需要明确层级、优先级、链式命令和参数形态；只做字符串前缀 allowlist 很容易漏洞。
