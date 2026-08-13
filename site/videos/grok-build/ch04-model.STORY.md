# M04 · 工具：prepare、dispatch、post-flight 三段式

## Hook
模型一次发来多个动作，我先看 Grok Build 如何准备、并发执行，再做收尾。

## Evidence anchors
- grok-tools-001: crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:355-449 · 工具执行明确拆成 prepare、并发 dispatch、post-flight
  - 能并行的尽量并行，但两个工具若同时写同一个文件会排队，避免互相覆盖。
- grok-tools-002: crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:878-950 · 工具参数对模型瑕疵有恢复层
  - 模型偶尔把两个 JSON 粘在一起，Grok Build 会先抢救，不是一看到格式错就整轮失败。

## Takeaway
并发策略不是简单 all-at-once，而是带资源锁的调度。
