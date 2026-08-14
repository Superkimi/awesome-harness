# Multica · M01 · 总览：先知道它解决什么问题

## Hook
运营要查一个 Agent 的任务量，我先把控制台的资源关系摊开。

## Proof
- server/cmd/multica/cmd_runtime.go · runRuntimeActivity|runRuntimeUsage|APIContext
- server/cmd/multica/cmd_agent.go · agentTasksCmd|agentGetCmd
- apps/mobile/data/queries/agent-task-snapshot.ts · snapshot|task|agent

## Lesson
先证明一个真实工作结果，再追问它为什么能稳定完成：把 Multica 想成机场调度台：Agent 是航班，Runtime 是跑道，Task 是航段，删除跑道前必须先处理仍在上面的航班。

## Limitation
控制面很强，但实际执行安全取决于 runtime 实现
