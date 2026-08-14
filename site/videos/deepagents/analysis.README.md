# DeepAgents · 技术分析总览

- Project: Legacy DeepAgents
- Fixed source commit: 217b9eb372fa51b0439434f31abc3ac22e6cd7f2
- Evidence ledger: data/legacy/evidence/deepagents/evidence.json
- Episode: analysis
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - libs/deepagents/deepagents/graph.py:268-300 · create_deep_agent 是 middleware graph builder，不是单一巨大 Agent 类
  - libs/deepagents/deepagents/middleware/summarization.py:249-289 · 摘要默认按模型窗口的 85% 触发、保留 10%
  - libs/deepagents/deepagents/backends/protocol.py:378-396 · BackendProtocol 把文件操作和 shell 执行明确拆层
  - libs/deepagents/deepagents/middleware/filesystem.py:383-430 · FilesystemPermission 是 first-match allow/deny/interrupt 规则
  - libs/deepagents/deepagents/middleware/subagents.py:402-420 · task 子 Agent 只拿到新的 HumanMessage，并过滤 private state
  - libs/deepagents/deepagents/graph.py:922-944 · LangGraph metadata、SQLite session list 和 cost event 组成三层观测
