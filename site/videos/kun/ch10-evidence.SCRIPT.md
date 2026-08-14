1. 评审问取消后会不会继续写文件，我用 coordinator 测试回答。
2. 这一章不背 API，先看 Kun 怎样把 Direct、Graph 和 runtime 变成可追踪的任务。
3. 固定版本证据：src/main/workflow-run-coordinator.test.ts，只展示源码片段和中性文件名。
4. 实现事实一：cancellation|approval|status。
5. 实现事实二：s.workflow_1.node_1).toBe('success') vi.advanceTimersByTime(100) expect(coordinator.status(false).nodeStatus.workflow_1).toBeUndef。
6. 数据流：目标 → graph/runtime 节点 → 工具或 Agent → 权限/状态 → 交付物。
7. 小白动作：先画节点输入和输出，再补取消、审批和恢复三条边。
8. 第二个动作：给每个扩展声明 schema、能力和可见范围。
9. 边界提醒：桌面应用与运行时耦合度仍然较高
10. 看到 status、cancel 和 recovery 记录，再决定是否交付。
11. 取消、审批和状态测试是工作流可靠性的证据。
12. 下一章继续用固定提交回答一个真实工作问题。

Fixed commit: 1377249652cef30f9f7b777f8f6111fd6ac70fc9
