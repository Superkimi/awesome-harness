# M04 · 上下文：预算、尾部和机械 fallback

## Hook
长任务快超窗，我先看 ContextBudget、尾部工作集、重试和 fallback 怎么保住事实。

## Evidence anchors
- codewhale-context-001: crates/tui/src/context_budget.rs:1-32 · ContextBudget 用饱和数学先给输出留空间，再决定压缩
  - 模型要回答的空间先保留，输入预算才是剩下的；即使配置了一个夸张的输出上限，也不会把可用输入预算算成负数。
- codewhale-context-002: crates/tui/src/compaction.rs:473-507 · 压缩先保留尾部、工作集、错误和补丁，再维护工具调用配对
  - 压缩不是从前往后粗暴删消息：正在改的文件、刚出现的错误、补丁和最近对话会被钉住，工具调用的“发票”和“回执”也不能只剩一半。
- codewhale-context-003: crates/tui/src/compaction.rs:1172-1281 · 摘要失败时有本地 prune、重试和机械 fallback，并把 live state 重新注入
  - 摘要模型挂了并不会让会话消失；系统会先剪工具输出，摘要不合格就重试，再不行就用规则折叠，并把正在跑的 worker、shell 和审批重新告诉下一任 Agent。

## Takeaway
上下文工程的第一层不是摘要，而是一个独立、可单测、不会下溢的预算模块。
