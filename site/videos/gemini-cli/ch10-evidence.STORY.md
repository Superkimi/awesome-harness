# M10 · 证据：增量 JSONL、Telemetry 和完整 checkpoint

## Hook
评审问“失败能不能回放”，我用 chat recording、rewind、metadata patch 和 OTel 输出回答。

## Evidence anchors
- gemini-persistence-001: packages/core/src/services/chatRecordingService.ts:150-203 · 会话记录是增量 JSONL，支持 rewind、metadata patch 和完整 checkpoint
  - 对话文件像事件日志：可以写“回到某一步”、只改元数据，也能偶尔写一张完整快照；一行坏了不拖垮整份会话。
- gemini-observe-001: packages/core/src/telemetry/sdk.ts:240-318 · OpenTelemetry 可导出到 GCP、OTLP HTTP/gRPC、文件或控制台
  - 既能接企业观测平台，也能只落本地文件；模型调用之外还能看到进程内存和事件循环卡顿。
- gemini-maturity-001: LICENSE:1-28 · 大型 TypeScript monorepo，测试面广，Apache-2.0
  - 这是一套带 CLI、core、SDK、ACP/A2A、策略和平台沙箱的系统，不是单文件 demo。

## Takeaway
支持 resume/rewind 与格式迁移，需持续测试 checkpoint 和增量事件的一致性。
