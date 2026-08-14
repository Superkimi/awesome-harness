1. 一个任务要拆给几个 Agent，我先看控制台如何列出任务和交接关系。
2. 这一章不背术语，先看 Multica 怎样把 Agent、Runtime 和 Task 放进同一张控制台。
3. 固定版本证据：server/cmd/multica/cmd_agent.go，只展示源码片段和中性文件名。
4. 实现事实一：tasks|agent。
5. 实现事实二：reCmd = &cobra.Command{ Use: "restore <id>", Short: "Restore an archived agent", Args: exactArgs(1), RunE: runAgentRestore, } var 。
6. 数据流：目标 → Agent/Runtime 资源 → Task 活动 → 工具或状态 → 可查询结果。
7. 小白动作：先画三列 Agent、Runtime、Task，再把绑定关系写出来。
8. 第二个动作：删除或解绑前先列出 active agent 和 cascade 选择。
9. 边界提醒：控制面很强，但实际执行安全取决于 runtime 实现
10. 看到 activity、usage 和测试结果，再决定是否交付。
11. 协作要围绕 Agent、Task 和 Runtime 的绑定关系来设计。
12. 下一章继续用固定提交回答一个真实工作问题。

Fixed commit: d467cc90691587ed00bdaca678475957df62dd3a
