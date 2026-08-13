1. 同事说批准一次就够了，我把审批策略、默认中止和平台级沙箱拆开。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：codex-rs/protocol/src/protocol.rs:890-932 · 审批策略把“何时问”与“允许做什么”分成两条轴；codex-rs/core/src/session/mod.rs:2295-2376 · 审批缺失默认中止，且可授予一次、本会话或规则/网络修订；codex-rs/sandboxing/src/manager.rs:34-73 · 沙箱按平台变换真实进程：macOS Seatbelt、Linux seccomp/bwrap/landlock、Windows restricted token。
4. 事实一：一条轴决定要不要敲门，另一条轴决定进门后活动范围；“不用问”不等于“拥有整台机器”。
5. 源码含义：企业策略能单独收紧提权频率与文件/网络能力。
6. 事实二：授权不是一个“永远允许”按钮；可以只放这次、放本会话、或把精确规则写进政策，没人回答则停下。
7. 数据流：用户消息 → turn/step 快照 → Provider/工具 → 权限与沙箱 → rollout/SQLite 交付。
8. 小白动作：先把任务拆成状态快照、动作、审批和回放四格，再决定并发方式。
9. 第二个动作：把模型可见工具、真实执行器和审计事件分别记录，不要混成一张列表。
10. 局限提醒：审计审批策略、Guardian/用户裁决、权限 profile 与 macOS/Linux/Windows sandbox 后端。
11. 这一章的结论：企业策略能单独收紧提权频率与文件/网络能力。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 902bd9e06b3ecb32cbf7f8e64cd23b956be3e7fe
