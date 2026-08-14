1. 研究和实现要拆成两个节点，我先把 delegation 的结果交接画出来。
2. 这一章不背 API，先看 Kun 怎样把 Direct、Graph 和 runtime 变成可追踪的任务。
3. 固定版本证据：docs/workflow-loop.md，只展示源码片段和中性文件名。
4. 实现事实一：delegation|graph|subagent。
5. 实现事实二：# Loop 循环节点 —— 让 agent 自己转圈，而不是你按回车 > 适用于「创建loop / Workflows」里的 **Loop（循环）节点**。 > 实现在 [`src/main/workflow-runtime.ts`](../src/main。
6. 数据流：目标 → graph/runtime 节点 → 工具或 Agent → 权限/状态 → 交付物。
7. 小白动作：先画节点输入和输出，再补取消、审批和恢复三条边。
8. 第二个动作：给每个扩展声明 schema、能力和可见范围。
9. 边界提醒：桌面应用与运行时耦合度仍然较高
10. 看到 status、cancel 和 recovery 记录，再决定是否交付。
11. 图上的委派关系必须带状态、输入和交付物。
12. 下一章继续用固定提交回答一个真实工作问题。

Fixed commit: 1377249652cef30f9f7b777f8f6111fd6ac70fc9
