# M10 · 证据：原子会话、StateStore 与用量归属

- Project: Legacy CodeWhale
- Fixed source commit: cfc2f2b13c070e900ee10dbeffb07028d3beaebd
- Evidence ledger: data/legacy/evidence/codewhale/evidence.json
- Episode: ch10-evidence
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/tui/src/session_manager.rs:26-40 · Session 保存是原子写，恢复会校验 schema 并修复 tool history
  - crates/state/src/lib.rs:262-338 · StateStore 用 SQLite 做投影，同时保留 append-only session index 和树状消息关系
  - crates/tui/src/snapshot/mod.rs:1-34 · side-git 快照保护用户仓库且把失败当成安全网降级
  - crates/tui/src/core/events.rs:19-105 · 事件类型区分流式内容、工具生命周期和冻结路由/计费 receipt
  - crates/tui/src/cost_status.rs:629-659 · 后台子 Agent 的用量按 owner lease 归属，记录有界且不会因 parent 结束丢账
