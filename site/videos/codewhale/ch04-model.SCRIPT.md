1. 长任务快超窗，我先看 ContextBudget、尾部工作集、重试和 fallback 怎么保住事实。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：crates/tui/src/context_budget.rs:1-32 · ContextBudget 用饱和数学先给输出留空间，再决定压缩；crates/tui/src/compaction.rs:473-507 · 压缩先保留尾部、工作集、错误和补丁，再维护工具调用配对；crates/tui/src/compaction.rs:1172-1281 · 摘要失败时有本地 prune、重试和机械 fallback，并把 live state 重新注入。
4. 事实一：模型要回答的空间先保留，输入预算才是剩下的；即使配置了一个夸张的输出上限，也不会把可用输入预算算成负数。
5. 源码含义：上下文工程的第一层不是摘要，而是一个独立、可单测、不会下溢的预算模块。
6. 事实二：压缩不是从前往后粗暴删消息：正在改的文件、刚出现的错误、补丁和最近对话会被钉住，工具调用的“发票”和“回执”也不能只剩一半。
7. 数据流：Core/EngineConfig → turn freeze → ToolSpec/MCP → policy/sandbox → session/checkpoint/receipt。
8. 小白动作：先把任务拆成能力、预算、审批、执行和证据五格。
9. 第二个动作：为并行、心跳、取消、恢复和用量归属各留一个明确状态。
10. 局限提醒：预算数学、working set pin、工具调用配对、摘要 ladder、live state rehydrate 与机械 fallback。
11. 这一章的结论：上下文工程的第一层不是摘要，而是一个独立、可单测、不会下溢的预算模块。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cfc2f2b13c070e900ee10dbeffb07028d3beaebd
