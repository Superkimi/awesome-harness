# Multica · M02 · 架构：有哪些层，谁负责什么

## Hook
要删一个 Runtime，却先撞上 active agent；这次看它的资源生命周期。

## Proof
- server/cmd/multica/cmd_agent.go · agentCmd|agentListCmd|agentCreateCmd
- server/pkg/composio/tools.go · ExecuteToolRequest|ConnectedAccountID|Version
- server/cmd/multica/cmd_runtime.go · cascade|active agents|unbind

## Lesson
先画清边界，再决定每一层的责任：把 Multica 想成机场调度台：Agent 是航班，Runtime 是跑道，Task 是航段，删除跑道前必须先处理仍在上面的航班。

## Limitation
控制面很强，但实际执行安全取决于 runtime 实现
