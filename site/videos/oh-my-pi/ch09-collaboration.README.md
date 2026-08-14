# M09 · 协作：Task 是真正的多 Agent 调度器

- Project: Legacy Oh My Pi
- Fixed source commit: a53e4e790d3939a08708bf0d3c912d0763237a2d
- Evidence ledger: data/legacy/evidence/oh-my-pi/evidence.json
- Episode: ch09-collaboration
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/coding-agent/src/task/index.ts:1-53 · Task 是内建多 Agent 调度器，支持 batch、async 与结构化 yield
  - packages/coding-agent/src/config/settings-schema.ts:4505-4614 · 递归、并发、预算、闲置 park 与冷恢复都有硬合同
  - packages/coding-agent/src/task/index.ts:412-429 · 兄弟 Agent 可用 hub 实时协作，不只回传父节点
