# M10 · 证据：怎样证明任务真的完成

## Hook
评审问“恢复和观测是不是口号”，我用 SQLite、WAL、tracing 和测试成熟度把证据链补齐。

## Evidence anchors
- goose-session-001: crates/goose/src/session/session_manager.rs:45-96 · 会话、消息、成本与压缩指标落到 SQLite/WAL
  - 对话不只是屏幕上的临时文本：每条消息、用的模型、父子会话、花费和压缩前后 token 都能落盘追踪。
- goose-observe-001: crates/goose/src/tracing/observation_layer.rs:103-184 · Tracing 以 goose:: span 生成 trace/span 观测事件
  - 内部关键步骤会形成一棵调用轨迹，不是只打一长串平面日志；同时避免把所有依赖库噪声都收进来。

## Takeaway
成本与上下文恢复应成为一等数据模型，而不是散落在日志字符串里。
