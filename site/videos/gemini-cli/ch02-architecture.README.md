# M02 · 架构：ContentGenerator、Scheduler 和 Policy

- Project: Legacy Gemini CLI
- Fixed source commit: 1ac3377395868295e128b96726d605a900b5946b
- Evidence ledger: data/legacy/evidence/gemini-cli/evidence.json
- Episode: ch02-architecture
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/core/src/core/contentGenerator.ts:35-70 · 统一 ContentGenerator 契约覆盖流式、非流式、计数与 embedding
  - packages/core/src/core/turn.ts:236-320 · Turn 只解析模型流，工具执行交给独立 event-driven Scheduler
  - packages/core/src/policy/policy-engine.ts:49-195 · PolicyEngine 按优先级匹配工具、参数、MCP 身份、annotations、模式、交互状态和 subagent
