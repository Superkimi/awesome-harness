1. 研究要异步跑，我先看 HumanMessage 过滤、declarative/compiled/remote 子 Agent 和 fs_tools allowlist。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：libs/deepagents/deepagents/middleware/subagents.py:402-420 · task 子 Agent 只拿到新的 HumanMessage，并过滤 private state；libs/deepagents/deepagents/graph.py:407-439 · 支持 declarative、compiled 和 async/remote 三种子 Agent；libs/code/deepagents_code/agent.py:2892-2924 · CLI 用 fs_tools allowlist 重新注入主 Agent 和子 Agent，防 delegation 绕过。
4. 事实一：子 Agent 不会自动继承父 Agent 的整段聊天记录，而是收到任务说明和允许共享的状态，完成后返回干净的报告。
5. 源码含义：多 Agent 协作应隔离 context，并定义 state merge/return schema，防止子任务把内部状态污染主循环。
6. 事实二：简单任务写配置就行，复杂任务可以传已经编译的图，远程任务则用 async deployment；不是所有子 Agent 都被迫走同一条路径。
7. 数据流：create_deep_agent → middleware graph → backend/tools → policy/sandbox → checkpoint/session/grader。
8. 小白动作：先把任务拆成 middleware、backend、工具、权限和观测五格。
9. 第二个动作：为子 Agent、MCP、shell 和插件分别记录 trust、allowlist、sandbox 和恢复边界。
10. 局限提醒：declarative/compiled/async subagents、private state keys、task result Command 与 tracing metadata。
11. 这一章的结论：多 Agent 协作应隔离 context，并定义 state merge/return schema，防止子任务把内部状态污染主循环。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 217b9eb372fa51b0439434f31abc3ac22e6cd7f2
