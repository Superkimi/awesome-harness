# Gemini CLI · 技术分析总览

- Project: Legacy Gemini CLI
- Fixed source commit: 1ac3377395868295e128b96726d605a900b5946b
- Evidence ledger: data/legacy/evidence/gemini-cli/evidence.json
- Episode: analysis
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/core/src/core/client.ts:79-111 · 主 Harness 用递归 sendMessageStream 驱动多 turn，硬上限为 100
  - packages/core/src/context/contextManager.ts:26-88 · 新 ContextManager 是图与流水线系统，带 preview late-bind、压力屏障、GC/蒸馏和结构校验
  - packages/core/src/policy/policy-engine.ts:49-195 · PolicyEngine 按优先级匹配工具、参数、MCP 身份、annotations、模式、交互状态和 subagent
  - packages/core/src/agent/agent-session.ts:14-69 · 子 Agent 统一为可订阅、可重放、可中止的 AgentProtocol
  - packages/core/src/services/chatRecordingService.ts:150-203 · 会话记录是增量 JSONL，支持 rewind、metadata patch 和完整 checkpoint
