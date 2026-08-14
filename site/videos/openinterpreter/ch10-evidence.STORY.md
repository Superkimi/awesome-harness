# M10 · 证据：JSONL 是事实源，分析和诊断分层

## Hook
评审问恢复和观测是不是口号，我用 rollout reconstruction、SQLite/trace 和分析端点回答。

## Evidence anchors
- oi-observe-001: codex-rs/core/src/session/rollout_reconstruction.rs:116-288 · JSONL rollout 是可恢复事件事实源，SQLite/trace 是查询与诊断层
  - 先保存完整流水账，再从流水账还原聊天、文件、工具和子 Agent 发生了什么。
- oi-observe-002: codex-rs/analytics/src/client.rs:54-105 · Open Interpreter 使用独立分析端点，默认启用但可显式关闭
  - 默认会发产品使用事件到 Open Interpreter 的后端，用户可以在配置里关掉；遥测故障不会卡住编码任务。

## Takeaway
恢复与审计能力强；事件 schema 演进、敏感字段保留和磁盘生命周期需要治理。
