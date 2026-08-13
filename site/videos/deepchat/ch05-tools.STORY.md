# M05 · 工具：Agent 的手脚怎样被注册

## Hook
新工具要接进来，但 builtin、MCP、plugin、shell 不能混成一个开关。

## Source proof
- src/shared/agentTools.ts · AGENT_TOOL_EXPOSURE|isUserConfigurableAgentTool

## Lesson
tool exposure 和 effect evidence 把来源与可配置性说清楚。
