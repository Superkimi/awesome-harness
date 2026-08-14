# M06 · 上下文：平台知道窗口但不替 Agent 压缩

- Project: Legacy MonkeyCode
- Fixed source commit: fcc5320b15a10dfec4d5891ce44d9d1470e10c2b
- Evidence ledger: data/legacy/evidence/monkeycode/evidence.json
- Episode: ch06-context
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - backend/biz/task/usecase/task.go:788-792 · 平台知道模型窗口上限，但不管理内层 compaction
  - backend/biz/task/service/tasksummary.go:32-92 · 任务摘要是异步 UI 元数据，不是 Agent 记忆回写
