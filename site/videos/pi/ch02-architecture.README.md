# M02 · 架构：turn boundary 怎么把系统接起来

- Project: Legacy Pi
- Fixed source commit: 581d75a89cea21e50d6a26df840352f94427f633
- Evidence ledger: data/legacy/evidence/pi/evidence.json
- Episode: ch02-architecture
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/agent/src/harness/agent-harness.ts:354-497 · 新 AgentHarness 把请求 hooks、消息持久化和运行时变更统一到 turn boundary
  - packages/coding-agent/src/core/session-manager.ts:30-153 · 会话是 append-only JSONL 树，可移动叶子、fork 和保存扩展状态
