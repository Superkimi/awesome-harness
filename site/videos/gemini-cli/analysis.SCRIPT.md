1. 评审问我：这个 CLI 怎么把多 turn、ContextManager、PolicyEngine、MCP 和可回放会话连起来？我沿固定源码证据拆。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：packages/core/src/core/client.ts:79-111 · 主 Harness 用递归 sendMessageStream 驱动多 turn，硬上限为 100；packages/core/src/context/contextManager.ts:26-88 · 新 ContextManager 是图与流水线系统，带 preview late-bind、压力屏障、GC/蒸馏和结构校验；packages/core/src/policy/policy-engine.ts:49-195 · PolicyEngine 按优先级匹配工具、参数、MCP 身份、annotations、模式、交互状态和 subagent。
4. 事实一：一次用户请求可以连续让模型说、用工具、再说；但最多转 100 圈，避免无尽自言自语。
5. 源码含义：控制流直观，递归路径共享 prompt_id 和 hook state，需要严格做 activeCalls 记账。
6. 事实二：新系统不再把历史当一长串消息，而是当可追溯的节点图；当前问题先在草稿区处理，确认后才影响长期账本。
7. 数据流：用户消息 → sendMessageStream → Context/Policy → Scheduler/AgentProtocol → JSONL checkpoint。
8. 小白动作：先把长任务拆成循环、上下文、策略、工具和回放五格。
9. 第二个动作：为超限、取消、拒绝和重试分别写终态，不要只看“执行成功”。
10. 局限提醒：主递归 turn、模型路由、next-speaker、loop recovery、hook 与上限。
11. 这一章的结论：控制流直观，递归路径共享 prompt_id 和 hook state，需要严格做 activeCalls 记账。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 1ac3377395868295e128b96726d605a900b5946b
