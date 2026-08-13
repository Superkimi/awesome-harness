# M03 · 主循环：任务为什么会继续推进

## Hook
客户临时改需求，工作流节点不能从头乱跑，我先看 Kun 的 runtime loop。

## Source proof
- src/main/workflow-runtime.ts · class|run|workflow

## Lesson
节点状态、取消和恢复让任务图真正向前走。
