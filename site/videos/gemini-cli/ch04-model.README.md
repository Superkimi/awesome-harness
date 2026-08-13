# M04 · Provider：多入口与流式重试

- Project: Legacy Gemini CLI
- Fixed source commit: 1ac3377395868295e128b96726d605a900b5946b
- Evidence ledger: data/legacy/evidence/gemini-cli/evidence.json
- Episode: ch04-model
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/core/src/core/contentGenerator.ts:35-70 · 统一 ContentGenerator 契约覆盖流式、非流式、计数与 embedding
  - packages/core/src/core/contentGenerator.ts:285-310 · 个人/ADC 走 Code Assist，API key/Vertex/Gateway 走 Google GenAI SDK
  - packages/core/src/core/geminiChat.ts:517-578 · 连接阶段与中途流错误分开重试，中途流最多四次尝试
