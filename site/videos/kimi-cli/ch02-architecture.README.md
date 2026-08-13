# M02 · 架构：Kosong、Soul 与 Toolset 怎么分工

- Project: Legacy Kimi CLI
- Fixed source commit: cbc15c076d17f70fec9f89c90c0502e68657f505
- Evidence ledger: data/legacy/evidence/kimi-cli/evidence.json
- Episode: ch02-architecture
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/kosong/src/kosong/_generate.py:52-103 · Kosong 把流式生成和工具调度拆成两层契约
  - src/kimi_cli/soul/kimisoul.py:659-742 · 每轮是带检查点的多步状态机，不是单次聊天请求
  - src/kimi_cli/soul/agent.py:411-451 · 工具表由 agent spec 动态装配，插件和 MCP 追加进入同一 Toolset
