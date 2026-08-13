1. 评审问“改坏了能不能回来”，我用 session ledger、shadow Git、revert 和显式 share 回答。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：packages/opencode/src/session/session.ts:120-158 · session 持久化 agent/model/permission/cost/tokens/summary/revert 与 parent；packages/opencode/src/session/processor.ts:98-114 · 每个模型 step 前后用影子 Git 仓库生成可回退 patch；packages/opencode/src/share/share-next.ts:23-72 · Share 是显式远程同步会话、消息、parts、diff 和模型。
4. 事实一：一条任务不只存聊天文本，还存它用了哪个 Agent/模型、花了多少钱、改了哪些文件、能否回退以及是谁的子任务。
5. 源码含义：为恢复、审计、成本和协作提供统一数据底座。
6. 事实二：每走一步都拍“修改前后”照片，照片存进旁边的 Git 仓库，不污染用户当前分支。
7. 数据流：用户消息 → session/processor → Provider 与工具事件 → compaction/permission → patch、回退和交付。
8. 小白动作：先给每一步记录状态，再区分成功、拒绝、超限和中断四种终态。
9. 第二个动作：改文件先看 diff，做高风险动作前让权限规则和 doom-loop 检查说清楚。
10. 局限提醒：消息/part/event、成本/token、git snapshot/patch、fork/revert、可选 OTEL 与 share sync。
11. 这一章的结论：为恢复、审计、成本和协作提供统一数据底座。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cc4b45612974f735ddec46009ede07729511fba4
