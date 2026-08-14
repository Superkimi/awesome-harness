# M10 · 证据：JSONL、SQLite 和跨面观测

## Hook
评审问“失败能不能回放”，我用 rollout writer、SQLite 镜像和跨模型/工具观测回答。

## Evidence anchors
- codex-persistence-001: codex-rs/rollout/src/recorder.rs:93-171 · 会话采用 JSONL rollout 作为事件事实源，后台 writer 支持 persist、flush 与失败记忆
  - 先把每一步写成可重放流水账，后台书记员负责落盘；书记员一旦坏掉，后续调用会记得这次故障而不是假装成功。
- codex-persistence-002: codex-rs/state/src/lib.rs:1-10 · SQLite 是可查询镜像，并把状态、日志、目标和记忆拆库降低锁竞争
  - 流水账负责忠实记录，SQLite 像索引卡片箱，负责快速搜索；不同类型卡片分柜，避免大家抢同一把锁。
- codex-observe-001: codex-rs/core/src/client.rs:74-91 · 观测横跨模型、工具、hooks、MCP、rollout 与 SQLite，不只是一份 CLI 日志
  - 既能看模型这段花了多久，也能拆出排队、工具处理、钩子、连接器和数据库的时间与故障。

## Takeaway
支持 resume/fork/审计，也给崩溃恢复和一致性测试提供稳定基线。
