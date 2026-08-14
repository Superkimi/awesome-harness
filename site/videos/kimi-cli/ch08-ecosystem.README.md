# M08 · 扩展：Hook、插件、MCP 与 Skills

- Project: Legacy Kimi CLI
- Fixed source commit: cbc15c076d17f70fec9f89c90c0502e68657f505
- Evidence ledger: data/legacy/evidence/kimi-cli/evidence.json
- Episode: ch08-ecosystem
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - src/kimi_cli/hooks/engine.py:65-91 · Hook 同时支持本地命令与客户端 wire subscription
  - src/kimi_cli/plugin/tool.py:37-130 · 插件工具是经审批的本地子进程，可获得新鲜 Host 凭证
  - src/kimi_cli/soul/agent.py:467-485 · MCP 延迟启动、逐服务器状态化，并对富媒体共享 100K 字符预算
  - src/kimi_cli/config.py:242-259 · Skills 跨 kimi/claude/codex 目录合并，并映射为 slash/flow 命令
