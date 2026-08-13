# M06 · 上下文：长任务怎样不丢重点

## Hook
周报要查一个任务快照，我想知道移动端看到的状态从哪里来。

## Source proof
- apps/mobile/data/queries/agent-task-snapshot.ts · snapshot|task|agent

## Lesson
snapshot 把 agent、task 和当前结果整理成可消费的上下文。
