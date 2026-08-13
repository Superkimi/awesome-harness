# M01 · 总览：create_deep_agent 是图构建器

- Project: Legacy DeepAgents
- Fixed source commit: 217b9eb372fa51b0439434f31abc3ac22e6cd7f2
- Evidence ledger: data/legacy/evidence/deepagents/evidence.json
- Episode: ch01-overview
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - libs/deepagents/deepagents/graph.py:268-300 · create_deep_agent 是 middleware graph builder，不是单一巨大 Agent 类
  - libs/deepagents/deepagents/graph.py:361-401 · 核心 middleware 有受保护的顺序和排除校验
