1. 长任务快超窗，我先看 50% 压缩、反向预算和 ContextManager 的压力屏障。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：packages/core/src/context/chatCompressionService.ts:37-52 · Legacy 压缩默认在 50% 窗口触发，并保留最近约 30%；packages/core/src/context/chatCompressionService.ts:124-142 · 旧工具输出采用反向预算，超额内容落临时文件并只留尾部；packages/core/src/core/client.ts:107-120 · 摘要膨胀会触发熔断，随后只做内容截断。
4. 事实一：箱子装到一半就提前整理，最近三成原文留下，旧七成写成摘要；切口只选完整对话边界。
5. 源码含义：为长回复和工具调用预留较大余量，代价是较早产生摘要成本。
6. 事实二：最新日志全文留在桌面，旧日志搬进档案室，只在上下文里留末尾和取件地址。
7. 数据流：用户消息 → sendMessageStream → Context/Policy → Scheduler/AgentProtocol → JSONL checkpoint。
8. 小白动作：先把长任务拆成循环、上下文、策略、工具和回放五格。
9. 第二个动作：为超限、取消、拒绝和重试分别写终态，不要只看“执行成功”。
10. 局限提醒：legacy compression 与 graph/pipeline context-management 两条路径。
11. 这一章的结论：为长回复和工具调用预留较大余量，代价是较早产生摘要成本。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 1ac3377395868295e128b96726d605a900b5946b
