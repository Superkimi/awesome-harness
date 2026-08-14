# JCode · 技术分析总览

- Project: Legacy JCode
- Fixed source commit: 71fa60c4dc875ebdaf089e6e84b29cbd61cbb478f
- Evidence ledger: data/legacy/evidence/jcode/evidence.json
- Episode: analysis
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/jcode-app-core/src/agent/turn_execution.rs:4-35 · 每个用户 turn 先写盘，再进入可恢复的流式循环
  - crates/jcode-provider-core/src/lib.rs:76-126 · Provider 契约不仅抽象生成，还抽象认证、路由、transport 与原生能力
  - crates/jcode-base/src/prompt.rs:451-557 · 静态前缀与每轮动态上下文分离，memory 放尾部保缓存
  - crates/jcode-app-core/src/tool/mod.rs:543-601 · 工具边界由 session allow/disable 与外部 pre_tool gate 双层控制
  - crates/jcode-app-core/src/server/swarm.rs:1528-1613 · 轻量 swarm 先让协调者规划 2–4 个任务，再并发 fork Provider
  - crates/jcode-base/src/session/persistence.rs:307-395 · Session 用完整 snapshot 加 append-only JSONL journal
