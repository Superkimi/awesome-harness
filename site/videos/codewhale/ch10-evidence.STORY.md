# M10 · 证据：原子会话、StateStore 与用量归属

## Hook
评审问“失败能不能恢复、费用算给谁”，我用原子写、SQLite 投影、side-git 和 owner lease 回答。

## Evidence anchors
- codewhale-persistence-001: crates/tui/src/session_manager.rs:26-40 · Session 保存是原子写，恢复会校验 schema 并修复 tool history
  - 进程崩溃时不会留下半个 JSON；下一次加载也不会把孤儿 tool result 原样塞回 provider。
- codewhale-persistence-002: crates/state/src/lib.rs:262-338 · StateStore 用 SQLite 做投影，同时保留 append-only session index 和树状消息关系
  - 数据库负责查询和并发，JSONL 保留轻量索引；消息不是一条不可分叉的数组，而是带父节点和当前叶子的树。
- codewhale-persistence-003: crates/tui/src/snapshot/mod.rs:1-34 · side-git 快照保护用户仓库且把失败当成安全网降级
  - CodeWhale 不碰用户自己的 .git，而是另存一份可 restore 的工作区历史；它是回滚保险，不是发布 gate。
- codewhale-observe-001: crates/tui/src/core/events.rs:19-105 · 事件类型区分流式内容、工具生命周期和冻结路由/计费 receipt
  - UI 可以实时显示思考和工具，但计费不会拿“计划使用的模型”冒充“实际发出的请求”；路由事实在 dispatch 边界冻结。
- codewhale-observe-002: crates/tui/src/cost_status.rs:629-659 · 后台子 Agent 的用量按 owner lease 归属，记录有界且不会因 parent 结束丢账
  - 父 Agent 已经显示完成，但后台 worker 还在花 token 时，账仍记在正确 owner 下；不会因为 mailbox 关闭就把成本丢掉。

## Takeaway
会话持久化要把 atomicity、schema compatibility、crash checkpoint 和 history repair 作为一条恢复链。
