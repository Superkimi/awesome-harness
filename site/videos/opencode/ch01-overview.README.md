# M01 · 总览：任务状态驱动的 Agent 工作台

- Project: Legacy OpenCode
- Fixed source commit: cc4b45612974f735ddec46009ede07729511fba4
- Evidence ledger: data/legacy/evidence/opencode/evidence.json
- Episode: ch01-overview
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/opencode/src/session/prompt.ts:1081-1130 · 主循环由持久化消息状态驱动，而不是一次性的 while(tool_call)
  - packages/opencode/src/session/prompt.ts:1170-1241 · 每一步动态重建 Agent、工具、系统上下文和模型请求
