# M04 · Provider：多协议与热注册怎么共存

- Project: Legacy Pi
- Fixed source commit: 581d75a89cea21e50d6a26df840352f94427f633
- Evidence ledger: data/legacy/evidence/pi/evidence.json
- Episode: ch04-model
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/ai/src/providers/all.ts:5-44 · Provider 不是单一 OpenAI 兼容层，而是多协议适配矩阵
  - packages/coding-agent/src/core/model-runtime.ts:193-230 · Provider 可热注册和覆盖，失败时退回内建组合
  - packages/ai/src/utils/provider-retry.ts:22-66 · 传输重试与会话重试分层，上下文溢出单独处理
