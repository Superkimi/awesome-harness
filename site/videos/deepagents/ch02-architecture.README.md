# M02 · 架构：middleware 顺序与 profile exclusion

- Project: Legacy DeepAgents
- Fixed source commit: 217b9eb372fa51b0439434f31abc3ac22e6cd7f2
- Evidence ledger: data/legacy/evidence/deepagents/evidence.json
- Episode: ch02-architecture
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - libs/deepagents/deepagents/graph.py:361-401 · 核心 middleware 有受保护的顺序和排除校验
  - libs/deepagents/deepagents/backends/protocol.py:378-396 · 最值得借鉴的是 BackendProtocol 与 middleware 的正交组合
  - libs/deepagents/deepagents/backends/protocol.py:378-396 · BackendProtocol 把文件操作和 shell 执行明确拆层
