# M09 · 协作：Mailbox、checkpoint 与 Fleet worker

- Project: Legacy CodeWhale
- Fixed source commit: cfc2f2b13c070e900ee10dbeffb07028d3beaebd
- Evidence ledger: data/legacy/evidence/codewhale/evidence.json
- Episode: ch09-collaboration
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/tui/src/tools/subagent/mod.rs:1-11 · agent 是模型可见的创建面，coordination tools 复用同一 mailbox/checkpoint machinery
  - crates/tui/src/tools/subagent/mailbox.rs:1-92 · Mailbox 用单调序列、fanout、close-as-cancel 和结构化工作状态传递协作事实
  - crates/tui/src/tools/subagent/mod.rs:98-228 · 子 Agent 有 bounded resident context、步骤/时间/响应预算和持久 checkpoint
  - crates/tui/src/tools/subagent/worktree.rs:1-47 · 子 Agent 可在父 workspace 内运行，也可创建隔离 Git worktree
  - crates/tui/src/fleet/host.rs:1-5 · Fleet 把 worker host、运行状态、artifact 和控制面做成可观测协议
