# M04 · Provider：九类 runtime 走同一事件流

- Project: Legacy JCode
- Fixed source commit: 71fa60c4dc875ebdaf089e6e84b29cbd61cbb478f
- Evidence ledger: data/legacy/evidence/jcode/evidence.json
- Episode: ch04-model
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/jcode-provider-core/src/lib.rs:76-126 · Provider 契约不仅抽象生成，还抽象认证、路由、transport 与原生能力
  - crates/jcode-base/src/provider/mod.rs:328-374 · MultiProvider 同时容纳九类 runtime 与兼容端点 profile
  - crates/jcode-app-core/src/agent/turn_loops.rs:485-547 · 服务端会话、原生工具和原生压缩都能穿过统一事件流
