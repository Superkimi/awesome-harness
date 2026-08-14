# OpenWork · M01 · 总览：先知道它解决什么问题

## Hook
老板问我：这个工作台到底替谁省了时间？我先从一次会话开始。

## Proof
- apps/server/src/routes/sessions.ts · registerSessionRoutes|createWorkspaceSession|buildSession
- apps/server/src/routes/sessions.ts · opencode|message|session
- packages/types/src/openwork-context.ts · conversations|resources|availableAffordances

## Lesson
先证明一个真实工作结果，再追问它为什么能稳定完成：把 OpenWork 想成一张控制台：左边是会话，右边是 MCP App，底层还有一个负责记录游标和重载原因的服务。

## Limitation
主执行器依赖 OpenCode，不能把 UI 边界误认为 OS 级沙箱
