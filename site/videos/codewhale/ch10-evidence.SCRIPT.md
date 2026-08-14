1. 评审问“失败能不能恢复、费用算给谁”，我用原子写、SQLite 投影、side-git 和 owner lease 回答。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：crates/tui/src/session_manager.rs:26-40 · Session 保存是原子写，恢复会校验 schema 并修复 tool history；crates/state/src/lib.rs:262-338 · StateStore 用 SQLite 做投影，同时保留 append-only session index 和树状消息关系；crates/tui/src/snapshot/mod.rs:1-34 · side-git 快照保护用户仓库且把失败当成安全网降级。
4. 事实一：进程崩溃时不会留下半个 JSON；下一次加载也不会把孤儿 tool result 原样塞回 provider。
5. 源码含义：会话持久化要把 atomicity、schema compatibility、crash checkpoint 和 history repair 作为一条恢复链。
6. 事实二：数据库负责查询和并发，JSONL 保留轻量索引；消息不是一条不可分叉的数组，而是带父节点和当前叶子的树。
7. 数据流：Core/EngineConfig → turn freeze → ToolSpec/MCP → policy/sandbox → session/checkpoint/receipt。
8. 小白动作：先把任务拆成能力、预算、审批、执行和证据五格。
9. 第二个动作：为并行、心跳、取消、恢复和用量归属各留一个明确状态。
10. 局限提醒：Session 原子保存/恢复、SQLite WAL/JSONL projection、side-git snapshots、typed events、cost receipts 与 tool audit。
11. 这一章的结论：会话持久化要把 atomicity、schema compatibility、crash checkpoint 和 history repair 作为一条恢复链。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cfc2f2b13c070e900ee10dbeffb07028d3beaebd
