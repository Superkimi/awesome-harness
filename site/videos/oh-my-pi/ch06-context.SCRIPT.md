1. 长任务快超窗，我先看 handoff、shake、snapcompact、prune 和长期记忆后端如何组合。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/agent/src/compaction/compaction.ts:148-189 · 压缩不是单一摘要，而是 context-full/handoff/shake/snapcompact 多策略；packages/agent/src/compaction/compaction.ts:501-636 · 传统摘要保留近期原文、拆分超长 turn、迁移文件操作和旧 archive；packages/agent/src/compaction/pruning.ts:1-260 · 工具输出还有独立 prune/protection/shake 层。
4. 事实一：可以选择传统摘要、交接文档、删除低价值块或 frame 化压缩；预算还会随模型窗口缩放。
5. 源码含义：策略实验空间很大，但同一会话跨模型/策略迁移要处理兼容性。
6. 事实二：远处历史压成结构化摘要，最近工作保留原文；一个回合过长就拆开。换模型时也不会把上一家模型才懂的压缩黑盒直接留下。
7. 数据流：用户消息 → Agent loop/Session → Provider/工具 → compaction/Task → 账本与观测。
8. 小白动作：先把长任务拆成主循环、上下文、工具、协作和观测五格。
9. 第二个动作：为并发、预算、审批和恢复都写一个可见的终态，不要只看“运行中”。
10. 局限提醒：已审计多策略压缩、prune/shake/snapcompact、handoff 和长期记忆后端。
11. 这一章的结论：策略实验空间很大，但同一会话跨模型/策略迁移要处理兼容性。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: a53e4e790d3939a08708bf0d3c912d0763237a2d
