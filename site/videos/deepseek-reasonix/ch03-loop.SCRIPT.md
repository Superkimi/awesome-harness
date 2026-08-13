1. 同事说模型停下来就算完成，我沿 Controller 和 Agent 看取消、轮次和恢复边界。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：internal/agent/agent.go:33-62 · 主循环以模型自然结束为主，额外叠加多种止损护栏；internal/control/controller.go:60-76 · Controller 对并发 turn、旋转、收尾和自动保存有明确状态机。
4. 事实一：它允许长任务一直做，但每个工具输出和“最后确认”都有保险丝；只要交付模式缺验收或验证，主机就不会让它假装完成。
5. 源码含义：“无限循环”与“无限输出”被拆开治理；建设时要同时设计自然终止、重复调用 guard、输出预算和交付完成判定。
6. 事实二：用户连按几次发送不会把同一个会话撕成两半：新消息要么排队，要么明确被拒；切换会话时也不会恰好换掉正在用的那份上下文。
7. 数据流：Boot → Controller/Agent → Provider/工具 → Policy/Sandbox → event wire/Evidence Ledger。
8. 小白动作：先把一轮任务拆成装配、动作、策略、回放和验收五格。
9. 第二个动作：为 thinking、工具、恢复和协作分别记录证据，不要把日志当成事实账本。
10. 局限提醒：boot/Controller/Agent 的装配、异步 turn admission、主循环上限与 Delivery readiness guard。
11. 这一章的结论：“无限循环”与“无限输出”被拆开治理；建设时要同时设计自然终止、重复调用 guard、输出预算和交付完成判定。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 9aaf8d381a214cd2cb6df774d3b207a646ddd651
