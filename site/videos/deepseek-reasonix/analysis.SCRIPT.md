1. 评审问我：这个 Harness 怎么把 thinking、工具、沙箱、MCP 和 Evidence Ledger 组成一条可审计链？我沿固定证据拆。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：internal/boot/boot.go:1-8 · Boot 是唯一装配根，所有前端共享同一套 Harness；internal/provider/openai/openai.go:279-316 · DeepSeek thinking 与工具调用 reasoning replay 是显式协议分支；internal/agent/execute_one.go:20-80 · 每个工具调用固定经过 parse→policy→prepare→finish 四阶段。
4. 事实一：终端、桌面和服务端不是各写一套 Agent，而是都插到同一个“总电闸”上，所以权限、工具和生命周期不会因为换界面而变一套。
5. 源码含义：自研时应把 frontend 变成事件消费者，避免在 UI 层重复实现 turn、审批和恢复。
6. 事实二：Reasonix 没把 DeepSeek 当普通 OpenAI 接口：它记得“思考字段”要跟着工具调用回放，并把 Beta 截断续写和断网重试接在同一个流上。
7. 数据流：Boot → Controller/Agent → Provider/工具 → Policy/Sandbox → event wire/Evidence Ledger。
8. 小白动作：先把一轮任务拆成装配、动作、策略、回放和验收五格。
9. 第二个动作：为 thinking、工具、恢复和协作分别记录证据，不要把日志当成事实账本。
10. 局限提醒：boot/Controller/Agent 的装配、异步 turn admission、主循环上限与 Delivery readiness guard。
11. 这一章的结论：自研时应把 frontend 变成事件消费者，避免在 UI 层重复实现 turn、审批和恢复。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 9aaf8d381a214cd2cb6df774d3b207a646ddd651
