1. 周五长任务跑到一半，我最怕前面确认过的事实消失。
2. 这一章不讲概念，先看 OpenWork 怎样把问题变成可观察的工作流。
3. 固定版本证据：packages/types/src/openwork-context.ts，画面只展示中性文件名和源码片段。
4. 真实源码锚点：packages/types/src/openwork-context.ts · conversations|resources|availableAffordances。
5. 白话理解：CHEMA_VERSION), revision: z.number().int().nonnegative(), capturedAt: z.string(), screen: openworkScreenSchema, conversations: z.o。
6. 数据流：任务目标 → 会话状态 → context → 校验 → 结果交付。
7. 小白动作：先写一个目标，再记录每次状态变化，不要只看最终答案。
8. 第二个动作：把成功条件和拒绝条件各写一句。
9. 边界提醒：UI 边界不等于 OS 级沙箱，执行器仍要单独审计。
10. 看到回执、快照和限制条件，再决定是否交付。
11. 快照、资源和可用能力让上下文可恢复。
12. 下一章继续用固定源码回答一个具体工作问题。
