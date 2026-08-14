# M03 · 主循环：上下文压缩由 middleware 接管

## Hook
任务越聊越长，我先看 85% 阈值、summary event 和私有 state 如何保住交付。

## Evidence anchors
- deep-context-001: libs/deepagents/deepagents/middleware/summarization.py:249-289 · 摘要默认按模型窗口的 85% 触发、保留 10%
  - 它不会给所有模型硬塞同一个消息数量，而是尽量按模型实际输入窗口比例决定何时压缩和保留多少。
- deep-context-002: libs/deepagents/deepagents/middleware/summarization.py:1-58 · 压缩先归档旧历史，再把 summary event 放进私有 state
  - 上下文里的旧内容不是直接蒸发：它先被保存成可 read_file 的 markdown，模型只拿摘要和路径，下一轮还能按需取回。
- deep-context-004: libs/deepagents/deepagents/middleware/summarization.py:1768-1784 · manual compact_conversation 受半阈值 gate 约束
  - 模型可以主动整理上下文，但不能一开场就把还没做完的工作压成一句摘要。

## Takeaway
上下文策略应使用模型 profile，而不是只写“最近 20 条消息”。
