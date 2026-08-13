# M06 · 上下文：JSONL、checkpoint 与活动任务恢复

- Project: Legacy Kimi CLI
- Fixed source commit: cbc15c076d17f70fec9f89c90c0502e68657f505
- Evidence ledger: data/legacy/evidence/kimi-cli/evidence.json
- Episode: ch06-context
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - src/kimi_cli/soul/context.py:20-65 · 上下文是可增量恢复的 JSONL 事件账本
  - src/kimi_cli/soul/context.py:123-200 · checkpoint 回退会保留旧文件并重算状态
  - src/kimi_cli/soul/compaction.py:37-82 · 压缩由阈值触发，摘要旧历史并保留最近轮次
  - src/kimi_cli/soul/kimisoul.py:1432-1476 · 压缩后显式恢复活动后台任务与动态约束状态
