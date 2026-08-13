1. 同事说 Agent 的一次运行到底产出了什么，我先看 run request 和 event 怎样对上。
2. 这一章不背 API，先看 Kun 怎样把 Direct、Graph 和 runtime 变成可追踪的任务。
3. 固定版本证据：packages/extension-api/src/agent.ts，只展示源码片段和中性文件名。
4. 实现事实一：AgentCreateRunRequestSchema|AgentRunEventSchema。
5. 实现事实二：type AgentProfileDeclaration = z.infer<typeof AgentProfileDeclarationSchema> export type AgentProfileDeclarationInput = z.input<ty。
6. 数据流：目标 → graph/runtime 节点 → 工具或 Agent → 权限/状态 → 交付物。
7. 小白动作：先画节点输入和输出，再补取消、审批和恢复三条边。
8. 第二个动作：给每个扩展声明 schema、能力和可见范围。
9. 边界提醒：桌面应用与运行时耦合度仍然较高
10. 看到 status、cancel 和 recovery 记录，再决定是否交付。
11. 请求 schema 和运行事件 schema 让模型动作进入可追踪状态。
12. 下一章继续用固定提交回答一个真实工作问题。

Fixed commit: 1377249652cef30f9f7b777f8f6111fd6ac70fc9
