# Kimi CLI · 技术分析总览

- Project: Legacy Kimi CLI
- Fixed source commit: cbc15c076d17f70fec9f89c90c0502e68657f505
- Evidence ledger: data/legacy/evidence/kimi-cli/evidence.json
- Episode: analysis
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - src/kimi_cli/soul/kimisoul.py:659-742 · 每轮是带检查点的多步状态机，不是单次聊天请求
  - packages/kosong/src/kosong/_generate.py:52-103 · Kosong 把流式生成和工具调度拆成两层契约
  - src/kimi_cli/soul/agent.py:411-451 · 工具表由 agent spec 动态装配，插件和 MCP 追加进入同一 Toolset
  - src/kimi_cli/soul/approval.py:130-199 · 统一审批支持单次、整会话、拒绝反馈、YOLO 与 AFK
  - src/kimi_cli/soul/agent.py:411-431 · 内建 coder/explore/plan 用代码级工具白名单切分角色
  - src/kimi_cli/soul/kimisoul.py:1009-1076 · Wire 事件与 trace id 贯穿 turn、step、tool、approval、MCP、compaction
