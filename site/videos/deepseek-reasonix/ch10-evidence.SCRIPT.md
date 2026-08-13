1. 评审问“交付事实在哪里”，我用 typed wire、revision/CAS、Evidence Ledger 和 loop 测试回答。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：internal/agent/save.go:26-74 · 会话持久化是带 revision/CAS 的 append-only event log；internal/eventwire/wire.go:9-31 · 前端收到的是稳定 typed event wire，不是拼接日志；internal/evidence/evidence.go:348-373 · Evidence Ledger 把交付验收从文本变成可检查事实。
4. 事实一：两个进程同时写同一会话时，旧进程不能把新内容抹掉；坏掉的 JSONL 尾巴先修，冲突会留下可恢复分支。
5. 源码含义：长任务恢复需要 append-only log、版本号、锁和 conflict branch，单纯覆盖一个 chat.json 不够。
6. 事实二：桌面、TUI、HTTP 都能用同一套事件渲染工具卡、审批卡、压缩卡和成本仪表，不必从人类日志里猜状态。
7. 数据流：Boot → Controller/Agent → Provider/工具 → Policy/Sandbox → event wire/Evidence Ledger。
8. 小白动作：先把一轮任务拆成装配、动作、策略、回放和验收五格。
9. 第二个动作：为 thinking、工具、恢复和协作分别记录证据，不要把日志当成事实账本。
10. 局限提醒：JSONL event log、revision/CAS、recovery branch、typed event wire、usage/cache/evidence receipts。
11. 这一章的结论：长任务恢复需要 append-only log、版本号、锁和 conflict branch，单纯覆盖一个 chat.json 不够。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 9aaf8d381a214cd2cb6df774d3b207a646ddd651
