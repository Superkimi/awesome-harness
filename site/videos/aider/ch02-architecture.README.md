# M02 · 架构：模型、上下文和编辑器怎样分工

- Project: Legacy Aider
- Fixed source commit: 5dc9490bb35f9729ef2c95d00a19ccd30c26339c
- Evidence ledger: data/legacy/evidence/aider/evidence.json
- Episode: ch02-architecture
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - aider/models.py:985-1037 · LiteLLM 是统一 Provider 适配层
  - aider/coders/base_coder.py:1226-1338 · 上下文被拆成稳定的 ChatChunks
  - aider/coders/base_coder.py:124-201 · 编辑协议是可替换 Coder 家族
