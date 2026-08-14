1. 长任务跑到晚上，token 快爆了，我先看它怎样做 context budget。
2. 这一章不背术语，先看 MiMo-Code 怎样把内核、Compose 和插件能力分开。
3. 固定版本证据：docs/compose/spec/context-budget-control.md，只展示源码片段和中性文件名。
4. 实现事实一：budget|context|token。
5. 实现事实二：--- feature: context-budget-control status: in-progress updated: 2026-08-05 branch: investigate/context-limit-double-rebuild commi。
6. 数据流：目标 → microkernel/Compose 状态 → 工具或 Skill → permission/budget → 结果。
7. 小白动作：先写核心循环，再把插件能力接在边界上。
8. 第二个动作：给每个工具写清输入、handler、结果和权限。
9. 边界提醒：项目横跨 Rust/TypeScript/Bun/Nix，开发门槛高
10. 看到 reducer、budget 和测试证据，再决定是否交付。
11. budget、trim、eviction 和 prefetch 共同维护上下文窗口。
12. 下一章继续用固定提交回答一个真实工作问题。

Fixed commit: 332d7b0db65ccbcdd31a67b897e80dd6f3671b9b
