# M10 · 证据：snapshot、journal 和实时指标

## Hook
评审问“坏日志能不能自愈”，我用 append-only journal、glued entry 修复和 lifecycle metrics 回答。

## Evidence anchors
- jcode-persist-001: crates/jcode-base/src/session/persistence.rs:307-395 · Session 用完整 snapshot 加 append-only JSONL journal
  - 平时只往流水账追加新变化，偶尔把整本账重抄成快照；这样频繁保存不会每次重写全部历史。
- jcode-observe-001: crates/jcode-app-core/src/tool/mod.rs:603-638 · 观测覆盖结构化 lifecycle、实时 session metrics 与可选择遥测
  - 本地能看每个工人最近是否真在干活、花了多少 token、工具跑多久；发往服务端的匿名统计能关闭，而对话内容默认不发。
- jcode-maturity-001: crates/jcode-base/src/compaction_tests.rs:388-451 · 关键故障边界有源码级回归测试，许可证为 MIT
  - 不只是代码注释说“应该安全”：断流、损坏账本、深度协作契约等都有回归用例钉住。

## Takeaway
兼顾耐久与 I/O；多写者必须依靠更上层会话所有权避免交错 append。
