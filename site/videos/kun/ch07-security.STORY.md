# M07 · 安全：审批、权限和边界

## Hook
新 Agent 要联网，我先问清 permissionMatches 到底放行了什么。

## Source proof
- packages/extension-api/src/permissions.ts · STATIC_PERMISSIONS|permissionMatches|network

## Lesson
静态权限、匹配规则和 network 能力必须单独审计。
