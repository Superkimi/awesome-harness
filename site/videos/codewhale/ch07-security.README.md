# M07 · 安全：三层 ExecPolicy 与一次性外层封顶

- Project: Legacy CodeWhale
- Fixed source commit: cfc2f2b13c070e900ee10dbeffb07028d3beaebd
- Evidence ledger: data/legacy/evidence/codewhale/evidence.json
- Episode: ch07-security
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/execpolicy/src/lib.rs:10-32 · ExecPolicy 是 Builtin/Agent/User 三层规则，deny 优先且支持 arity-aware shell 判断
  - crates/tui/src/tools/execution_envelope.rs:1-59 · 子 Agent 的执行权限从真实 capability 和 input 分类出来，并且只能收窄
  - crates/tui/src/tools/spec.rs:150-218 · ToolAuthorityEnvelope 对 headless/Fleet worker 做一次性外层封顶
  - crates/tui/src/sandbox/policy.rs:17-87 · 默认 sandbox policy 是 workspace-write，但所有政策仍允许全盘读
