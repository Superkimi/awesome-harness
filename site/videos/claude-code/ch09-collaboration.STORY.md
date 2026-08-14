# M09 · 协作：子 Agent 的四种运行语义

## Hook
研究与实现要并行，我先拆 synchronous、async、fork、worktree 和 sidechain 恢复。

## Evidence anchors
- claude-code-agent-001: packages/builtin-tools/src/tools/AgentTool/loadAgentsDir.ts:58-132 · 子 Agent 是独立 query 运行时，可定制模型、工具、权限、MCP、hooks、skills、memory 和 isolation
  - 它不是把任务文本塞给同一个聊天窗口，而是给工人发单独的工具箱、说明书、权限卡和工作日志。
- claude-code-agent-002: packages/builtin-tools/src/tools/AgentTool/forkSubagent.ts:18-71 · 同步、异步、fork 与 worktree 是四个可组合的协作语义
  - 工人可以当场等结果，也能后台继续；可以只拿任务卡，也能复制父会话全部记忆；改代码时还能分配独立工位。
- claude-code-agent-003: packages/builtin-tools/src/tools/AgentTool/runAgent.ts:741-773 · 子 Agent 有 sidechain 持久化、可恢复元数据和严格资源清理
  - 后台工人有自己的工作日志，重启后能知道它是谁、在哪个工位；收工时也会回收插座、进程和临时账本。

## Takeaway
这是实质多 Agent Harness；复杂性主要在权限继承、资源清理、缓存和恢复，而非“能不能再调一次模型”。
