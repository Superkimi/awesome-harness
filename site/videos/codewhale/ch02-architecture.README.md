# M02 · 架构：EngineConfig 是运行时总闸

- Project: Legacy CodeWhale
- Fixed source commit: cfc2f2b13c070e900ee10dbeffb07028d3beaebd
- Evidence ledger: data/legacy/evidence/codewhale/evidence.json
- Episode: ch02-architecture
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/tui/src/core/engine.rs:221-298 · EngineConfig 是把能力、预算和权限拧在一起的运行时总闸
  - crates/tui/src/core/engine.rs:1920-1942 · Turn 运行前冻结事实，运行后再做持久化与继续决策
  - crates/tui/src/core/engine.rs:3385-3418 · Tool catalog 与 preview 共享同一装配函数，但 preview 是纯观察
