# M06 · 长任务：Goal loop 和 cache-stable prefix

- Project: Legacy CodeWhale
- Fixed source commit: cfc2f2b13c070e900ee10dbeffb07028d3beaebd
- Evidence ledger: data/legacy/evidence/codewhale/evidence.json
- Episode: ch06-context
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/tui/src/tools/registry.rs:200-244 · 工具目录用排序、memoization 和有界 LRU 支持 cache-stable prefix
  - crates/tui/src/goal_loop.rs:1-23 · Goal loop 是持久目标层，不是把 max_steps 放大
