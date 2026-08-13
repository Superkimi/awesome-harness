# M10 · 证据：增量 JSONL、Telemetry 和完整 checkpoint

- Project: Legacy Gemini CLI
- Fixed source commit: 1ac3377395868295e128b96726d605a900b5946b
- Evidence ledger: data/legacy/evidence/gemini-cli/evidence.json
- Episode: ch10-evidence
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/core/src/services/chatRecordingService.ts:150-203 · 会话记录是增量 JSONL，支持 rewind、metadata patch 和完整 checkpoint
  - packages/core/src/telemetry/sdk.ts:240-318 · OpenTelemetry 可导出到 GCP、OTLP HTTP/gRPC、文件或控制台
  - LICENSE:1-28 · 大型 TypeScript monorepo，测试面广，Apache-2.0
