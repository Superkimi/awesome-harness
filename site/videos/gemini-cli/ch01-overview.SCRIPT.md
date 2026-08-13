1. 老板让我跑一条长任务，我先确认 Gemini CLI 如何限制 turn、保存 checkpoint 并支持 rewind。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：packages/core/src/core/client.ts:79-111 · 主 Harness 用递归 sendMessageStream 驱动多 turn，硬上限为 100；packages/core/src/services/chatRecordingService.ts:150-203 · 会话记录是增量 JSONL，支持 rewind、metadata patch 和完整 checkpoint。
4. 事实一：一次用户请求可以连续让模型说、用工具、再说；但最多转 100 圈，避免无尽自言自语。
5. 源码含义：控制流直观，递归路径共享 prompt_id 和 hook state，需要严格做 activeCalls 记账。
6. 事实二：对话文件像事件日志：可以写“回到某一步”、只改元数据，也能偶尔写一张完整快照；一行坏了不拖垮整份会话。
7. 数据流：用户消息 → sendMessageStream → Context/Policy → Scheduler/AgentProtocol → JSONL checkpoint。
8. 小白动作：先把长任务拆成循环、上下文、策略、工具和回放五格。
9. 第二个动作：为超限、取消、拒绝和重试分别写终态，不要只看“执行成功”。
10. 局限提醒：主递归 turn、模型路由、next-speaker、loop recovery、hook 与上限。
11. 这一章的结论：控制流直观，递归路径共享 prompt_id 和 hook state，需要严格做 activeCalls 记账。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 1ac3377395868295e128b96726d605a900b5946b
