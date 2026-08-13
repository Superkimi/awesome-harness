# Multica · 技术分析总览

## Hook
运营说有个 Agent 要下线，但它还绑着三条正在跑的任务。

## Proof
- server/cmd/multica/cmd_agent.go · agentCmd|agentListCmd|agentCreateCmd
- server/cmd/multica/cmd_runtime.go · runRuntimeActivity|runRuntimeUsage|APIContext
- server/pkg/composio/tools.go · ExecuteToolRequest|ConnectedAccountID|Version
- server/cmd/multica/cmd_runtime.go · cascade|active agents|unbind

## Lesson
把 Multica 想成机场调度台：Agent 是航班，Runtime 是跑道，Task 是航段，删除跑道前必须先处理仍在上面的航班。

## Limitation
控制面很强，但实际执行安全取决于 runtime 实现
