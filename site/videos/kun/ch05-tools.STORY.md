# M05 · 工具：Agent 的手脚怎样被注册

## Hook
要加一个工具，但输入和结果不能靠 Agent 自己猜。

## Source proof
- packages/extension-api/src/tools.ts · ToolInvocationSchema|ToolResultSchema

## Lesson
ToolInvocation 和 ToolResult 契约把执行前后锁在一起。
