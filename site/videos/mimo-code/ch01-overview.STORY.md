# MiMo-Code · M01 · 总览：先知道它解决什么问题

## Hook
同事要我解释这个 Coding Agent，不许只说“它很智能”。

## Proof
- docs/harness/Agent Multi-Skill Workflow Orchestration Design.md · workflow|orchestration|agent
- packages/plugin/src/tool.ts · ToolContext|ToolDefinition|function tool
- docs/compose/spec/context-budget-control.md · budget|context|token

## Lesson
先证明一个真实工作结果，再追问它为什么能稳定完成：把 MiMo-Code 想成一台可换插槽的机器：微内核负责转动，Compose 是控制面，插件和 Skill 是可替换的刀头。

## Limitation
项目横跨 Rust/TypeScript/Bun/Nix，开发门槛高
