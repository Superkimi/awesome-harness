# M06 · 上下文：压缩不是删聊天记录

- Project: Legacy Grok Build
- Fixed source commit: e5fd4816d43260c15ba785f103990c1ed6cea230
- Evidence ledger: data/legacy/evidence/grok-build/evidence.json
- Episode: ch06-context
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/codegen/xai-grok-shell/src/session/compaction.rs:3-35 · 压缩是一条带预热、两阶段和恢复梯子的子系统
  - crates/codegen/xai-grok-shell/src/session/compaction.rs:1282-1460 · 压缩后重建的是“任务状态”，不是纯聊天摘要
