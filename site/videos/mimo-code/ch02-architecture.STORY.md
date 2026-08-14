# MiMo-Code · M02 · 架构：有哪些层，谁负责什么

## Hook
插件越接越多，评审担心内核变成一团；我只讲它的边界。

## Proof
- docs/architecture/codex-microkernel-runtime.md · microkernel|runtime|kernel
- packages/plugin/src/tool.ts · Tool|handler|register
- packages/app/src/context/permission.tsx · permission|auto|grant

## Lesson
先画清边界，再决定每一层的责任：把 MiMo-Code 想成一台可换插槽的机器：微内核负责转动，Compose 是控制面，插件和 Skill 是可替换的刀头。

## Limitation
项目横跨 Rust/TypeScript/Bun/Nix，开发门槛高
