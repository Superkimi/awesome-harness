# M06 · 上下文：快满了为什么不是直接清空

- Project: Legacy Goose
- Fixed source commit: 11deb564d09db782a17878af7cfafd299d9fa461
- Evidence ledger: data/legacy/evidence/goose/evidence.json
- Episode: ch06-context
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/goose/src/context_mgmt/mod.rs:26-49 · 80% 阈值触发结构化压缩
  - crates/goose/src/context_mgmt/mod.rs:319-398 · 上下文超限采用渐进式工具结果剥离和一次恢复重试
