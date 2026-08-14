# M01 · 总览：带检查点的多步状态机

- Project: Legacy Kimi CLI
- Fixed source commit: cbc15c076d17f70fec9f89c90c0502e68657f505
- Evidence ledger: data/legacy/evidence/kimi-cli/evidence.json
- Episode: ch01-overview
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - src/kimi_cli/soul/kimisoul.py:659-742 · 每轮是带检查点的多步状态机，不是单次聊天请求
  - src/kimi_cli/soul/context.py:20-65 · 上下文是可增量恢复的 JSONL 事件账本
