1. 架构评审只剩十分钟，我得讲清旋转、收尾、自动保存和并发状态机怎么接起来。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：internal/control/controller.go:60-76 · Controller 对并发 turn、旋转、收尾和自动保存有明确状态机；internal/agent/save.go:26-74 · 会话持久化是带 revision/CAS 的 append-only event log。
4. 事实一：用户连按几次发送不会把同一个会话撕成两半：新消息要么排队，要么明确被拒；切换会话时也不会恰好换掉正在用的那份上下文。
5. 源码含义：桌面/HTTP 多入口必须把“正在运行、等待审批、后台任务、收尾”分开建模，不能只暴露一个 running 布尔值。
6. 事实二：两个进程同时写同一会话时，旧进程不能把新内容抹掉；坏掉的 JSONL 尾巴先修，冲突会留下可恢复分支。
7. 数据流：Boot → Controller/Agent → Provider/工具 → Policy/Sandbox → event wire/Evidence Ledger。
8. 小白动作：先把一轮任务拆成装配、动作、策略、回放和验收五格。
9. 第二个动作：为 thinking、工具、恢复和协作分别记录证据，不要把日志当成事实账本。
10. 局限提醒：boot/Controller/Agent 的装配、异步 turn admission、主循环上限与 Delivery readiness guard。
11. 这一章的结论：桌面/HTTP 多入口必须把“正在运行、等待审批、后台任务、收尾”分开建模，不能只暴露一个 running 布尔值。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 9aaf8d381a214cd2cb6df774d3b207a646ddd651
