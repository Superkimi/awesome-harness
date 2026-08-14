1. 评审问“失败能不能回放”，我用 rollout writer、SQLite 镜像和跨模型/工具观测回答。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：codex-rs/rollout/src/recorder.rs:93-171 · 会话采用 JSONL rollout 作为事件事实源，后台 writer 支持 persist、flush 与失败记忆；codex-rs/state/src/lib.rs:1-10 · SQLite 是可查询镜像，并把状态、日志、目标和记忆拆库降低锁竞争；codex-rs/core/src/client.rs:74-91 · 观测横跨模型、工具、hooks、MCP、rollout 与 SQLite，不只是一份 CLI 日志。
4. 事实一：先把每一步写成可重放流水账，后台书记员负责落盘；书记员一旦坏掉，后续调用会记得这次故障而不是假装成功。
5. 源码含义：支持 resume/fork/审计，也给崩溃恢复和一致性测试提供稳定基线。
6. 事实二：流水账负责忠实记录，SQLite 像索引卡片箱，负责快速搜索；不同类型卡片分柜，避免大家抢同一把锁。
7. 数据流：用户消息 → turn/step 快照 → Provider/工具 → 权限与沙箱 → rollout/SQLite 交付。
8. 小白动作：先把任务拆成状态快照、动作、审批和回放四格，再决定并发方式。
9. 第二个动作：把模型可见工具、真实执行器和审计事件分别记录，不要混成一张列表。
10. 局限提醒：审计 JSONL rollout、SQLite 镜像、日志/目标/记忆分库、tracing/OTEL 和工具时延。
11. 这一章的结论：支持 resume/fork/审计，也给崩溃恢复和一致性测试提供稳定基线。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 902bd9e06b3ecb32cbf7f8e64cd23b956be3e7fe
