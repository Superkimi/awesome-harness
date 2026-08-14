# M02 · 架构：消息流水线怎样接工具和 Provider

- Project: Legacy Claude Code (reconstruction)
- Fixed source commit: 3bb6b5746238c418138eb96d57765d79012edd96
- Evidence ledger: data/legacy/evidence/claude-code/evidence.json
- Episode: ch02-architecture
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - src/query.ts:460-666 · 主 Harness 是一个持续循环的消息变换与工具执行流水线
  - src/services/api/claude.ts:1282-1338 · 共享预处理之后按 Provider 分流，Anthropic 仍是最深的主路径
  - src/tools.ts:378-420 · 工具池合并内建与 MCP，并为 prompt cache 做确定性排序
