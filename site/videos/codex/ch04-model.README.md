# M04 · Provider：Responses API 之外是可扩展端点

- Project: Legacy OpenAI Codex
- Fixed source commit: 902bd9e06b3ecb32cbf7f8e64cd23b956be3e7fe
- Evidence ledger: data/legacy/evidence/codex/evidence.json
- Episode: ch04-model
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - codex-rs/model-provider-info/src/lib.rs:54-84 · 模型协议只保留 Responses API，但 Provider 端点与认证可扩展
  - codex-rs/core/src/client.rs:1-24 · 传输层同时支持 SSE 与可复用 WebSocket，并带 turn 粘性状态
