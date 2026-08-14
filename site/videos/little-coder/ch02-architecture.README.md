# M02 · 架构：入口、扩展和运行时怎么分工

- Project: Legacy Little Coder
- Fixed source commit: 0b7234031aabe56163e345792ce7a6ea05af321a
- Evidence ledger: data/legacy/evidence/little-coder/evidence.json
- Episode: ch02-architecture
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - package.json:33-43 · 它是 pi 的 Harness 增强层，而不是另一套 Agent 内核
  - bin/little-coder.mjs:157-217 · 扩展来源分层，默认固定集合，pi 生态桥显式 opt-in
