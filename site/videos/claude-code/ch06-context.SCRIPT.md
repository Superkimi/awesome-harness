1. 长任务快超窗，我先看工具瘦身、预留输出预算、reactive compact 和连续失败保护。
2. 这一章不猜官方意图，只沿固定版本的复原代码、协议和测试看事实。
3. 固定版本证据：src/services/compact/snipCompact.ts:60-147 · 上下文不是单层摘要，而是 snip、工具结果瘦身、session memory 与 autocompact 的阶梯；src/services/compact/autoCompact.ts:28-93 · 压缩为输出预留预算，并有连续失败熔断；src/query.ts:1352-1450 · 超长请求有 reactive compact 与循环保护。
4. 事实一：先精准剪掉明确不要的旧段，再清空大块工具输出，最后才用模型写摘要；不同手术刀处理不同类型的肥胖。
5. 源码含义：比单一“全历史总结”更保真，但分层状态、缓存标记和 resume 重建复杂。
6. 事实二：不会把车厢塞满到回答没座位；整理行李连续失败三次后先停手，不再每回合烧一次模型调用。
7. 数据流：用户消息 → query/Provider → 工具与权限 → compaction/Agent → JSONL 会话与可回退结果。
8. 小白动作：先确认实现来源和许可边界，再用一个小任务验证循环、工具、权限、恢复四件事。
9. 第二个动作：失败时分别记录 provider、context、permission 和 sandbox，不要把所有错误归成“模型不行”。
10. 局限提醒：审计 snip、microcompact、autocompact、session memory、reactive compact 与阈值/熔断。
11. 这一章的结论：比单一“全历史总结”更保真，但分层状态、缓存标记和 resume 重建复杂。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 3bb6b5746238c418138eb96d57765d79012edd96
