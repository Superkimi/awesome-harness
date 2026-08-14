1. 评审问“坏日志能不能自愈”，我用 append-only journal、glued entry 修复和 lifecycle metrics 回答。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：crates/jcode-base/src/session/persistence.rs:307-395 · Session 用完整 snapshot 加 append-only JSONL journal；crates/jcode-app-core/src/tool/mod.rs:603-638 · 观测覆盖结构化 lifecycle、实时 session metrics 与可选择遥测；crates/jcode-base/src/compaction_tests.rs:388-451 · 关键故障边界有源码级回归测试，许可证为 MIT。
4. 事实一：平时只往流水账追加新变化，偶尔把整本账重抄成快照；这样频繁保存不会每次重写全部历史。
5. 源码含义：兼顾耐久与 I/O；多写者必须依靠更上层会话所有权避免交错 append。
6. 事实二：本地能看每个工人最近是否真在干活、花了多少 token、工具跑多久；发往服务端的匿名统计能关闭，而对话内容默认不发。
7. 数据流：用户 turn → snapshot/journal → Provider/工具 → context/permission → session、swarm 和指标。
8. 小白动作：先给每轮任务写入状态，再把输入、工具、恢复和交付拆成四个检查点。
9. 第二个动作：把串行、batch、重试、压缩和协作预算分别记账，不要只记总耗时。
10. 局限提醒：snapshot+JSONL、损坏恢复、事件日志/metrics/opt-out telemetry、MIT。
11. 这一章的结论：兼顾耐久与 I/O；多写者必须依靠更上层会话所有权避免交错 append。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 71fa60c4dc875ebdaf089e6e84b29cbd61cbb478f
