# M05 · 工具：Agent 的手脚怎样被注册

## Hook
团队要加一个工具，但我不想让 handler 绕过统一注册入口。

## Source proof
- packages/plugin/src/tool.ts · Tool|handler|register

## Lesson
工具注册、handler 和结果回传是一个可检查的契约。
