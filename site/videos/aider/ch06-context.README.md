# M06 · 上下文：大仓库怎样只带最有用的代码

- Project: Legacy Aider
- Fixed source commit: 5dc9490bb35f9729ef2c95d00a19ccd30c26339c
- Evidence ledger: data/legacy/evidence/aider/evidence.json
- Episode: ch06-context
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - aider/coders/base_coder.py:1226-1338 · 上下文被拆成稳定的 ChatChunks
  - aider/repomap.py:300-363 · Repo Map 是基于符号引用图的 PageRank
  - aider/repomap.py:629-706 · Repo Map 用二分搜索贴合 token 预算
  - aider/models.py:339-358 · 历史摘要保留近期尾部并递归收缩头部
  - aider/coders/base_coder.py:1396-1417 · 预测超窗时由用户决定是否硬发
