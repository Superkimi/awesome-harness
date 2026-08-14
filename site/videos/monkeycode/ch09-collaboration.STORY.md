# M09 · 远程协作：owner gate 与历史回放

## Hook
同事远程接手任务，我先确认谁能写、谁能看历史、实时流怎样交接。

## Evidence anchors
- monkey-remote-001: backend/biz/task/handler/v1/task.go:323-384 · 远程协作以 owner write gate、历史回放和实时流为核心
  - 旁观者能看直播，任务主人才能按按钮和继续对话；掉线重连后还能从历史接上。
- monkey-subagent-001: backend/pkg/taskflow/types.go:626-640 · 平台层没有可见的子 Agent 调度与独立治理实体
  - 如果 Codex/OpenCode 内部自己再派子 Agent，MonkeyCode 目前只会把它们看成同一间 VM 里的同一项任务，无法逐个授权、暂停和计费。

## Takeaway
它实现了人—Agent 远程接管，而不是多 Agent 共享计划或黑板。
