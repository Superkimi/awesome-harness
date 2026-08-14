1. 评审问我：这个系统怎么把 middleware graph、BackendProtocol、MCP、子 Agent 和 policy-aware coding 组合起来？我沿固定证据拆。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：libs/deepagents/deepagents/graph.py:268-300 · create_deep_agent 是 middleware graph builder，不是单一巨大 Agent 类；libs/deepagents/deepagents/middleware/summarization.py:249-289 · 摘要默认按模型窗口的 85% 触发、保留 10%；libs/deepagents/deepagents/backends/protocol.py:378-396 · BackendProtocol 把文件操作和 shell 执行明确拆层。
4. 事实一：DeepAgents 把 Agent 看成一张可配置的 LangGraph：模型、文件工具、子 Agent、压缩、记忆和审批都作为中间件节点组合。
5. 源码含义：自研可借鉴“装配器 + 可插拔 middleware”模式，把功能切片而非把所有逻辑揉成 turn 函数。
6. 事实二：它不会给所有模型硬塞同一个消息数量，而是尽量按模型实际输入窗口比例决定何时压缩和保留多少。
7. 数据流：create_deep_agent → middleware graph → backend/tools → policy/sandbox → checkpoint/session/grader。
8. 小白动作：先把任务拆成 middleware、backend、工具、权限和观测五格。
9. 第二个动作：为子 Agent、MCP、shell 和插件分别记录 trust、allowlist、sandbox 和恢复边界。
10. 局限提醒：create_deep_agent 构造 LangGraph agent，DeepAgents Code 再包一层 CLI middleware/approval/control plane。
11. 这一章的结论：自研可借鉴“装配器 + 可插拔 middleware”模式，把功能切片而非把所有逻辑揉成 turn 函数。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 217b9eb372fa51b0439434f31abc3ac22e6cd7f2
