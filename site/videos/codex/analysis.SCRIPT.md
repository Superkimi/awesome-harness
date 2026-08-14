1. 评审问我：这个大型 Rust Harness 怎么把 turn、工具、沙箱、子 Agent 和持久化一起管住？我沿固定证据拆。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：codex-rs/core/src/session/turn.rs:153-274 · 每个 turn 由多个 step 组成，step 内共享一次不可漂移的上下文快照；codex-rs/core/src/tools/registry.rs:48-149 · 工具有统一 typed runtime 契约，hooks、观测和流式参数 diff 都是一级能力；codex-rs/protocol/src/protocol.rs:890-932 · 审批策略把“何时问”与“允许做什么”分成两条轴。
4. 事实一：一轮任务可以问模型很多次，但每一次“想一想并行动”的小步都先拍一张现场快照，避免工具清单和提示词在同一步里前后不一致。
5. 源码含义：配置热更新只能在安全边界生效，换来 prompt cache 和工具调用的确定性。
6. 事实二：每个新工具不只是写一个 execute 函数，还要说明如何取消、怎么记日志、钩子看什么、参数流到一半时如何展示。
7. 数据流：用户消息 → turn/step 快照 → Provider/工具 → 权限与沙箱 → rollout/SQLite 交付。
8. 小白动作：先把任务拆成状态快照、动作、审批和回放四格，再决定并发方式。
9. 第二个动作：把模型可见工具、真实执行器和审计事件分别记录，不要混成一张列表。
10. 局限提醒：审计 turn loop、step snapshot、流式采样、重试、mailbox 抢占和停止钩子。
11. 这一章的结论：配置热更新只能在安全边界生效，换来 prompt cache 和工具调用的确定性。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 902bd9e06b3ecb32cbf7f8e64cd23b956be3e7fe
