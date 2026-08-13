# M03 · 主循环：取消、steer 和子 Agent 结果如何注入

- Project: Legacy CodeWhale
- Fixed source commit: cfc2f2b13c070e900ee10dbeffb07028d3beaebd
- Evidence ledger: data/legacy/evidence/codewhale/evidence.json
- Episode: ch03-loop
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/tui/src/core/engine/turn_loop.rs:364-412 · 单轮流式循环有取消、steer、工具预算和子 Agent 结果注入
  - crates/tui/src/core/engine/turn_loop.rs:620-687 · prefix cache 不是口号，而是每次请求前的可诊断一致性检查
