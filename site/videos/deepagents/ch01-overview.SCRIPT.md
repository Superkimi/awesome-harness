1. 老板让我跑一条长任务，我先确认 DeepAgents 为什么不是一个巨大 Agent 类。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：libs/deepagents/deepagents/graph.py:268-300 · create_deep_agent 是 middleware graph builder，不是单一巨大 Agent 类；libs/deepagents/deepagents/graph.py:361-401 · 核心 middleware 有受保护的顺序和排除校验。
4. 事实一：DeepAgents 把 Agent 看成一张可配置的 LangGraph：模型、文件工具、子 Agent、压缩、记忆和审批都作为中间件节点组合。
5. 源码含义：自研可借鉴“装配器 + 可插拔 middleware”模式，把功能切片而非把所有逻辑揉成 turn 函数。
6. 事实二：顺序不是装饰：先把文件/任务工具放进去，再做压缩和 prompt cache，最后把 memory 与审批接在尾部；核心骨架不能被 profile 随意删掉。
7. 数据流：create_deep_agent → middleware graph → backend/tools → policy/sandbox → checkpoint/session/grader。
8. 小白动作：先把任务拆成 middleware、backend、工具、权限和观测五格。
9. 第二个动作：为子 Agent、MCP、shell 和插件分别记录 trust、allowlist、sandbox 和恢复边界。
10. 局限提醒：create_deep_agent 构造 LangGraph agent，DeepAgents Code 再包一层 CLI middleware/approval/control plane。
11. 这一章的结论：自研可借鉴“装配器 + 可插拔 middleware”模式，把功能切片而非把所有逻辑揉成 turn 函数。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 217b9eb372fa51b0439434f31abc3ac22e6cd7f2
