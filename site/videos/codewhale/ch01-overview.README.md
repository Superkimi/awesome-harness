# M01 · 总览：UI 和 AI 交互由事件驱动控制面接管

- Project: Legacy CodeWhale
- Fixed source commit: cfc2f2b13c070e900ee10dbeffb07028d3beaebd
- Evidence ledger: data/legacy/evidence/codewhale/evidence.json
- Episode: ch01-overview
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/tui/src/core/mod.rs:1-15 · Core 把 UI 与 AI 交互拆成事件驱动的控制面
  - crates/tui/src/core/engine.rs:1920-1942 · Turn 运行前冻结事实，运行后再做持久化与继续决策
