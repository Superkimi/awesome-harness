# OpenWork · 技术分析总览

- Project: OpenWork (openwork)
- Fixed source commit: 51902a94b1d1a8ba4eb5eca01a25f6288d843efc
- Source repository: different-ai/openwork (dev)
- Episode kind: analysis
- Delivery: clean/no synthesized narration + independent SRT
- Source anchors:
  - packages/types/src/openwork-context.ts · openworkContextSnapshotSchema|execution|sidePanel
  - apps/server/src/routes/sessions.ts · registerSessionRoutes|createWorkspaceSession|buildSession
  - apps/server/src/plugins.ts · listPlugins|addPlugin|validatePluginSpec
  - apps/server/src/mcp-app-sandbox.ts · MAX_CSP_QUERY_BYTES|safeOrigin|default-src|sandbox
- Story hook: 老板让我把“会话、插件、审批”讲清楚，下午还要给客户演示。
