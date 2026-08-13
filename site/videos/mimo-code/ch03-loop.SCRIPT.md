1. 评审问我插件任务为什么能连续推进，我先不讲模型，先看 Compose 的工作流。
2. 这一章不背术语，先看 MiMo-Code 怎样把内核、Compose 和插件能力分开。
3. 固定版本证据：docs/harness/Agent Multi-Skill Workflow Orchestration Design.md，只展示源码片段和中性文件名。
4. 实现事实一：workflow|orchestration|agent。
5. 实现事实二：ead the SKILL.md of every referenced skill FIRST, then plan (never plan from skill descriptions alone — the full SKILL.md may cont。
6. 数据流：目标 → microkernel/Compose 状态 → 工具或 Skill → permission/budget → 结果。
7. 小白动作：先写核心循环，再把插件能力接在边界上。
8. 第二个动作：给每个工具写清输入、handler、结果和权限。
9. 边界提醒：项目横跨 Rust/TypeScript/Bun/Nix，开发门槛高
10. 看到 reducer、budget 和测试证据，再决定是否交付。
11. 编排层把多个动作串成有边界的工作流。
12. 下一章继续用固定提交回答一个真实工作问题。

Fixed commit: 332d7b0db65ccbcdd31a67b897e80dd6f3671b9b
