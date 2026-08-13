# Oh My Pi · 技术分析总览

- Project: Legacy Oh My Pi
- Fixed source commit: a53e4e790d3939a08708bf0d3c912d0763237a2d
- Evidence ledger: data/legacy/evidence/oh-my-pi/evidence.json
- Episode: analysis
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/agent/src/agent-loop.ts:879-918 · 核心是强化 Agent loop，产品层再叠加大型 Session maintenance 状态机
  - packages/agent/src/agent-loop.ts:999-1048 · steering 不只在轮间排队，还能在工具执行中协作中断
  - packages/agent/src/compaction/compaction.ts:148-189 · 压缩不是单一摘要，而是 context-full/handoff/shake/snapcompact 多策略
  - packages/coding-agent/src/task/index.ts:1-53 · Task 是内建多 Agent 调度器，支持 batch、async 与结构化 yield
  - packages/agent/src/telemetry.ts:1-24 · 观测层原生实现 OTEL GenAI spans、成本与 run coverage
