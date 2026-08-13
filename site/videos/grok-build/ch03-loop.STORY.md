# M03 · 主循环：长期存活的 SessionActor

## Hook
同事说任务跑久了会丢状态，我沿着 SessionActor 的事件循环看它怎样保持在线。

## Evidence anchors
- grok-loop-001: crates/codegen/xai-grok-shell/src/session/acp_session_impl/run_loop.rs:120-183 · SessionActor 是事件驱动的长期存活 Actor
  - 它不像一个简单 while 循环，更像一间控制室：用户输入、工具结果、文件变化、后台任务、模型切换都从不同通道进来，由同一个会话 Actor 排队处理。

## Takeaway
这套 Harness 面向长会话、后台工作和 IDE/ACP 集成，控制面复杂度显著高于纯 CLI Agent。
