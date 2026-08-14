# M07 · 安全：审批不等于隔离

- Project: Legacy Goose
- Fixed source commit: 11deb564d09db782a17878af7cfafd299d9fa461
- Evidence ledger: data/legacy/evidence/goose/evidence.json
- Episode: ch07-security
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/goose/src/agents/agent.rs:659-688 · 工具检查顺序体现“危险优先”
  - crates/goose/src/permission/permission_inspector.rs:159-268 · Auto、Approve、SmartApprove 是不同权限语义
  - crates/goose/src/agents/platform_extensions/developer/shell.rs:25-49 · 内置开发者工具没有强制工作区边界
