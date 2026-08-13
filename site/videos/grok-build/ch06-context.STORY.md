# M06 · 上下文：压缩不是删聊天记录

## Hook
长任务快超窗，我先看预热、两阶段压缩和恢复梯子如何保住任务状态。

## Evidence anchors
- grok-context-001: crates/codegen/xai-grok-shell/src/session/compaction.rs:3-35 · 压缩是一条带预热、两阶段和恢复梯子的子系统
  - 不是等窗口爆了才临时总结：它会提前准备摘要草稿，到红线时再完成第二遍；若摘要输入也太大，就逐级减料。
- grok-context-002: crates/codegen/xai-grok-shell/src/session/compaction.rs:1282-1460 · 压缩后重建的是“任务状态”，不是纯聊天摘要
  - 总结完以后还会把“哪些子任务在跑、待办是什么、插件有哪些、当前计划阶段”重新装回去，避免只剩一段模糊回忆。

## Takeaway
长任务连续性被当作独立可靠性系统，而非一个 prompt helper。
