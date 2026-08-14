# M05 · 工具：结构化搜索编辑与 BackendProtocol

- Project: Legacy DeepAgents
- Fixed source commit: 217b9eb372fa51b0439434f31abc3ac22e6cd7f2
- Evidence ledger: data/legacy/evidence/deepagents/evidence.json
- Episode: ch05-tools
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - libs/deepagents/deepagents/backends/protocol.py:378-396 · BackendProtocol 把文件操作和 shell 执行明确拆层
  - libs/deepagents/deepagents/backends/protocol.py:473-530 · 搜索和编辑工具是结构化 API，不是原始 grep/sed 字符串
  - libs/deepagents/deepagents/backends/state.py:37-47 · SDK 默认 StateBackend 是会话内临时存储，execute 只对 sandbox backend 出现
