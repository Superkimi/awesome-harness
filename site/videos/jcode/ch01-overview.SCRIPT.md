1. 老板让我交付一条长任务，我先确认 JCode 为什么把 turn 先落盘再进入流式循环。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：crates/jcode-app-core/src/agent/turn_execution.rs:4-35 · 每个用户 turn 先写盘，再进入可恢复的流式循环；crates/jcode-base/src/session/persistence.rs:307-395 · Session 用完整 snapshot 加 append-only JSONL journal。
4. 事实一：模型还没开口，用户输入已经落账；即使后面 API 或工具出错，恢复时也不会连问题本身都丢掉。
5. 源码含义：耐崩溃性强，但每轮和工具结果频繁保存会增加本地 I/O，需要 journal 快路径配合。
6. 事实二：平时只往流水账追加新变化，偶尔把整本账重抄成快照；这样频繁保存不会每次重写全部历史。
7. 数据流：用户 turn → snapshot/journal → Provider/工具 → context/permission → session、swarm 和指标。
8. 小白动作：先给每轮任务写入状态，再把输入、工具、恢复和交付拆成四个检查点。
9. 第二个动作：把串行、batch、重试、压缩和协作预算分别记账，不要只记总耗时。
10. 局限提醒：持久化入口、流事件状态机、重试回滚、空响应/上下文恢复与 soft interrupt。
11. 这一章的结论：耐崩溃性强，但每轮和工具结果频繁保存会增加本地 I/O，需要 journal 快路径配合。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 71fa60c4dc875ebdaf089e6e84b29cbd61cbb478f
