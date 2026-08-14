# M02 · 架构：请求、事件和持久化怎么接力

- Project: Legacy OpenCode
- Fixed source commit: cc4b45612974f735ddec46009ede07729511fba4
- Evidence ledger: data/legacy/evidence/opencode/evidence.json
- Episode: ch02-architecture
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/opencode/src/session/prompt.ts:1170-1241 · 每一步动态重建 Agent、工具、系统上下文和模型请求
  - packages/opencode/src/session/llm/request.ts:56-100 · 请求准备层统一合并 prompt、variant、provider options 与 hooks
  - packages/opencode/src/session/session.ts:120-158 · session 持久化 agent/model/permission/cost/tokens/summary/revert 与 parent
