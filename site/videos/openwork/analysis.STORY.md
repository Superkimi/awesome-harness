# OpenWork · 技术分析总览

## Hook
老板让我把“会话、插件、审批”讲清楚，下午还要给客户演示。

## Proof
- packages/types/src/openwork-context.ts · openworkContextSnapshotSchema|execution|sidePanel
- apps/server/src/routes/sessions.ts · registerSessionRoutes|createWorkspaceSession|buildSession
- apps/server/src/plugins.ts · listPlugins|addPlugin|validatePluginSpec
- apps/server/src/mcp-app-sandbox.ts · MAX_CSP_QUERY_BYTES|safeOrigin|default-src|sandbox

## Lesson
把 OpenWork 想成一张控制台：左边是会话，右边是 MCP App，底层还有一个负责记录游标和重载原因的服务。

## Limitation
主执行器依赖 OpenCode，不能把 UI 边界误认为 OS 级沙箱
