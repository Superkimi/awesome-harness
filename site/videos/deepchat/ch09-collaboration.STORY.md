# M09 · 协作：子 Agent 与工作流

## Hook
研究、实现、复核要并行，我先看 subagent slots 怎么限制角色和并发。

## Source proof
- src/shared/lib/deepchatSubagents.ts · SLOT_LIMIT|explorer|implementer|reviewer

## Lesson
explorer、implementer、reviewer 角色和 slot limit 让协作可控。
