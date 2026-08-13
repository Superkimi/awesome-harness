# OpenWork · M02 · 架构：有哪些层，谁负责什么

- Project: OpenWork (openwork)
- Fixed source commit: 51902a94b1d1a8ba4eb5eca01a25f6288d843efc
- Source repository: different-ai/openwork (dev)
- Episode kind: ch02-architecture
- Delivery: clean/no synthesized narration + independent SRT
- Source anchors:
  - packages/types/src/openwork-context.ts · openworkContextSnapshotSchema|execution|sidePanel
  - apps/server/src/plugins.ts · listPlugins|addPlugin|validatePluginSpec
  - apps/server/src/mcp-app-sandbox.ts · MAX_CSP_QUERY_BYTES|safeOrigin|default-src|sandbox
- Story hook: 架构评审只剩十分钟，我得说清楚谁管会话、谁管插件、谁管边界。
