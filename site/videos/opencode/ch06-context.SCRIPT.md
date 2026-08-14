1. 大仓库快超窗，我先看 overflow、近期原文、媒体剥离和工具输出 prune。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：packages/opencode/src/session/overflow.ts:8-33 · overflow 阈值为可用输入窗口，而非模型总窗口；packages/opencode/src/session/compaction.ts:28-35 · 压缩保留近期原文尾部，而不是只剩一段摘要；packages/opencode/src/session/compaction.ts:289-354 · 摘要前先去媒体、限制工具输出，失败时可 replay 原请求。
4. 事实一：它会先给模型回答预留座位，再判断历史是否坐满，避免输入刚好塞满后没有空间输出。
5. 源码含义：比简单按 context×百分比更贴合各 provider 的 input/output 限制。
6. 事实二：老故事写成摘要，最近几轮尽量保留原话；必要时甚至保留半个超长回合。
7. 数据流：用户消息 → session/processor → Provider 与工具事件 → compaction/permission → patch、回退和交付。
8. 小白动作：先给每一步记录状态，再区分成功、拒绝、超限和中断四种终态。
9. 第二个动作：改文件先看 diff，做高风险动作前让权限规则和 doom-loop 检查说清楚。
10. 局限提醒：已审计 overflow、摘要、近期尾部保留、工具输出裁剪、overflow replay 和自动续跑。
11. 这一章的结论：比简单按 context×百分比更贴合各 provider 的 input/output 限制。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cc4b45612974f735ddec46009ede07729511fba4
