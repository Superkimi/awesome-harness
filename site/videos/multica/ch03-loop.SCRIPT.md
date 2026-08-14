1. 运营说一个 Agent 的任务量突然涨了，我先沿着 Runtime 活动看它跑到哪一步。
2. 这一章不背术语，先看 Multica 怎样把 Agent、Runtime 和 Task 放进同一张控制台。
3. 固定版本证据：server/cmd/multica/cmd_runtime.go，只展示源码片段和中性文件名。
4. 实现事实一：runRuntimeActivity|runRuntimeUsage|APIContext。
5. 实现事实二：unE: runRuntimeUsage, } var runtimeActivityCmd = &cobra.Command{ Use: "activity <runtime-id>", Short: "Get hourly task activity fo。
6. 数据流：目标 → Agent/Runtime 资源 → Task 活动 → 工具或状态 → 可查询结果。
7. 小白动作：先画三列 Agent、Runtime、Task，再把绑定关系写出来。
8. 第二个动作：删除或解绑前先列出 active agent 和 cascade 选择。
9. 边界提醒：控制面很强，但实际执行安全取决于 runtime 实现
10. 看到 activity、usage 和测试结果，再决定是否交付。
11. 任务不是一句 prompt，而是可以查询的活动和用量轨迹。
12. 下一章继续用固定提交回答一个真实工作问题。

Fixed commit: d467cc90691587ed00bdaca678475957df62dd3a
