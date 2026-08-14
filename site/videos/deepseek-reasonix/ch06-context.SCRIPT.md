1. 长任务快超窗，我先看多级阈值、最近尾部、归档旧历史和下一 session 的指令延迟。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：internal/agent/compact.go:19-36 · 上下文维护是 0.5/0.6/0.8/0.9 多级管道；internal/agent/compact.go:49-80 · 摘要保留用户事实、最近尾部并归档完整旧历史；internal/memory/memory.go:12-53 · 项目指令与记忆在启动时组成稳定 system prefix，编辑延迟到下一 session。
4. 事实一：它不会一到 50% 就重写整段历史：先提醒、再剪掉过期工具输出，真的快满才摘要；窗口太小导致反复压缩时会熔断而不是死循环。
5. 源码含义：Context pipeline 应把成本、缓存稳定性、信息损失和熔断作为不同阈值测试，而不是单一 max-token 截断。
6. 事实二：压缩不是把聊天变成一句“继续工作”：它把用户硬约束、做过的命令、错误和下一步分栏记录，原始旧消息还留在 archive 里。
7. 数据流：Boot → Controller/Agent → Provider/工具 → Policy/Sandbox → event wire/Evidence Ledger。
8. 小白动作：先把一轮任务拆成装配、动作、策略、回放和验收五格。
9. 第二个动作：为 thinking、工具、恢复和协作分别记录证据，不要把日志当成事实账本。
10. 局限提醒：软阈值、工具结果瘦身、摘要、归档、机械折叠、固定尾部与 stuck 熔断。
11. 这一章的结论：Context pipeline 应把成本、缓存稳定性、信息损失和熔断作为不同阈值测试，而不是单一 max-token 截断。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 9aaf8d381a214cd2cb6df774d3b207a646ddd651
