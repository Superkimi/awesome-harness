# M01 · 总览：Boot 是唯一装配根

- Project: Legacy DeepSeek-Reasonix
- Fixed source commit: 9aaf8d381a214cd2cb6df774d3b207a646ddd651
- Evidence ledger: data/legacy/evidence/deepseek-reasonix/evidence.json
- Episode: ch01-overview
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - internal/boot/boot.go:1-8 · Boot 是唯一装配根，所有前端共享同一套 Harness
  - internal/agent/agent.go:33-62 · 主循环以模型自然结束为主，额外叠加多种止损护栏
