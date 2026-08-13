# M10 · 证据：质量、checkpoint 和输出纠偏

- Project: Legacy Little Coder
- Fixed source commit: 0b7234031aabe56163e345792ce7a6ea05af321a
- Evidence ledger: data/legacy/evidence/little-coder/evidence.json
- Episode: ch10-evidence
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - .pi/extensions/evidence/index.ts:5-42 · 证据是 session-scoped 结构化对象，并显式跨压缩
  - .pi/extensions/quality-monitor/index.ts:5-18 · 质量监控会 steer 自纠，但最多连续两次
  - .pi/extensions/checkpoint/index.ts:6-45 · checkpoint 是 best-effort 文件快照，且存在 path 键兼容缺口
  - .pi/extensions/output-parser/index.ts:5-20 · 文本化 tool call 只能纠偏，不能由扩展代执行
