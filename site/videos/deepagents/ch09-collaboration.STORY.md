# M09 · 协作：三种子 Agent 与 delegation 防绕过

## Hook
研究要异步跑，我先看 HumanMessage 过滤、declarative/compiled/remote 子 Agent 和 fs_tools allowlist。

## Evidence anchors
- deep-collab-001: libs/deepagents/deepagents/middleware/subagents.py:402-420 · task 子 Agent 只拿到新的 HumanMessage，并过滤 private state
  - 子 Agent 不会自动继承父 Agent 的整段聊天记录，而是收到任务说明和允许共享的状态，完成后返回干净的报告。
- deep-collab-002: libs/deepagents/deepagents/graph.py:407-439 · 支持 declarative、compiled 和 async/remote 三种子 Agent
  - 简单任务写配置就行，复杂任务可以传已经编译的图，远程任务则用 async deployment；不是所有子 Agent 都被迫走同一条路径。
- deep-cli-001: libs/code/deepagents_code/agent.py:2892-2924 · CLI 用 fs_tools allowlist 重新注入主 Agent 和子 Agent，防 delegation 绕过
  - 限制主 Agent 只能 read/grep 并不够，子 Agent 也必须拿到同一份文件工具白名单。

## Takeaway
多 Agent 协作应隔离 context，并定义 state merge/return schema，防止子任务把内部状态污染主循环。
