# M08 · 扩展：MCP、Skill、插件如何接入

## Hook
团队要加 cronjob 和 MCP，我先看 agentTools 怎样把扩展放进统一目录。

## Source proof
- src/shared/agentTools.ts · cronjob|MCP|diagnostic

## Lesson
扩展能力要有 exposure、诊断和配置入口。
