# M10 · 证据：snapshot、journal 和实时指标

- Project: Legacy JCode
- Fixed source commit: 71fa60c4dc875ebdaf089e6e84b29cbd61cbb478f
- Evidence ledger: data/legacy/evidence/jcode/evidence.json
- Episode: ch10-evidence
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/jcode-base/src/session/persistence.rs:307-395 · Session 用完整 snapshot 加 append-only JSONL journal
  - crates/jcode-app-core/src/tool/mod.rs:603-638 · 观测覆盖结构化 lifecycle、实时 session metrics 与可选择遥测
  - crates/jcode-base/src/compaction_tests.rs:388-451 · 关键故障边界有源码级回归测试，许可证为 MIT
