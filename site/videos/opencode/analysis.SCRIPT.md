1. 评审问我：这个 Agent 怎么把持久化会话、工具、压缩、子 Agent 和回退都串起来？我不猜，直接按源码证据拆。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：packages/opencode/src/session/prompt.ts:1081-1130 · 主循环由持久化消息状态驱动，而不是一次性的 while(tool_call)；packages/opencode/src/session/processor.ts:315-413 · stream processor 把 reasoning、text、tool、usage、patch 全部事件化持久；packages/opencode/src/session/compaction.ts:28-35 · 压缩保留近期原文尾部，而不是只剩一段摘要。
4. 事实一：它每一轮都重新看账本决定“接下来做什么”，所以进程中断、工具异步完成和压缩都能落在统一状态机里。
5. 源码含义：消息/part 是事实源，loop 是其投影；这比仅在内存追加数组更利于恢复和多客户端。
6. 事实二：模型的思考、文字、每次工具起止和文件变化都不是终端里一闪而过，而是独立可回放的事件。
7. 数据流：用户消息 → session/processor → Provider 与工具事件 → compaction/permission → patch、回退和交付。
8. 小白动作：先给每一步记录状态，再区分成功、拒绝、超限和中断四种终态。
9. 第二个动作：改文件先看 diff，做高风险动作前让权限规则和 doom-loop 检查说清楚。
10. 局限提醒：已审计持久消息驱动 loop、任务选择、流事件处理、退出、重试和 cleanup。
11. 这一章的结论：消息/part 是事实源，loop 是其投影；这比仅在内存追加数组更利于恢复和多客户端。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cc4b45612974f735ddec46009ede07729511fba4
