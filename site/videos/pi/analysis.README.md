# Pi · 技术分析总览

- Project: Legacy Pi
- Fixed source commit: 581d75a89cea21e50d6a26df840352f94427f633
- Evidence ledger: data/legacy/evidence/pi/evidence.json
- Episode: analysis
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/agent/src/harness/agent-harness.ts:171-223 · 仓库是“通用 Harness 内核 + 完整 Coding Agent 产品层”的双轨架构
  - packages/agent/src/agent-loop.ts:155-275 · 低层循环把 steering、工具执行和 follow-up 分成内外两层
  - packages/agent/src/harness/agent-harness.ts:354-497 · 新 AgentHarness 把请求 hooks、消息持久化和运行时变更统一到 turn boundary
  - packages/coding-agent/src/core/session-manager.ts:30-153 · 会话是 append-only JSONL 树，可移动叶子、fork 和保存扩展状态
  - packages/coding-agent/src/core/extensions/loader.ts:66-124 · 扩展在同一进程执行，覆盖面接近完整产品内核
