# M06 · 上下文：snip、autocompact 和熔断阶梯

- Project: Legacy Claude Code (reconstruction)
- Fixed source commit: 3bb6b5746238c418138eb96d57765d79012edd96
- Evidence ledger: data/legacy/evidence/claude-code/evidence.json
- Episode: ch06-context
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - src/services/compact/snipCompact.ts:60-147 · 上下文不是单层摘要，而是 snip、工具结果瘦身、session memory 与 autocompact 的阶梯
  - src/services/compact/autoCompact.ts:28-93 · 压缩为输出预留预算，并有连续失败熔断
  - src/query.ts:1352-1450 · 超长请求有 reactive compact 与循环保护
