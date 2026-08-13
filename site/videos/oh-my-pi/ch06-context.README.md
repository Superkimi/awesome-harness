# M06 · 上下文：四种压缩策略不是一张摘要

- Project: Legacy Oh My Pi
- Fixed source commit: a53e4e790d3939a08708bf0d3c912d0763237a2d
- Evidence ledger: data/legacy/evidence/oh-my-pi/evidence.json
- Episode: ch06-context
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/agent/src/compaction/compaction.ts:148-189 · 压缩不是单一摘要，而是 context-full/handoff/shake/snapcompact 多策略
  - packages/agent/src/compaction/compaction.ts:501-636 · 传统摘要保留近期原文、拆分超长 turn、迁移文件操作和旧 archive
  - packages/agent/src/compaction/pruning.ts:1-260 · 工具输出还有独立 prune/protection/shake 层
  - packages/coding-agent/src/memory-backend/resolve.ts:6-24 · 长期记忆有 off/local/Mnemopi/Hindsight 四种后端
