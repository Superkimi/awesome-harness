# M01 · 总览：递归消息流与可回放会话

- Project: Legacy Gemini CLI
- Fixed source commit: 1ac3377395868295e128b96726d605a900b5946b
- Evidence ledger: data/legacy/evidence/gemini-cli/evidence.json
- Episode: ch01-overview
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/core/src/core/client.ts:79-111 · 主 Harness 用递归 sendMessageStream 驱动多 turn，硬上限为 100
  - packages/core/src/services/chatRecordingService.ts:150-203 · 会话记录是增量 JSONL，支持 rewind、metadata patch 和完整 checkpoint
