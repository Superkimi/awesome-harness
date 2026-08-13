1. 团队想让 Agent 多一个 Skill，我先确认技能清单和安装动作是不是同一套资源模型。
2. 这一章不背术语，先看 Multica 怎样把 Agent、Runtime 和 Task 放进同一张控制台。
3. 固定版本证据：server/cmd/multica/cmd_agent.go，只展示源码片段和中性文件名。
4. 实现事实一：agentSkillsCmd|skills。
5. 实现事实二：vatarCmd = &cobra.Command{ Use: "avatar <id>", Short: "Upload an avatar image for an agent", Args: exactArgs(1), RunE: runAgentAva。
6. 数据流：目标 → Agent/Runtime 资源 → Task 活动 → 工具或状态 → 可查询结果。
7. 小白动作：先画三列 Agent、Runtime、Task，再把绑定关系写出来。
8. 第二个动作：删除或解绑前先列出 active agent 和 cascade 选择。
9. 边界提醒：控制面很强，但实际执行安全取决于 runtime 实现
10. 看到 activity、usage 和测试结果，再决定是否交付。
11. Skill 不是隐藏配置，而是能列出、查询和交付的能力资源。
12. 下一章继续用固定提交回答一个真实工作问题。

Fixed commit: d467cc90691587ed00bdaca678475957df62dd3a
