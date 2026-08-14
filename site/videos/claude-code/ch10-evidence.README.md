# M10 · 证据：JSONL 会话与可观测性边界

- Project: Legacy Claude Code (reconstruction)
- Fixed source commit: 3bb6b5746238c418138eb96d57765d79012edd96
- Evidence ledger: data/legacy/evidence/claude-code/evidence.json
- Episode: ch10-evidence
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - src/utils/sessionStorage.ts:130-168 · 会话是 append-only JSONL 树，而不是简单聊天数组
  - src/utils/telemetry/instrumentation.ts:1-71 · 开源复原代码中仍有可用 OTEL/Perfetto/Langfuse，但内部 analytics 不可等同
  - src/services/compact/__tests__/snipCompact.test.ts:1-80 · 测试很多，但复原完整度和许可边界仍是采用门槛
