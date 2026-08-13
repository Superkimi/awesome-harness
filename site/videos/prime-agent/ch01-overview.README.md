# M01 · 总览：纯 Loop、Coding Host、Extension Bus

- Project: Legacy Prime Agent
- Fixed source commit: 7787f07415d843b9a800f6a4720e0c739bd608e5
- Evidence ledger: data/legacy/evidence/prime-agent/evidence.json
- Episode: ch01-overview
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/coding-agent/src/core/agent-session.ts:1-13 · 最值得借鉴的是“纯 loop + coding host + extension bus”三层分离
  - packages/agent/src/agent-loop.ts:178-205 · 低层 Agent Loop 是可复用的 provider-neutral 状态机
