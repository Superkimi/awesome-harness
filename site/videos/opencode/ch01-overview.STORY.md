# M01 · 总览：任务状态驱动的 Agent 工作台

## Hook
老板让我把一次复杂改动交付出去，我先确认 OpenCode 为什么不是一次性的工具循环。

## Evidence anchors
- opencode-loop-001: packages/opencode/src/session/prompt.ts:1081-1130 · 主循环由持久化消息状态驱动，而不是一次性的 while(tool_call)
  - 它每一轮都重新看账本决定“接下来做什么”，所以进程中断、工具异步完成和压缩都能落在统一状态机里。
- opencode-loop-002: packages/opencode/src/session/prompt.ts:1170-1241 · 每一步动态重建 Agent、工具、系统上下文和模型请求
  - 不是开会前一次性发完所有资料；每走一步都按当前身份、模型和权限重新整理桌面。

## Takeaway
消息/part 是事实源，loop 是其投影；这比仅在内存追加数组更利于恢复和多客户端。
