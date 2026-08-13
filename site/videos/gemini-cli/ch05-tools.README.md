# M05 · 工具：Scheduler 让模型流和执行解耦

- Project: Legacy Gemini CLI
- Fixed source commit: 1ac3377395868295e128b96726d605a900b5946b
- Evidence ledger: data/legacy/evidence/gemini-cli/evidence.json
- Episode: ch05-tools
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/core/src/core/turn.ts:236-320 · Turn 只解析模型流，工具执行交给独立 event-driven Scheduler
  - packages/core/src/scheduler/tool-executor.ts:250-297 · 超大工具结果在调度阶段落盘，取消也返回合法 functionResponse
