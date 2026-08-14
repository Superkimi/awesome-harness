# M02 · 架构：ContentGenerator、Scheduler 和 Policy

## Hook
架构评审只剩十分钟，我得讲清模型流、工具调度和策略引擎各自的边界。

## Evidence anchors
- gemini-provider-001: packages/core/src/core/contentGenerator.ts:35-70 · 统一 ContentGenerator 契约覆盖流式、非流式、计数与 embedding
  - 上层只认一套生成接口，底下可换个人 Google 登录、API key、企业 Vertex 或网关。
- gemini-tools-001: packages/core/src/core/turn.ts:236-320 · Turn 只解析模型流，工具执行交给独立 event-driven Scheduler
  - 模型流负责开任务单，调度器负责审批、排队、执行和回执；两者不是揉在一个 switch 里。
- gemini-policy-001: packages/core/src/policy/policy-engine.ts:49-195 · PolicyEngine 按优先级匹配工具、参数、MCP 身份、annotations、模式、交互状态和 subagent
  - 政策可以精确到“哪个子 Agent 在非交互模式调用哪个 MCP 的哪个参数”，不只是允许/禁止 Bash。

## Takeaway
Provider 切换不改主循环，但 thought signature 兼容性仍需在切换认证后处理。
