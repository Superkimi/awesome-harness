# M02 · 架构：谁管循环，谁管上下文，谁管工具

- Project: Legacy Goose
- Fixed source commit: 11deb564d09db782a17878af7cfafd299d9fa461
- Evidence ledger: data/legacy/evidence/goose/evidence.json
- Episode: ch02-architecture
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/goose/src/agents/agent.rs:1930-2043 · 单一流式 Agent 循环驱动推理、工具和持久化
  - crates/goose-provider-types/src/base.rs:281-286 · Provider 以流式协议统一，工具调用必须完整再上送
  - crates/goose/src/context_mgmt/mod.rs:26-49 · 80% 阈值触发结构化压缩
