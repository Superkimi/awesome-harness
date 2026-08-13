# M10 · 证据：JSONL 树、事件层和测试布局

- Project: Legacy Prime Agent
- Fixed source commit: 7787f07415d843b9a800f6a4720e0c739bd608e5
- Evidence ledger: data/legacy/evidence/prime-agent/evidence.json
- Episode: ch10-evidence
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/coding-agent/src/core/session-manager.ts:33-54 · SessionManager 用带 parentId 的 JSONL 树表达分支、压缩和扩展状态
  - packages/coding-agent/src/core/session-manager.ts:472-535 · Context 重建沿 parent tree，并把 compaction summary 放在 retained messages 前
  - packages/coding-agent/src/core/session-manager.ts:1345-1364 · 写盘采用临时文件 rename，普通 entry 采用 append-only
  - packages/agent/src/types.ts:399-421 · Agent events 覆盖 agent、turn、message 和 tool execution 四层
  - packages/coding-agent/test/acp-rlm-subagents.test.ts:1-12 · 测试布局覆盖 agent、session、daemon、RLM、MCP 与 telemetry
