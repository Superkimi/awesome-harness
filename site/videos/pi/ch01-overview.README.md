# M01 · 总览：通用内核与产品层双轨

- Project: Legacy Pi
- Fixed source commit: 581d75a89cea21e50d6a26df840352f94427f633
- Evidence ledger: data/legacy/evidence/pi/evidence.json
- Episode: ch01-overview
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/agent/src/harness/agent-harness.ts:171-223 · 仓库是“通用 Harness 内核 + 完整 Coding Agent 产品层”的双轨架构
  - packages/agent/src/harness/agent-harness.ts:354-497 · 新 AgentHarness 把请求 hooks、消息持久化和运行时变更统一到 turn boundary
