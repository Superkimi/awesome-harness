# M04 · 模型与消息：流式结果如何进入状态

## Hook
同事说工具回执和模型消息混在一起，我先看插件上下文如何接住它们。

## Source proof
- packages/plugin/src/tool.ts · ToolContext|ToolDefinition|function tool

## Lesson
ToolContext 和 ToolDefinition 让消息、参数和执行边界有位置可放。
