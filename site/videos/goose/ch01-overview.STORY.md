# M01 · 总览：不是聊天框，是一条可回放的工作链

## Hook
同事把一个“帮我改完再交付”的任务丢过来，我先确认 Goose 到底替我接住了哪些环节。

## Evidence anchors
- goose-loop-001: crates/goose/src/agents/agent.rs:1930-2043 · 单一流式 Agent 循环驱动推理、工具和持久化
  - 它不是“模型回答一次就结束”，而是模型说一步、系统做一步、把结果再交回模型，直到满足结束条件。
- goose-session-001: crates/goose/src/session/session_manager.rs:45-96 · 会话、消息、成本与压缩指标落到 SQLite/WAL
  - 对话不只是屏幕上的临时文本：每条消息、用的模型、父子会话、花费和压缩前后 token 都能落盘追踪。

## Takeaway
Harness 的真正核心是状态机而不是提示词；重试、转向、停止钩子和上下文恢复都进入同一控制环。
