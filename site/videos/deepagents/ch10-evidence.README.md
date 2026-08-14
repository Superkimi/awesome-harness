# M10 · 证据：checkpoint、grader 和成本三层观测

- Project: Legacy DeepAgents
- Fixed source commit: 217b9eb372fa51b0439434f31abc3ac22e6cd7f2
- Evidence ledger: data/legacy/evidence/deepagents/evidence.json
- Episode: ch10-evidence
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - libs/deepagents/deepagents/graph.py:922-944 · LangGraph metadata、SQLite session list 和 cost event 组成三层观测
  - libs/code/deepagents_code/sessions.py:401-431 · CLI session 以 checkpoint database 为事实来源并按 cwd/branch 过滤
  - libs/code/deepagents_code/agent.py:2883-2891 · DeepAgents Code 有 server hooks、goal/rubric 和 read-only grader
  - libs/deepagents/tests/unit_tests/test_graph.py:1-12 · 测试覆盖 graph、backend、permissions、subagent、压缩、skills、memory 和本地 sandbox
