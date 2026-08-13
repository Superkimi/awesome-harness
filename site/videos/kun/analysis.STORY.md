# Kun · 技术分析总览

## Hook
客户临时改需求，我得解释为什么任务图比“多喊几个模型”更稳。

## Proof
- docs/workflow-loop.md · workflow|node|runtime
- src/main/workflow-runtime.ts · class|run|workflow
- packages/extension-api/src/tools.ts · ToolInvocationSchema|ToolResultSchema
- packages/extension-api/src/permissions.ts · STATIC_PERMISSIONS|permissionMatches|network

## Lesson
把 Kun 想成一张任务白板：每个节点都有输入、权限、状态和交付物，线条表示谁把结果交给谁。

## Limitation
桌面应用与运行时耦合度仍然较高
