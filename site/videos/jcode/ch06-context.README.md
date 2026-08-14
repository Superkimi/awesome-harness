# M06 · 上下文：压缩只移动游标，不复制历史

- Project: Legacy JCode
- Fixed source commit: 71fa60c4dc875ebdaf089e6e84b29cbd61cbb478f
- Evidence ledger: data/legacy/evidence/jcode/evidence.json
- Episode: ch06-context
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/jcode-base/src/prompt.rs:451-557 · 静态前缀与每轮动态上下文分离，memory 放尾部保缓存
  - crates/jcode-base/src/compaction.rs:128-205 · 压缩器不复制历史，只记录被摘要的前缀游标
  - crates/jcode-base/src/compaction.rs:456-543 · 压缩支持 reactive、趋势预测和语义换题三种策略
  - crates/jcode-app-core/src/agent/compaction.rs:90-182 · 上下文溢出与请求体过大走不同紧急恢复路径
  - crates/jcode-base/src/memory_agent.rs:1-45 · 跨会话 memory 是独立后台 Agent，不阻塞主 turn
