# M04 · 上下文：媒体和旧历史怎么处理

- Project: Legacy DeepAgents
- Fixed source commit: 217b9eb372fa51b0439434f31abc3ac22e6cd7f2
- Evidence ledger: data/legacy/evidence/deepagents/evidence.json
- Episode: ch04-model
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - libs/deepagents/deepagents/middleware/summarization.py:1-58 · 压缩先归档旧历史，再把 summary event 放进私有 state
  - libs/deepagents/deepagents/middleware/summarization.py:42-56 · 媒体会单独上传并在摘要中保留可读取路径
