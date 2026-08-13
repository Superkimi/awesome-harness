1. 评审问“结果能不能审计”，我用 SQLite session、LangGraph metadata、cost event 和 read-only grader 回答。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：libs/deepagents/deepagents/graph.py:922-944 · LangGraph metadata、SQLite session list 和 cost event 组成三层观测；libs/code/deepagents_code/sessions.py:401-431 · CLI session 以 checkpoint database 为事实来源并按 cwd/branch 过滤；libs/code/deepagents_code/agent.py:2883-2891 · DeepAgents Code 有 server hooks、goal/rubric 和 read-only grader。
4. 事实一：一次运行可以在 LangSmith 里追踪，在本地 SQLite 里筛选恢复，也能在 UI 看到累计花费。
5. 源码含义：观测要同时服务在线 trace、离线 session search 和账单/预算，而不是只有日志。
6. 事实二：会话列表不是扫描巨型 state blob，而是读 metadata 索引；用户可以快速找回某个项目分支的线程。
7. 数据流：create_deep_agent → middleware graph → backend/tools → policy/sandbox → checkpoint/session/grader。
8. 小白动作：先把任务拆成 middleware、backend、工具、权限和观测五格。
9. 第二个动作：为子 Agent、MCP、shell 和插件分别记录 trust、allowlist、sandbox 和恢复边界。
10. 局限提醒：LangGraph checkpointer/store、CLI SQLite sessions、LangSmith metadata、cost tracking 和 offload archive。
11. 这一章的结论：观测要同时服务在线 trace、离线 session search 和账单/预算，而不是只有日志。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 217b9eb372fa51b0439434f31abc3ac22e6cd7f2
