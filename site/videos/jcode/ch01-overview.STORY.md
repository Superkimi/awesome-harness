# M01 · 总览：先写盘，再开始一轮任务

## Hook
老板让我交付一条长任务，我先确认 JCode 为什么把 turn 先落盘再进入流式循环。

## Evidence anchors
- jcode-loop-001: crates/jcode-app-core/src/agent/turn_execution.rs:4-35 · 每个用户 turn 先写盘，再进入可恢复的流式循环
  - 模型还没开口，用户输入已经落账；即使后面 API 或工具出错，恢复时也不会连问题本身都丢掉。
- jcode-persist-001: crates/jcode-base/src/session/persistence.rs:307-395 · Session 用完整 snapshot 加 append-only JSONL journal
  - 平时只往流水账追加新变化，偶尔把整本账重抄成快照；这样频繁保存不会每次重写全部历史。

## Takeaway
耐崩溃性强，但每轮和工具结果频繁保存会增加本地 I/O，需要 journal 快路径配合。
