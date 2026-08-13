# OpenWork · M02 · 架构：有哪些层，谁负责什么

## Hook
架构评审只剩十分钟，我得说清楚谁管会话、谁管插件、谁管边界。

## Proof
- packages/types/src/openwork-context.ts · openworkContextSnapshotSchema|execution|sidePanel
- apps/server/src/plugins.ts · listPlugins|addPlugin|validatePluginSpec
- apps/server/src/mcp-app-sandbox.ts · MAX_CSP_QUERY_BYTES|safeOrigin|default-src|sandbox

## Lesson
先画清边界，再决定每一层的责任：把 OpenWork 想成一张控制台：左边是会话，右边是 MCP App，底层还有一个负责记录游标和重载原因的服务。

## Limitation
主执行器依赖 OpenCode，不能把 UI 边界误认为 OS 级沙箱
