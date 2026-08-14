# M10 · 证据：用量、遥测和失败边界

- Project: Legacy MonkeyCode
- Fixed source commit: fcc5320b15a10dfec4d5891ce44d9d1470e10c2b
- Evidence ledger: data/legacy/evidence/monkeycode/evidence.json
- Episode: ch10-evidence
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - backend/biz/llmproxy/proxy.go:246-264 · 模型流被旁路解析，用量归因到 task/user/VM
  - backend/pkg/telemetry/telemetry.go:29-65 · 遥测采用 OTLP，但输出前做严格 allowlist 消毒
  - backend/pkg/lifecycle/taskhook.go:104-123 · Taskflow Create 失败被记录但吞掉，任务可能滞留 processing
