# M03 · 主循环：长任务为什么不轻易失控

- Project: Legacy Little Coder
- Fixed source commit: 0b7234031aabe56163e345792ce7a6ea05af321a
- Evidence ledger: data/legacy/evidence/little-coder/evidence.json
- Episode: ch03-loop
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - .pi/extensions/context-watchdog/index.ts:3-29 · 80% 中途压缩 watchdog 补上 pi 的长自主运行缺口
  - .pi/extensions/quality-monitor/index.ts:5-18 · 质量监控会 steer 自纠，但最多连续两次
