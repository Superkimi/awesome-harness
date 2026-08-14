# M04 · 模型与消息：流式结果怎样变成可追踪状态

- Project: Legacy Goose
- Fixed source commit: 11deb564d09db782a17878af7cfafd299d9fa461
- Evidence ledger: data/legacy/evidence/goose/evidence.json
- Episode: ch04-model
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/goose-provider-types/src/base.rs:281-286 · Provider 以流式协议统一，工具调用必须完整再上送
