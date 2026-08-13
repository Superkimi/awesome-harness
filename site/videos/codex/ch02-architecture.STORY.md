# M02 · 架构：turn、step 和上下文快照

## Hook
架构评审只剩十分钟，我得讲清一次 turn 如何让多个 step 看到不可漂移的世界。

## Evidence anchors
- codex-loop-001: codex-rs/core/src/session/turn.rs:153-274 · 每个 turn 由多个 step 组成，step 内共享一次不可漂移的上下文快照
  - 一轮任务可以问模型很多次，但每一次“想一想并行动”的小步都先拍一张现场快照，避免工具清单和提示词在同一步里前后不一致。
- codex-loop-003: codex-rs/core/src/session/turn.rs:1176-1273 · 重试预算属于 turn-scoped client session，窗口超限不当作普通网络错误重试
  - 同一轮尽量复用连接和粘性状态；行李箱塞不下不会盲目重拨网络，而是交给压缩逻辑处理。

## Takeaway
配置热更新只能在安全边界生效，换来 prompt cache 和工具调用的确定性。
