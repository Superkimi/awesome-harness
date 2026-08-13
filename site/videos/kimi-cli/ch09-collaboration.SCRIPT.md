1. 研究和实现要并行，我先看 coder/explore/plan 的工具白名单和前后台恢复。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：src/kimi_cli/soul/agent.py:411-431 · 内建 coder/explore/plan 用代码级工具白名单切分角色；src/kimi_cli/tools/agent/__init__.py:17-60 · 子 Agent 是可恢复的持久实例，可前台或后台运行；src/kimi_cli/soul/agent.py:339-369 · 子 Agent 共享审批/任务/通知底座，但拥有独立 soul/context/模型。
4. 事实一：主 Agent 能雇三种工人：能改代码、只探索、只规划；每种工人拿到的钥匙不同，而且不能继续无限招下级。
5. 源码含义：避免递归爆炸并缩小权限；explore 的 Shell 只读要求部分依赖 prompt，不是命令级只读 parser。
6. 事实二：子 Agent 不是一次性函数调用，而是有身份证和独立笔记本的小会话；以后可以继续找同一个人接着做。
7. 数据流：用户 turn → Soul/Toolset → Provider/并发工具 → approval/compaction → Wire 事件和 session。
8. 小白动作：先给每轮任务留检查点，再把通知、工具、审批和恢复分开记录。
9. 第二个动作：为重复调用、超时、断流和后台任务各写一个明确终态。
10. 局限提醒：coder/explore/plan、前后台执行、持久实例/resume、模型覆盖、统一 approval/wire。
11. 这一章的结论：避免递归爆炸并缩小权限；explore 的 Shell 只读要求部分依赖 prompt，不是命令级只读 parser。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cbc15c076d17f70fec9f89c90c0502e68657f505
