# M09 · 协作：AgentProtocol 的订阅、回放与取消

- Project: Legacy Gemini CLI
- Fixed source commit: 1ac3377395868295e128b96726d605a900b5946b
- Evidence ledger: data/legacy/evidence/gemini-cli/evidence.json
- Episode: ch09-collaboration
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/core/src/agent/agent-session.ts:14-69 · 子 Agent 统一为可订阅、可重放、可中止的 AgentProtocol
  - packages/core/src/agents/local-subagent-protocol.ts:69-95 · Local 子 Agent 支持后台执行和取消，但同一 protocol 实例不允许并发 stream
