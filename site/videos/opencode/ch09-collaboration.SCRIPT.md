1. 研究与实现要并行，我先查 foreground、background、结果注回和递归取消。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：packages/opencode/src/agent/subagent-permissions.ts:4-26 · 子 Agent 是独立持久 session，可恢复、限深度并继承关键 deny；packages/opencode/src/tool/task.ts:24-62 · 子 Agent 支持 foreground/background、结果自动注回和递归取消。
4. 事实一：子任务有自己的聊天记录，不是父对话里的一段临时函数；父亲的禁区会传下去，默认也不能无限生孩子。
5. 源码含义：上下文隔离、恢复和权限边界都较完整。
6. 事实二：前台像打电话等对方答完，后台像发工单继续做别的；工单结束会主动回报，父任务取消时孩子也停。
7. 数据流：用户消息 → session/processor → Provider 与工具事件 → compaction/permission → patch、回退和交付。
8. 小白动作：先给每一步记录状态，再区分成功、拒绝、超限和中断四种终态。
9. 第二个动作：改文件先看 diff，做高风险动作前让权限规则和 doom-loop 检查说清楚。
10. 局限提醒：已审计 child session、depth、权限继承、resume、foreground/background 和递归取消。
11. 这一章的结论：上下文隔离、恢复和权限边界都较完整。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cc4b45612974f735ddec46009ede07729511fba4
