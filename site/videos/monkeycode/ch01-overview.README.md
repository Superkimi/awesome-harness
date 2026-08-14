# M01 · 总览：它管的是任务控制平面

- Project: Legacy MonkeyCode
- Fixed source commit: fcc5320b15a10dfec4d5891ce44d9d1470e10c2b
- Evidence ledger: data/legacy/evidence/monkeycode/evidence.json
- Episode: ch01-overview
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - backend/pkg/taskflow/types.go:554-587 · 它是多 CLI 的任务控制平面，不是第四套 Agent loop
  - backend/biz/task/usecase/task.go:556-617 · 任务创建拆成数据库预登记、VM 创建、Redis 交接、运行态启动
