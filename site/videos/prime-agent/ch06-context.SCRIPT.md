1. 长任务快超窗，我先看 token 预算、完整 tool turn 和可恢复摘要怎样组合。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/coding-agent/src/core/compaction/compaction.ts:122-132 · 默认压缩预留 16384 token，尾部保留 20000 token；packages/coding-agent/src/core/compaction/compaction.ts:138-147 · Token 估算融合 provider usage 与 trailing message 估算；packages/coding-agent/src/core/compaction/compaction.ts:303-339 · Cut point 避开孤立 tool result，保留完整 tool turn。
4. 事实一：它不会等到 provider 报 context overflow 才处理，而是提前留出一块回答空间，再保留最近工作集。
5. 源码含义：自研应把 reserve/keep 做成可见配置并在模型切换时重新计算，不要硬编码单一窗口。
6. 事实二：刚从模型拿到真实 token 账单就用真实数，刚塞进来的工具结果还没账单就先用保守估算，不会因为只看旧 usage 而漏算最新输入。
7. 数据流：纯 loop → coding host → resources/extensions → RLM/daemon → JSONL events 和恢复。
8. 小白动作：先把任务拆成 loop、工具、上下文、协作和持久化五格。
9. 第二个动作：为每个后台任务记录 admission、heartbeat、lease 和完成释放，避免幽灵进程。
10. 局限提醒：reserve/keep 预算、chars/4 估算、合法 cut point、结构化摘要和 branch summary。
11. 这一章的结论：自研应把 reserve/keep 做成可见配置并在模型切换时重新计算，不要硬编码单一窗口。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 7787f07415d843b9a800f6a4720e0c739bd608e5
