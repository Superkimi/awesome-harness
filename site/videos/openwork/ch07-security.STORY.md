# M07 · 安全：审批、权限和边界

## Hook
同事把 iframe 当沙箱，我得用源码告诉他这不是一回事。

## Evidence
- apps/server/src/mcp-app-sandbox.ts · MAX_CSP_QUERY_BYTES|safeOrigin|default-src|sandbox

## Lesson
CSP、origin、iframe 和执行器边界各管一层。
