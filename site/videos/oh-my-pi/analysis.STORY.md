# Oh My Pi · 技术分析总览

## Hook
评审问我：这个 Agent 为什么能同时做 steering、压缩、MCP、子任务和观测？我不念宣传页，直接沿源码证据拆。

## Evidence anchors
- omp-architecture-001: packages/agent/src/agent-loop.ts:879-918 · 核心是强化 Agent loop，产品层再叠加大型 Session maintenance 状态机
  - 内层发动机负责每一步，外层管家负责一步结束后判断要不要重试、压缩、换模型、继续目标或等待后台工作。
- omp-loop-001: packages/agent/src/agent-loop.ts:999-1048 · steering 不只在轮间排队，还能在工具执行中协作中断
  - 用户插话时，纯等待可以立刻停；正在改文件的工具不会粗暴半路杀死，而是完成到安全边界再让模型听新指令。
- omp-context-001: packages/agent/src/compaction/compaction.ts:148-189 · 压缩不是单一摘要，而是 context-full/handoff/shake/snapcompact 多策略
  - 可以选择传统摘要、交接文档、删除低价值块或 frame 化压缩；预算还会随模型窗口缩放。
- omp-subagent-001: packages/coding-agent/src/task/index.ts:1-53 · Task 是内建多 Agent 调度器，支持 batch、async 与结构化 yield
  - 主 Agent 可以一次发一组有共同背景的任务，每个工人独立选角色和输出合同；结果不是随便一段聊天，而是显式交付。
- omp-observability-001: packages/agent/src/telemetry.ts:1-24 · 观测层原生实现 OTEL GenAI spans、成本与 run coverage
  - 不仅有终端日志，每次模型和工具调用都能变成标准 trace，还能关联费用和网关调用 ID；敏感内容是否进 trace 可配置。

## Takeaway
自治恢复能力强，但 session maintenance 已成为复杂调度器，修改顺序容易产生竞态。
