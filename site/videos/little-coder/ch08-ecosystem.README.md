# M08 · 子 Agent：能力收窄才能安全并行

- Project: Legacy Little Coder
- Fixed source commit: 0b7234031aabe56163e345792ce7a6ea05af321a
- Evidence ledger: data/legacy/evidence/little-coder/evidence.json
- Episode: ch08-ecosystem
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - .pi/extensions/subagent/index.ts:12-20 · 子 Agent 是独立 little-coder 进程，父上下文只收短报告
  - .pi/extensions/subagent/spawn.ts:25-44 · 子 Agent 工具能力收窄且禁止递归 dispatch
  - .pi/extensions/plan-mode/index.ts:15-35 · Plan Mode 本身就是一条多 Agent 工作流
