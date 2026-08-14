1. 任务越聊越长，我先看 85% 阈值、summary event 和私有 state 如何保住交付。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：libs/deepagents/deepagents/middleware/summarization.py:249-289 · 摘要默认按模型窗口的 85% 触发、保留 10%；libs/deepagents/deepagents/middleware/summarization.py:1-58 · 压缩先归档旧历史，再把 summary event 放进私有 state；libs/deepagents/deepagents/middleware/summarization.py:1768-1784 · manual compact_conversation 受半阈值 gate 约束。
4. 事实一：它不会给所有模型硬塞同一个消息数量，而是尽量按模型实际输入窗口比例决定何时压缩和保留多少。
5. 源码含义：上下文策略应使用模型 profile，而不是只写“最近 20 条消息”。
6. 事实二：上下文里的旧内容不是直接蒸发：它先被保存成可 read_file 的 markdown，模型只拿摘要和路径，下一轮还能按需取回。
7. 数据流：create_deep_agent → middleware graph → backend/tools → policy/sandbox → checkpoint/session/grader。
8. 小白动作：先把任务拆成 middleware、backend、工具、权限和观测五格。
9. 第二个动作：为子 Agent、MCP、shell 和插件分别记录 trust、allowlist、sandbox 和恢复边界。
10. 局限提醒：0.85/0.10 model-aware trigger/keep、overflow fallback、markdown offload、media path 和 manual compact。
11. 这一章的结论：上下文策略应使用模型 profile，而不是只写“最近 20 条消息”。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 217b9eb372fa51b0439434f31abc3ac22e6cd7f2
