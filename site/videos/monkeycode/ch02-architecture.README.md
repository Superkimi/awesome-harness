# M02 · 架构：数据库、VM、Redis 和 CLI 怎么接力

- Project: Legacy MonkeyCode
- Fixed source commit: fcc5320b15a10dfec4d5891ce44d9d1470e10c2b
- Evidence ledger: data/legacy/evidence/monkeycode/evidence.json
- Episode: ch02-architecture
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - backend/biz/task/usecase/task.go:556-617 · 任务创建拆成数据库预登记、VM 创建、Redis 交接、运行态启动
  - backend/pkg/taskflow/types.go:72-92 · 隔离边界主要依赖仓库外 VM，Codex 内层 sandbox 明确关闭
