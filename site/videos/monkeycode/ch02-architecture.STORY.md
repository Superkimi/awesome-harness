# M02 · 架构：数据库、VM、Redis 和 CLI 怎么接力

## Hook
评审只剩十分钟，我得讲清一条任务从预登记到运行态启动经历了哪些层。

## Evidence anchors
- monkey-lifecycle-001: backend/biz/task/usecase/task.go:556-617 · 任务创建拆成数据库预登记、VM 创建、Redis 交接、运行态启动
  - 先把工单和工作间登记好，再等工作间真的上线，最后才把任务交给里面的 Agent。
- monkey-sandbox-001: backend/pkg/taskflow/types.go:72-92 · 隔离边界主要依赖仓库外 VM，Codex 内层 sandbox 明确关闭
  - Codex 在房间里面拿的是万能钥匙；安全取决于这个“房间”到底是不是一间真正隔离的 VM，而造房间的代码不在本仓库。

## Takeaway
分阶段便于恢复和审计，但 Redis 交接键成为启动链路的关键依赖。
