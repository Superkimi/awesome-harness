1. 架构评审只剩十分钟，我得讲清模型流、工具调度和策略引擎各自的边界。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：packages/core/src/core/contentGenerator.ts:35-70 · 统一 ContentGenerator 契约覆盖流式、非流式、计数与 embedding；packages/core/src/core/turn.ts:236-320 · Turn 只解析模型流，工具执行交给独立 event-driven Scheduler；packages/core/src/policy/policy-engine.ts:49-195 · PolicyEngine 按优先级匹配工具、参数、MCP 身份、annotations、模式、交互状态和 subagent。
4. 事实一：上层只认一套生成接口，底下可换个人 Google 登录、API key、企业 Vertex 或网关。
5. 源码含义：Provider 切换不改主循环，但 thought signature 兼容性仍需在切换认证后处理。
6. 事实二：模型流负责开任务单，调度器负责审批、排队、执行和回执；两者不是揉在一个 switch 里。
7. 数据流：用户消息 → sendMessageStream → Context/Policy → Scheduler/AgentProtocol → JSONL checkpoint。
8. 小白动作：先把长任务拆成循环、上下文、策略、工具和回放五格。
9. 第二个动作：为超限、取消、拒绝和重试分别写终态，不要只看“执行成功”。
10. 局限提醒：ContentGenerator、Google OAuth/API key/Vertex/Gateway、流式重试。
11. 这一章的结论：Provider 切换不改主循环，但 thought signature 兼容性仍需在切换认证后处理。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 1ac3377395868295e128b96726d605a900b5946b
