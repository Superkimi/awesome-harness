# M10 · 证据：Wire 事件、trace id 与匿名遥测

- Project: Legacy Kimi CLI
- Fixed source commit: cbc15c076d17f70fec9f89c90c0502e68657f505
- Evidence ledger: data/legacy/evidence/kimi-cli/evidence.json
- Episode: ch10-evidence
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - src/kimi_cli/soul/kimisoul.py:1009-1076 · Wire 事件与 trace id 贯穿 turn、step、tool、approval、MCP、compaction
  - src/kimi_cli/config.py:261-264 · 匿名遥测默认开启但可配置/环境变量关闭，代码禁止传用户内容
  - src/kimi_cli/session.py:84-97 · 会话、子 Agent 与遥测均有损坏/并发防护，许可证为 Apache-2.0
