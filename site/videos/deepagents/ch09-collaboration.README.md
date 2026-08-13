# M09 · 协作：三种子 Agent 与 delegation 防绕过

- Project: Legacy DeepAgents
- Fixed source commit: 217b9eb372fa51b0439434f31abc3ac22e6cd7f2
- Evidence ledger: data/legacy/evidence/deepagents/evidence.json
- Episode: ch09-collaboration
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - libs/deepagents/deepagents/middleware/subagents.py:402-420 · task 子 Agent 只拿到新的 HumanMessage，并过滤 private state
  - libs/deepagents/deepagents/graph.py:407-439 · 支持 declarative、compiled 和 async/remote 三种子 Agent
  - libs/code/deepagents_code/agent.py:2892-2924 · CLI 用 fs_tools allowlist 重新注入主 Agent 和子 Agent，防 delegation 绕过
