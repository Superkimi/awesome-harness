# Goose · 技术分析总览

- Project: Legacy Goose
- Fixed source commit: 11deb564d09db782a17878af7cfafd299d9fa461
- Evidence ledger: data/legacy/evidence/goose/evidence.json
- Episode: analysis
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/goose/src/agents/agent.rs:1930-2043 · 单一流式 Agent 循环驱动推理、工具和持久化
  - crates/goose/src/context_mgmt/mod.rs:26-49 · 80% 阈值触发结构化压缩
  - crates/goose/src/agents/agent.rs:2210-2265 · 同一模型 turn 的多个工具经检查后并发执行
  - crates/goose/src/agents/agent.rs:659-688 · 工具检查顺序体现“危险优先”
  - crates/goose/src/agents/extension_manager.rs:1271-1342 · MCP 工具被统一命名空间化、缓存和动态刷新
  - crates/goose/src/session/session_manager.rs:45-96 · 会话、消息、成本与压缩指标落到 SQLite/WAL
