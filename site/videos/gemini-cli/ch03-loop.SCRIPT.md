1. 同事说模型输出什么就执行什么，我沿 sendMessageStream 看上下文、溢出、IDE 配对和 loop detection。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：packages/core/src/core/client.ts:614-715 · 每轮先做上下文、溢出、IDE 配对和 loop 检测，再锁定模型与工具；packages/core/src/core/client.ts:744-763 · 循环检测能先恢复一次，再判定硬循环。
4. 事实一：开口前先整理历史、确认装得下、保证工具回执不被编辑器消息插队，然后才选本轮模型和工具箱。
5. 源码含义：上下文与模型选择顺序清楚，工具描述可随模型变化且同一 sequence 保持模型粘性。
6. 事实二：第一次怀疑绕圈会给模型一次纠偏机会，第二次还绕就停。
7. 数据流：用户消息 → sendMessageStream → Context/Policy → Scheduler/AgentProtocol → JSONL checkpoint。
8. 小白动作：先把长任务拆成循环、上下文、策略、工具和回放五格。
9. 第二个动作：为超限、取消、拒绝和重试分别写终态，不要只看“执行成功”。
10. 局限提醒：主递归 turn、模型路由、next-speaker、loop recovery、hook 与上限。
11. 这一章的结论：上下文与模型选择顺序清楚，工具描述可随模型变化且同一 sequence 保持模型粘性。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 1ac3377395868295e128b96726d605a900b5946b
