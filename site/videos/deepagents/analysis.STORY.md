# DeepAgents · 技术分析总览

## Hook
评审问我：这个系统怎么把 middleware graph、BackendProtocol、MCP、子 Agent 和 policy-aware coding 组合起来？我沿固定证据拆。

## Evidence anchors
- deep-arch-001: libs/deepagents/deepagents/graph.py:268-300 · create_deep_agent 是 middleware graph builder，不是单一巨大 Agent 类
  - DeepAgents 把 Agent 看成一张可配置的 LangGraph：模型、文件工具、子 Agent、压缩、记忆和审批都作为中间件节点组合。
- deep-context-001: libs/deepagents/deepagents/middleware/summarization.py:249-289 · 摘要默认按模型窗口的 85% 触发、保留 10%
  - 它不会给所有模型硬塞同一个消息数量，而是尽量按模型实际输入窗口比例决定何时压缩和保留多少。
- deep-backend-001: libs/deepagents/deepagents/backends/protocol.py:378-396 · BackendProtocol 把文件操作和 shell 执行明确拆层
  - 文件工具不再偷偷依赖 shell：没有 shell 的后端也能读写、搜索和编辑；只有明确实现 SandboxBackendProtocol 才会有 execute。
- deep-security-001: libs/deepagents/deepagents/middleware/filesystem.py:383-430 · FilesystemPermission 是 first-match allow/deny/interrupt 规则
  - 权限规则像防火墙：先匹配到的规则生效，读写可以拒绝，敏感路径可以暂停让人确认。
- deep-collab-001: libs/deepagents/deepagents/middleware/subagents.py:402-420 · task 子 Agent 只拿到新的 HumanMessage，并过滤 private state
  - 子 Agent 不会自动继承父 Agent 的整段聊天记录，而是收到任务说明和允许共享的状态，完成后返回干净的报告。
- deep-obs-001: libs/deepagents/deepagents/graph.py:922-944 · LangGraph metadata、SQLite session list 和 cost event 组成三层观测
  - 一次运行可以在 LangSmith 里追踪，在本地 SQLite 里筛选恢复，也能在 UI 看到累计花费。

## Takeaway
自研可借鉴“装配器 + 可插拔 middleware”模式，把功能切片而非把所有逻辑揉成 turn 函数。
