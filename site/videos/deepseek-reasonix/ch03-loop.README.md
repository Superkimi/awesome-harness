# M03 · 主循环：自然结束之外还有止损护栏

- Project: Legacy DeepSeek-Reasonix
- Fixed source commit: 9aaf8d381a214cd2cb6df774d3b207a646ddd651
- Evidence ledger: data/legacy/evidence/deepseek-reasonix/evidence.json
- Episode: ch03-loop
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - internal/agent/agent.go:33-62 · 主循环以模型自然结束为主，额外叠加多种止损护栏
  - internal/control/controller.go:60-76 · Controller 对并发 turn、旋转、收尾和自动保存有明确状态机
