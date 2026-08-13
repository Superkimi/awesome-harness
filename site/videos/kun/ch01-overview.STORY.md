# Kun · M01 · 总览：先知道它解决什么问题

## Hook
客户只给了一句话需求，我先看 Kun 如何把它变成可追踪工作流。

## Proof
- src/main/workflow-runtime.ts · class|run|workflow
- packages/extension-api/src/agent.ts · AgentCreateRunRequestSchema|AgentRunEventSchema
- src/shared/runtime-data-recovery.ts · Recovery|candidate|inventory

## Lesson
先证明一个真实工作结果，再追问它为什么能稳定完成：把 Kun 想成一张任务白板：每个节点都有输入、权限、状态和交付物，线条表示谁把结果交给谁。

## Limitation
桌面应用与运行时耦合度仍然较高
