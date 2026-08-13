1. 架构评审只剩十分钟，我得讲清 query、Provider 分流和工具池各自负责什么。
2. 这一章不猜官方意图，只沿固定版本的复原代码、协议和测试看事实。
3. 固定版本证据：src/query.ts:460-666 · 主 Harness 是一个持续循环的消息变换与工具执行流水线；src/services/api/claude.ts:1282-1338 · 共享预处理之后按 Provider 分流，Anthropic 仍是最深的主路径；src/tools.ts:378-420 · 工具池合并内建与 MCP，并为 prompt cache 做确定性排序。
4. 事实一：每一轮不是“问一次模型就结束”，而是先整理行李、调用模型、执行动作、把结果记账，再决定继续还是停。
5. 源码含义：上下文、工具、权限和恢复都在同一编排循环交汇，修改其中任何一步都可能影响缓存与 transcript 一致性。
6. 事实二：先把所有方言共有的消息账本整理好，再交给各家的翻译器；Anthropic 方言拥有最完整的缓存、thinking 和 beta 功能。
7. 数据流：用户消息 → query/Provider → 工具与权限 → compaction/Agent → JSONL 会话与可回退结果。
8. 小白动作：先确认实现来源和许可边界，再用一个小任务验证循环、工具、权限、恢复四件事。
9. 第二个动作：失败时分别记录 provider、context、permission 和 sandbox，不要把所有错误归成“模型不行”。
10. 局限提醒：审计 query 主循环、streaming tool execution、重试、缺失 tool result 修复与 stop hook。
11. 这一章的结论：上下文、工具、权限和恢复都在同一编排循环交汇，修改其中任何一步都可能影响缓存与 transcript 一致性。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 3bb6b5746238c418138eb96d57765d79012edd96
