1. 评审问“恢复和观测是不是口号”，我用 SQLite、WAL、tracing 和测试成熟度把证据链补齐。
2. 这一章不猜作者意图，只沿着固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：crates/goose/src/session/session_manager.rs:45-96 · 会话、消息、成本与压缩指标落到 SQLite/WAL；crates/goose/src/tracing/observation_layer.rs:103-184 · Tracing 以 goose:: span 生成 trace/span 观测事件。
4. 事实一：对话不只是屏幕上的临时文本：每条消息、用的模型、父子会话、花费和压缩前后 token 都能落盘追踪。
5. 源码含义：成本与上下文恢复应成为一等数据模型，而不是散落在日志字符串里。
6. 事实二：内部关键步骤会形成一棵调用轨迹，不是只打一长串平面日志；同时避免把所有依赖库噪声都收进来。
7. 数据流：输入 → Agent/Session → Provider 或工具 → inspector/持久化 → 可回放结果。
8. 小白动作：先找到一个入口函数，再画出它调用的下一步和结束条件。
9. 第二个动作：把每个风险写成“证据、边界、回退”三列，不要只记一个功能名。
10. 局限提醒：已审计 SQLite/WAL、usage ledger、tracing span 与可选遥测。
11. 这一章的结论：成本与上下文恢复应成为一等数据模型，而不是散落在日志字符串里。
12. 下一章继续沿着固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 11deb564d09db782a17878af7cfafd299d9fa461
