# M04 · 上下文：预算、尾部和机械 fallback

- Project: Legacy CodeWhale
- Fixed source commit: cfc2f2b13c070e900ee10dbeffb07028d3beaebd
- Evidence ledger: data/legacy/evidence/codewhale/evidence.json
- Episode: ch04-model
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/tui/src/context_budget.rs:1-32 · ContextBudget 用饱和数学先给输出留空间，再决定压缩
  - crates/tui/src/compaction.rs:473-507 · 压缩先保留尾部、工作集、错误和补丁，再维护工具调用配对
  - crates/tui/src/compaction.rs:1172-1281 · 摘要失败时有本地 prune、重试和机械 fallback，并把 live state 重新注入
