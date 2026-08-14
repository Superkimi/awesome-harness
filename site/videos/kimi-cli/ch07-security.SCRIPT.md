1. 同事说 YOLO 就等于安全，我把多级审批、Plan 写工具拒绝和宿主执行边界拆开。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：src/kimi_cli/soul/approval.py:130-199 · 统一审批支持单次、整会话、拒绝反馈、YOLO 与 AFK；src/kimi_cli/soul/kimisoul.py:409-463 · Plan 模式不是隐藏工具，而是写工具调用时再强制拒绝；src/kimi_cli/agents/default/system.md:67-81 · 默认本地 KAOS 是宿主执行抽象，不是 OS 级沙箱。
4. 事实一：每种危险动作可这次放行、整场放行或拒绝并告诉模型原因；无人值守模式等同自动批准。
5. 源码含义：root、前台和后台子 Agent 共用一个审批面；AFK 是高风险开关，不能理解为只关闭提问。
6. 事实二：root 的 Plan 模式仍让模型知道写工具存在，但真调用时门禁拦下；专门 plan 子 Agent 更严格，工具箱里压根没有写和 shell。
7. 数据流：用户 turn → Soul/Toolset → Provider/并发工具 → approval/compaction → Wire 事件和 session。
8. 小白动作：先给每轮任务留检查点，再把通知、工具、审批和恢复分开记录。
9. 第二个动作：为重复调用、超时、断流和后台任务各写一个明确终态。
10. 局限提醒：统一 approval、YOLO/AFK、Plan gate、hook；本地 KAOS 直接宿主执行，非 OS 沙箱。
11. 这一章的结论：root、前台和后台子 Agent 共用一个审批面；AFK 是高风险开关，不能理解为只关闭提问。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cbc15c076d17f70fec9f89c90c0502e68657f505
