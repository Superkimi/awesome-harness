# M10 · 证据：typed event、CAS 和验收账本

- Project: Legacy DeepSeek-Reasonix
- Fixed source commit: 9aaf8d381a214cd2cb6df774d3b207a646ddd651
- Evidence ledger: data/legacy/evidence/deepseek-reasonix/evidence.json
- Episode: ch10-evidence
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - internal/agent/save.go:26-74 · 会话持久化是带 revision/CAS 的 append-only event log
  - internal/eventwire/wire.go:9-31 · 前端收到的是稳定 typed event wire，不是拼接日志
  - internal/evidence/evidence.go:348-373 · Evidence Ledger 把交付验收从文本变成可检查事实
  - internal/agent/loop_e2e_test.go:68-102 · 测试覆盖了真实 loop 的配对、取消、断流恢复和 compaction 熔断
