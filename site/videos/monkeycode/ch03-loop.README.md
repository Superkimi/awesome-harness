# M03 · 生命周期：任务为什么会卡在 processing

- Project: Legacy MonkeyCode
- Fixed source commit: fcc5320b15a10dfec4d5891ce44d9d1470e10c2b
- Evidence ledger: data/legacy/evidence/monkeycode/evidence.json
- Episode: ch03-loop
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - backend/pkg/lifecycle/taskhook.go:104-123 · Taskflow Create 失败被记录但吞掉，任务可能滞留 processing
