# Aider · 技术分析总览

- Project: Legacy Aider
- Fixed source commit: 5dc9490bb35f9729ef2c95d00a19ccd30c26339c
- Evidence ledger: data/legacy/evidence/aider/evidence.json
- Episode: analysis
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - aider/coders/base_coder.py:88-106 · 交互外环 + 有界 reflection 内环
  - aider/coders/base_coder.py:1226-1338 · 上下文被拆成稳定的 ChatChunks
  - aider/coders/base_coder.py:124-201 · 编辑协议是可替换 Coder 家族
  - aider/coders/base_coder.py:2375-2423 · Git 提交是编辑事务和恢复机制
  - aider/coders/architect_coder.py:6-48 · Architect/Editor 是顺序双模型链
