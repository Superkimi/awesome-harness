1. 老板让我接一个新插件，但不准把权限一起放开。
2. 这一章不讲概念，先看 OpenWork 怎样把问题变成可观察的工作流。
3. 固定版本证据：apps/server/src/plugins.ts，画面只展示中性文件名和源码片段。
4. 真实源码锚点：apps/server/src/plugins.ts · listPlugins|addPlugin|validatePluginSpec。
5. 白话理解：ir.project" : "dir.global", scope, path: relativePath, }); } return items; } export async function listPlugins(serverConfig: Serve。
6. 数据流：任务目标 → 会话状态 → tools → 校验 → 结果交付。
7. 小白动作：先写一个目标，再记录每次状态变化，不要只看最终答案。
8. 第二个动作：把成功条件和拒绝条件各写一句。
9. 边界提醒：UI 边界不等于 OS 级沙箱，执行器仍要单独审计。
10. 看到回执、快照和限制条件，再决定是否交付。
11. 工具注册、参数、执行和回执必须分开检查。
12. 下一章继续用固定源码回答一个具体工作问题。
