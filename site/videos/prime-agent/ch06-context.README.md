# M06 · 上下文：16384 预算、20000 尾部与 checkpoint

- Project: Legacy Prime Agent
- Fixed source commit: 7787f07415d843b9a800f6a4720e0c739bd608e5
- Evidence ledger: data/legacy/evidence/prime-agent/evidence.json
- Episode: ch06-context
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/coding-agent/src/core/compaction/compaction.ts:122-132 · 默认压缩预留 16384 token，尾部保留 20000 token
  - packages/coding-agent/src/core/compaction/compaction.ts:138-147 · Token 估算融合 provider usage 与 trailing message 估算
  - packages/coding-agent/src/core/compaction/compaction.ts:303-339 · Cut point 避开孤立 tool result，保留完整 tool turn
  - packages/coding-agent/src/core/compaction/compaction.ts:465-496 · 摘要提示词固定为可恢复的结构化 checkpoint
