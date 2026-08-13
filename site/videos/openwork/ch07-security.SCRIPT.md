1. 同事把 iframe 当沙箱，我得用源码告诉他这不是一回事。
2. 这一章不讲概念，先看 OpenWork 怎样把问题变成可观察的工作流。
3. 固定版本证据：apps/server/src/mcp-app-sandbox.ts，画面只展示中性文件名和源码片段。
4. 真实源码锚点：apps/server/src/mcp-app-sandbox.ts · MAX_CSP_QUERY_BYTES|safeOrigin|default-src|sandbox。
5. 白话理解：const MAX_CSP_QUERY_BYTES = 8 * 1024; export type McpAppSandboxCsp = { connectDomains: string[]; resourceDomains: string[]; frameD。
6. 数据流：任务目标 → 会话状态 → security → 校验 → 结果交付。
7. 小白动作：先写一个目标，再记录每次状态变化，不要只看最终答案。
8. 第二个动作：把成功条件和拒绝条件各写一句。
9. 边界提醒：UI 边界不等于 OS 级沙箱，执行器仍要单独审计。
10. 看到回执、快照和限制条件，再决定是否交付。
11. CSP、origin、iframe 和执行器边界各管一层。
12. 下一章继续用固定源码回答一个具体工作问题。
