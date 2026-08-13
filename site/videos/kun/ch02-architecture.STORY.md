# Kun · M02 · 架构：有哪些层，谁负责什么

## Hook
工作流节点一多就容易失控，我用一张图看它怎么传状态和取消。

## Proof
- docs/workflow-loop.md · workflow|node|runtime
- packages/extension-api/src/tools.ts · ToolInvocationSchema|ToolResultSchema
- packages/extension-api/src/permissions.ts · STATIC_PERMISSIONS|permissionMatches|network

## Lesson
先画清边界，再决定每一层的责任：把 Kun 想成一张任务白板：每个节点都有输入、权限、状态和交付物，线条表示谁把结果交给谁。

## Limitation
桌面应用与运行时耦合度仍然较高
