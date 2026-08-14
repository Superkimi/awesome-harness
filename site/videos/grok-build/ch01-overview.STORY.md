# M01 · 总览：一个会持续工作的安全执行器

## Hook
客户临时改需求，我不能只让模型回复一句；先确认 Grok Build 如何把会话、工具和交付接起来。

## Evidence anchors
- grok-loop-001: crates/codegen/xai-grok-shell/src/session/acp_session_impl/run_loop.rs:120-183 · SessionActor 是事件驱动的长期存活 Actor
  - 它不像一个简单 while 循环，更像一间控制室：用户输入、工具结果、文件变化、后台任务、模型切换都从不同通道进来，由同一个会话 Actor 排队处理。
- grok-tools-001: crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:355-449 · 工具执行明确拆成 prepare、并发 dispatch、post-flight
  - 能并行的尽量并行，但两个工具若同时写同一个文件会排队，避免互相覆盖。

## Takeaway
这套 Harness 面向长会话、后台工作和 IDE/ACP 集成，控制面复杂度显著高于纯 CLI Agent。
