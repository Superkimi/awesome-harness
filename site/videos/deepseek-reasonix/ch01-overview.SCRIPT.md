1. 老板让我交付一条长任务，我先确认所有前端为什么都从同一个 Boot 和 Harness 进来。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：internal/boot/boot.go:1-8 · Boot 是唯一装配根，所有前端共享同一套 Harness；internal/agent/agent.go:33-62 · 主循环以模型自然结束为主，额外叠加多种止损护栏。
4. 事实一：终端、桌面和服务端不是各写一套 Agent，而是都插到同一个“总电闸”上，所以权限、工具和生命周期不会因为换界面而变一套。
5. 源码含义：自研时应把 frontend 变成事件消费者，避免在 UI 层重复实现 turn、审批和恢复。
6. 事实二：它允许长任务一直做，但每个工具输出和“最后确认”都有保险丝；只要交付模式缺验收或验证，主机就不会让它假装完成。
7. 数据流：Boot → Controller/Agent → Provider/工具 → Policy/Sandbox → event wire/Evidence Ledger。
8. 小白动作：先把一轮任务拆成装配、动作、策略、回放和验收五格。
9. 第二个动作：为 thinking、工具、恢复和协作分别记录证据，不要把日志当成事实账本。
10. 局限提醒：boot/Controller/Agent 的装配、异步 turn admission、主循环上限与 Delivery readiness guard。
11. 这一章的结论：自研时应把 frontend 变成事件消费者，避免在 UI 层重复实现 turn、审批和恢复。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 9aaf8d381a214cd2cb6df774d3b207a646ddd651
