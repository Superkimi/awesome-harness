# M04 · 模型与消息：流式结果如何进入状态

## Hook
同事问模型输出到底挂在哪个 Agent 上，我先从任务和 Agent 的查询关系看起。

## Source proof
- server/cmd/multica/cmd_agent.go · agentTasksCmd|agentGetCmd

## Lesson
模型结果要落在可查询的 Agent、Task 和 Runtime 资源里。
