# M10 · 证据：checkpoint、grader 和成本三层观测

## Hook
评审问“结果能不能审计”，我用 SQLite session、LangGraph metadata、cost event 和 read-only grader 回答。

## Evidence anchors
- deep-obs-001: libs/deepagents/deepagents/graph.py:922-944 · LangGraph metadata、SQLite session list 和 cost event 组成三层观测
  - 一次运行可以在 LangSmith 里追踪，在本地 SQLite 里筛选恢复，也能在 UI 看到累计花费。
- deep-obs-002: libs/code/deepagents_code/sessions.py:401-431 · CLI session 以 checkpoint database 为事实来源并按 cwd/branch 过滤
  - 会话列表不是扫描巨型 state blob，而是读 metadata 索引；用户可以快速找回某个项目分支的线程。
- deep-code-001: libs/code/deepagents_code/agent.py:2883-2891 · DeepAgents Code 有 server hooks、goal/rubric 和 read-only grader
  - 它不只让模型写代码，还能在真实工作区检查是否达成 rubric，并把 hook 事件交给宿主治理。
- deep-maturity-001: libs/deepagents/tests/unit_tests/test_graph.py:1-12 · 测试覆盖 graph、backend、permissions、subagent、压缩、skills、memory 和本地 sandbox
  - 它的回归面覆盖了实际 harness 最容易出错的地方：压缩、权限、工具后端、子 Agent 和本地执行。

## Takeaway
观测要同时服务在线 trace、离线 session search 和账单/预算，而不是只有日志。
