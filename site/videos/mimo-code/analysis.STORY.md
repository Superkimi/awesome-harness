# MiMo-Code · 技术分析总览

## Hook
评审会上有人问：这个 Coding Agent 加插件，会不会把内核搞乱？

## Proof
- docs/architecture/codex-microkernel-runtime.md · microkernel|runtime|kernel
- docs/harness/Agent Multi-Skill Workflow Orchestration Design.md · workflow|orchestration|agent
- packages/plugin/src/tool.ts · Tool|handler|register
- packages/app/src/context/permission.tsx · permission|auto|grant

## Lesson
把 MiMo-Code 想成一台可换插槽的机器：微内核负责转动，Compose 是控制面，插件和 Skill 是可替换的刀头。

## Limitation
项目横跨 Rust/TypeScript/Bun/Nix，开发门槛高
