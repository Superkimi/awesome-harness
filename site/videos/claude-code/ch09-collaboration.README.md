# M09 · 协作：子 Agent 的四种运行语义

- Project: Legacy Claude Code (reconstruction)
- Fixed source commit: 3bb6b5746238c418138eb96d57765d79012edd96
- Evidence ledger: data/legacy/evidence/claude-code/evidence.json
- Episode: ch09-collaboration
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/builtin-tools/src/tools/AgentTool/loadAgentsDir.ts:58-132 · 子 Agent 是独立 query 运行时，可定制模型、工具、权限、MCP、hooks、skills、memory 和 isolation
  - packages/builtin-tools/src/tools/AgentTool/forkSubagent.ts:18-71 · 同步、异步、fork 与 worktree 是四个可组合的协作语义
  - packages/builtin-tools/src/tools/AgentTool/runAgent.ts:741-773 · 子 Agent 有 sidechain 持久化、可恢复元数据和严格资源清理
