# Little Coder · 技术分析总览

- Project: Legacy Little Coder
- Fixed source commit: 0b7234031aabe56163e345792ce7a6ea05af321a
- Evidence ledger: data/legacy/evidence/little-coder/evidence.json
- Episode: analysis
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - package.json:33-43 · 它是 pi 的 Harness 增强层，而不是另一套 Agent 内核
  - .pi/extensions/context-watchdog/index.ts:3-29 · 80% 中途压缩 watchdog 补上 pi 的长自主运行缺口
  - .pi/extensions/write-guard/index.ts:35-75 · 禁止整文件覆写是跨 Write 与 shell 的不变量
  - .pi/extensions/subagent/index.ts:12-20 · 子 Agent 是独立 little-coder 进程，父上下文只收短报告
  - .pi/extensions/evidence/index.ts:5-42 · 证据是 session-scoped 结构化对象，并显式跨压缩
