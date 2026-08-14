1. 长任务快超窗，我先看静态前缀、动态尾部、三种策略和独立 memory agent。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：crates/jcode-base/src/prompt.rs:451-557 · 静态前缀与每轮动态上下文分离，memory 放尾部保缓存；crates/jcode-base/src/compaction.rs:128-205 · 压缩器不复制历史，只记录被摘要的前缀游标；crates/jcode-base/src/compaction.rs:456-543 · 压缩支持 reactive、趋势预测和语义换题三种策略。
4. 事实一：不常变的说明书放书脊，记忆和本轮提醒贴在最后一页；这样改便签不会让整本书的缓存失效。
5. 源码含义：明显以 prompt-cache economics 为一等设计目标。
6. 事实二：原始账本仍归 Session 管，压缩器只记“前 N 条已折叠成摘要”，不会偷偷维护第二份容易漂移的历史。
7. 数据流：用户 turn → snapshot/journal → Provider/工具 → context/permission → session、swarm 和指标。
8. 小白动作：先给每轮任务写入状态，再把输入、工具、恢复和交付拆成四个检查点。
9. 第二个动作：把串行、batch、重试、压缩和协作预算分别记账，不要只记总耗时。
10. 局限提醒：cache-aware prompt、三种压缩策略、紧急恢复、后台跨会话 memory agent。
11. 这一章的结论：明显以 prompt-cache economics 为一等设计目标。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 71fa60c4dc875ebdaf089e6e84b29cbd61cbb478f
