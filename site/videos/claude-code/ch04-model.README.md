# M04 · Provider：流式失败还能退回非流式

- Project: Legacy Claude Code (reconstruction)
- Fixed source commit: 3bb6b5746238c418138eb96d57765d79012edd96
- Evidence ledger: data/legacy/evidence/claude-code/evidence.json
- Episode: ch04-model
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - src/services/api/claude.ts:1282-1338 · 共享预处理之后按 Provider 分流，Anthropic 仍是最深的主路径
  - src/services/api/claude.ts:818-925 · 流式异常可退回非流式请求，且为 fallback 设置独立超时
