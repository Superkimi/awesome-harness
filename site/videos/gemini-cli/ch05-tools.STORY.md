# M05 · 工具：Scheduler 让模型流和执行解耦

## Hook
工具结果很大又可能被取消，我先看 event-driven Scheduler 如何落盘并返回合法响应。

## Evidence anchors
- gemini-tools-001: packages/core/src/core/turn.ts:236-320 · Turn 只解析模型流，工具执行交给独立 event-driven Scheduler
  - 模型流负责开任务单，调度器负责审批、排队、执行和回执；两者不是揉在一个 switch 里。
- gemini-tools-002: packages/core/src/scheduler/tool-executor.ts:250-297 · 超大工具结果在调度阶段落盘，取消也返回合法 functionResponse
  - 工具被叫停也必须交一张正式回执；已经产生的大输出不会硬塞回上下文。

## Takeaway
主 Agent 和子 Agent 能复用同一工具治理链，同时各自限定工具集。
