# M09 · 协作：Mailbox、checkpoint 与 Fleet worker

## Hook
研究和实现要并行，我先看 fanout、close-as-cancel、隔离 worktree 和 worker host 协议。

## Evidence anchors
- codewhale-collab-001: crates/tui/src/tools/subagent/mod.rs:1-11 · agent 是模型可见的创建面，coordination tools 复用同一 mailbox/checkpoint machinery
  - 子 Agent 不是一套旁路脚本：父子共享结构化协调协议，但子 Agent 默认不会继承主 Agent 的全权模式。
- codewhale-collab-002: crates/tui/src/tools/subagent/mailbox.rs:1-92 · Mailbox 用单调序列、fanout、close-as-cancel 和结构化工作状态传递协作事实
  - UI 卡片、父 Agent 和成本账本看到的是同一条有序消息流；子 Agent 被取消时，取消信号和“已取消”事件不会互相错位。
- codewhale-collab-003: crates/tui/src/tools/subagent/mod.rs:98-228 · 子 Agent 有 bounded resident context、步骤/时间/响应预算和持久 checkpoint
  - 子 Agent 可以长期跑，但不能无限带着整仓库文件和无限 transcript 常驻内存；它会把进度压到有界 checkpoint，重启后还能恢复。
- codewhale-collab-004: crates/tui/src/tools/subagent/worktree.rs:1-47 · 子 Agent 可在父 workspace 内运行，也可创建隔离 Git worktree
  - 不指定 worktree 时，子 Agent 只能在父项目里选一个存在的目录；需要并行改代码时，可以让系统创建独立分支和工作树。
- codewhale-collab-005: crates/tui/src/fleet/host.rs:1-5 · Fleet 把 worker host、运行状态、artifact 和控制面做成可观测协议
  - Fleet 不要求控制台知道 worker 是本机进程还是 SSH；它只消费统一的状态和 artifact 事件，状态页不会因为刷新而偷偷创建空 ledger。

## Takeaway
协作 API 应与 worker 生命周期共用数据结构，同时让安全 posture 在 child boundary 重新计算。
