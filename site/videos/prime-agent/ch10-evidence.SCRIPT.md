1. 评审问“恢复正确性怎么证明”，我用 parentId journal、四层 event 和测试布局回答。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/coding-agent/src/core/session-manager.ts:33-54 · SessionManager 用带 parentId 的 JSONL 树表达分支、压缩和扩展状态；packages/coding-agent/src/core/session-manager.ts:472-535 · Context 重建沿 parent tree，并把 compaction summary 放在 retained messages 前；packages/coding-agent/src/core/session-manager.ts:1345-1364 · 写盘采用临时文件 rename，普通 entry 采用 append-only。
4. 事实一：会话文件不是一条只能向后追加的聊天记录，而是一棵可导航的树；扩展可以持久化自己的 entry，又不会把内部状态强塞给模型。
5. 源码含义：要支持 fork、resume、compaction 和子 Agent，持久化格式需要 parent link、版本号和“不进入 LLM context”的 entry 类型。
6. 事实二：从任意分支恢复时，模型看到的是“摘要→保留的旧消息→新分支”，UI 还可以知道真实的树边界。
7. 数据流：纯 loop → coding host → resources/extensions → RLM/daemon → JSONL events 和恢复。
8. 小白动作：先把任务拆成 loop、工具、上下文、协作和持久化五格。
9. 第二个动作：为每个后台任务记录 admission、heartbeat、lease 和完成释放，避免幽灵进程。
10. 局限提醒：版本化 JSONL append-only session tree、原子 rewrite、typed events、telemetry/usage。
11. 这一章的结论：要支持 fork、resume、compaction 和子 Agent，持久化格式需要 parent link、版本号和“不进入 LLM context”的 entry 类型。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 7787f07415d843b9a800f6a4720e0c739bd608e5
