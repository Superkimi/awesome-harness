# M04 · Provider：动态提示和过期 token 刷新

- Project: Legacy Prime Agent
- Fixed source commit: 7787f07415d843b9a800f6a4720e0c739bd608e5
- Evidence ledger: data/legacy/evidence/prime-agent/evidence.json
- Episode: ch04-model
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/agent/src/types.ts:170-183 · 运行时支持 provider 动态系统提示和过期 token 刷新
  - packages/agent/src/agent-loop.ts:467-521 · Provider 边界前才做上下文变换和密钥解析
