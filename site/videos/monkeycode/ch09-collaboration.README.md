# M09 · 远程协作：owner gate 与历史回放

- Project: Legacy MonkeyCode
- Fixed source commit: fcc5320b15a10dfec4d5891ce44d9d1470e10c2b
- Evidence ledger: data/legacy/evidence/monkeycode/evidence.json
- Episode: ch09-collaboration
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - backend/biz/task/handler/v1/task.go:323-384 · 远程协作以 owner write gate、历史回放和实时流为核心
  - backend/pkg/taskflow/types.go:626-640 · 平台层没有可见的子 Agent 调度与独立治理实体
