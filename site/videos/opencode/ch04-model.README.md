# M04 · Provider：不只是兼容 OpenAI API

- Project: Legacy OpenCode
- Fixed source commit: cc4b45612974f735ddec46009ede07729511fba4
- Evidence ledger: data/legacy/evidence/opencode/evidence.json
- Episode: ch04-model
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/opencode/src/provider/provider.ts:101-145 · Provider 层是 AI SDK 适配矩阵，不只兼容 OpenAI API
  - packages/opencode/src/session/llm/request.ts:56-100 · 请求准备层统一合并 prompt、variant、provider options 与 hooks
