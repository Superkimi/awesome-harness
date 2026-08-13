# M06 · 读取：超大结果怎样在进模型前变短

- Project: Legacy Little Coder
- Fixed source commit: 0b7234031aabe56163e345792ce7a6ea05af321a
- Evidence ledger: data/legacy/evidence/little-coder/evidence.json
- Episode: ch06-context
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - .pi/extensions/read-guard/index.ts:4-27 · 超大 Read 结果在进入 LLM 前缩成 30 行
