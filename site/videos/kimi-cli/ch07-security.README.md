# M07 · 安全：审批、Plan 模式与宿主 KAOS

- Project: Legacy Kimi CLI
- Fixed source commit: cbc15c076d17f70fec9f89c90c0502e68657f505
- Evidence ledger: data/legacy/evidence/kimi-cli/evidence.json
- Episode: ch07-security
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - src/kimi_cli/soul/approval.py:130-199 · 统一审批支持单次、整会话、拒绝反馈、YOLO 与 AFK
  - src/kimi_cli/soul/kimisoul.py:409-463 · Plan 模式不是隐藏工具，而是写工具调用时再强制拒绝
  - src/kimi_cli/agents/default/system.md:67-81 · 默认本地 KAOS 是宿主执行抽象，不是 OS 级沙箱
