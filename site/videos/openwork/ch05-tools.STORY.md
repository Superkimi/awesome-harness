# M05 · 工具：Agent 的手脚怎样被注册

## Hook
老板让我接一个新插件，但不准把权限一起放开。

## Evidence
- apps/server/src/plugins.ts · listPlugins|addPlugin|validatePluginSpec

## Lesson
工具注册、参数、执行和回执必须分开检查。
