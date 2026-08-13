# M05 · 工具：Agent 的手脚怎样被注册

## Hook
老板让我接一个外部工具，但连接账户和工具版本不能靠口头约定。

## Source proof
- server/pkg/composio/tools.go · ExecuteToolRequest|ConnectedAccountID|Version

## Lesson
ExecuteToolRequest 把工具、连接账户和版本显式传给执行层。
