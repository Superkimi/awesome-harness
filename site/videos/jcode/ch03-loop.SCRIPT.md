1. 同事说断流就丢半截状态，我沿 turn_loops 看工具配对修复、快照和完整 replay。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：crates/jcode-app-core/src/agent/turn_loops.rs:17-68 · 循环在每次请求前修复工具配对并重建稳定快照；crates/jcode-app-core/src/agent/turn_loops.rs:455-484 · 中途断流先撤销半截状态再完整重播；crates/jcode-app-core/src/agent/turn_loops.rs:5-15 · 上下文、截断回复和工具后空回复各有独立止损上限。
4. 事实一：每次再问模型前先查账：工具有没有开单不回执、旧历史是否已折叠、这一轮工具箱和提示词是否稳定。
5. 源码含义：把异常历史修复、缓存稳定和请求生命周期放在一个明确关口。
6. 事实二：网络半路断了，不把前半句和前半个工具调用留在账上；先橡皮擦掉，再从头重放。
7. 数据流：用户 turn → snapshot/journal → Provider/工具 → context/permission → session、swarm 和指标。
8. 小白动作：先给每轮任务写入状态，再把输入、工具、恢复和交付拆成四个检查点。
9. 第二个动作：把串行、batch、重试、压缩和协作预算分别记账，不要只记总耗时。
10. 局限提醒：持久化入口、流事件状态机、重试回滚、空响应/上下文恢复与 soft interrupt。
11. 这一章的结论：把异常历史修复、缓存稳定和请求生命周期放在一个明确关口。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 71fa60c4dc875ebdaf089e6e84b29cbd61cbb478f
