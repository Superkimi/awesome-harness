# M02 · 架构：Controller 如何管理并发 turn

- Project: Legacy DeepSeek-Reasonix
- Fixed source commit: 9aaf8d381a214cd2cb6df774d3b207a646ddd651
- Evidence ledger: data/legacy/evidence/deepseek-reasonix/evidence.json
- Episode: ch02-architecture
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - internal/control/controller.go:60-76 · Controller 对并发 turn、旋转、收尾和自动保存有明确状态机
  - internal/agent/save.go:26-74 · 会话持久化是带 revision/CAS 的 append-only event log
