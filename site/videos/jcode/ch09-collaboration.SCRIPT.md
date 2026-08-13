1. 研究要并发、产物还要可审计；我沿 coordinator、artifact gate、heartbeat 和死亡任务回收看两种 swarm。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：crates/jcode-app-core/src/server/swarm.rs:1528-1613 · 轻量 swarm 先让协调者规划 2–4 个任务，再并发 fork Provider；crates/jcode-base/src/prompt.rs:75-91 · deep swarm 把协作升级成可增长 DAG、强制 artifact 与审计 gate；crates/jcode-swarm-core/src/lib.rs:213-253 · Swarm 有持久成员树、频道、heartbeat 和死亡任务回收。
4. 事实一：先拆成几张独立工单，让多个复制了同一模型线路的工人同时做，最后由原会话汇总。
5. 源码含义：简单易用；worker 共享 registry 与工作目录，文件级冲突仍需任务切分和外部 git/worktree 纪律。
6. 事实二：不是“多叫几个人聊天”，而是把任务画成图：每个节点要交证据包，审计员可以发现缺口后现场加新节点，图没验完就不能宣布完成。
7. 数据流：用户 turn → snapshot/journal → Provider/工具 → context/permission → session、swarm 和指标。
8. 小白动作：先给每轮任务写入状态，再把输入、工具、恢复和交付拆成四个检查点。
9. 第二个动作：把串行、batch、重试、压缩和协作预算分别记账，不要只记总耗时。
10. 局限提醒：轻 fan-out、持久 Swarm、deep DAG/gates/artifacts、消息/频道、崩溃回收。
11. 这一章的结论：简单易用；worker 共享 registry 与工作目录，文件级冲突仍需任务切分和外部 git/worktree 纪律。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 71fa60c4dc875ebdaf089e6e84b29cbd61cbb478f
